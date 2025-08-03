import Property from "../models/propertyModels.js";
import { esClient } from "./elasticClient.js";

// Wait for Elasticsearch to be ready
const waitForElastic = async (retries = 5, delay = 5000) => {
  for (let i = 1; i <= retries; i++) {
    try {
      await esClient.ping();
      console.log(" Elasticsearch is ready");
      return;
    } catch (err) {
      console.log(
        `❌ Attempt ${i} failed to ping Elasticsearch: ${err.message}`
      );
      if (i < retries) {
        console.log(` Retrying in ${delay / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        throw new Error(" Elasticsearch is not reachable after retries");
      }
    }
  }
};

const runReindex = async () => {
  try {
    await waitForElastic(); // Wait until ES is ready

    const allProps = await Property.find();
    console.log(" Total properties found:", allProps.length);

    for (const prop of allProps) {
      const suggestInputs = [
        prop.title,
        prop.location?.city,
        prop.location?.locality,
        prop.location?.sector,
        prop.type,
        prop.status,
        ...(prop.amenities || []),
      ].filter(Boolean);

      await esClient.index({
        index: "properties",
        id: prop._id.toString(),
        document: {
          title: prop.title,
          suggest: suggestInputs,
          location: prop.location,
          type: prop.type,
          price: prop.price,
          area: prop.area,
          status: prop.status,
          amenities: prop.amenities,
        },
      });
    }

    await esClient.indices.refresh({ index: "properties" });
    console.log(" All properties reindexed in Elasticsearch");
  } catch (err) {
    console.error(" Error during reindexing:", err.message);
  }
};

export default runReindex;
