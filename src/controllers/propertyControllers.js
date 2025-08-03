import Property from "../models/propertyModels.js";
import { esClient } from "../elasticSearch/elasticClient.js";

// Create
export const createProperty = async (req, res) => {
  try {
    const property = await Property.create(req.body);
    res.status(201).json({ success: true, data: property });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Read all with filters
export const getAllProperties = async (req, res) => {
  try {
    const { keyword, city, type, status, minPrice, maxPrice, amenities } =
      req.query;

    const filter = {};

    // Keyword search
    if (keyword) {
      filter.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { "location.city": { $regex: keyword, $options: "i" } },
        { "location.locality": { $regex: keyword, $options: "i" } },
      ];
    }

    // City filter
    if (city) filter["location.city"] = city;

    // Type filter
    if (type) filter.type = type;

    // Status filter
    if (status) filter.status = status;

    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = +minPrice;
      if (maxPrice) filter.price.$lte = +maxPrice;
    }

    // Amenities filter (must include all specified amenities)
    if (amenities) {
      const amenitiesArray = amenities.split(",").map((a) => a.trim());
      filter.amenities = { $all: amenitiesArray };
    }

    const properties = await Property.find(filter);
    res.status(200).json({ success: true, data: properties });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Read by ID
export const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: "Not found" });
    res.status(200).json({ success: true, data: property });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Update
export const updateProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!property) return res.status(404).json({ message: "Not found" });
    res.status(200).json({ success: true, data: property });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Delete
export const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) return res.status(404).json({ message: "Not found" });
    res.status(200).json({ success: true, message: "Property deleted" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};


// Suggest properties using ElasticSearch
export const suggestProperties = async (req, res) => {
  const { input } = req.query;

  if (!input || !input.trim()) {
    return res
      .status(400)
      .json({ success: false, message: "Input is required" });
  }

  try {
    const result = await esClient.search({
      index: "properties",
      body: {
        suggest: {
          prop_suggest: {
            prefix: input.toLowerCase(),
            completion: {
              field: "suggest",
              fuzzy: {
                fuzziness: "auto",
              },
              size: 10,
            },
          },
        },
      },
    });

    const suggestions =
      result?.suggest?.prop_suggest?.[0]?.options?.map(
        (option) => option.text
      ) || [];

      const uniqueSuggestions = [];
      for (let i = 0; i < suggestions.length; i++) {
        if (!uniqueSuggestions.includes(suggestions[i])) {
          uniqueSuggestions.push(suggestions[i]);
        }
      }

    res.status(200).json({ success: true, data: uniqueSuggestions });
  } catch (err) {
    console.error(
      "ElasticSearch Suggest Error:",
      JSON.stringify(err.meta?.body?.error || err, null, 2)
    );

    const errMsg =
      err.meta?.body?.error?.reason || err.message || "Unknown error";

    res.status(500).json({
      success: false,
      message: "ElasticSearch suggestion failed",
      error: errMsg,
    });
  }
};
