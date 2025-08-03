import { esClient } from "./elasticClient.js";

export const createPropertyIndex = async () => {
  const MAX_RETRIES = 5;
  const RETRY_DELAY_MS = 5000;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const exists = await esClient.indices.exists({ index: "properties" });
      if (exists) {
        console.log("Elasticsearch index already exists");
        return;
      }
      await esClient.indices.create({
        index: "properties",
        body: {
          mappings: {
            properties: {
              title: {
                type: "text",
                analyzer: "standard",
              },
              suggest: {
                type: "completion",
              },
              location: {
                properties: {
                  city: { type: "text" },
                  locality: { type: "text" },
                  sector: { type: "text" },
                },
              },
              type: { type: "keyword" },
              price: { type: "double" },
              area: { type: "double" },
              status: { type: "keyword" },
              amenities: { type: "keyword" },
            },
          },
        },
      });

      console.log("✅ Elasticsearch index created");
      return;
    } catch (err) {
      console.error(
        `Attempt ${attempt} failed to connect to Elasticsearch: ${err.message}`
      );
      if (attempt < MAX_RETRIES) {
        console.log(`Retrying in ${RETRY_DELAY_MS / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      } else {
        console.error("Max retries reached. Exiting...");
        process.exit(1);
      }
    }
  }
};
