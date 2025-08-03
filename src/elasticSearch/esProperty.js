import Property from "../models/propertyModels.js";
import { esClient } from "./elasticClient.js";

export const addProperty = async (req, res) => {
  try {
    const newProp = new Property(req.body);
    await newProp.save();

    const suggestInputs = [
      newProp.title,
      newProp.location?.city,
      newProp.location?.locality,
      newProp.location?.sector,
      newProp.type,
      newProp.status,
      ...(newProp.amenities || []),
    ].filter(Boolean);

    await esClient.index({
      index: "properties",
      id: newProp._id.toString(),
      document: {
        title: newProp.title,
        suggest: suggestInputs,
        location: newProp.location,
        type: newProp.type,
        price: newProp.price,
        area: newProp.area,
        status: newProp.status,
        amenities: newProp.amenities,
      },
    });
    await esClient.indices.refresh({ index: "properties" });
    res.status(201).json({ success: true, data: newProp });
    console.log("Property added and indexed in ES:", newProp.title);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
