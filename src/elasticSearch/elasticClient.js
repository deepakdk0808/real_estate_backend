import { Client } from "@elastic/elasticsearch";
import dotenv from "dotenv";
dotenv.config();

const { ELASTICSEARCH_URL, ELASTIC_CLIENT_USERNAME, ELASTIC_CLIENT_PASSWORD } = process.env;

export const esClient = new Client({
  node: ELASTICSEARCH_URL,
  auth: {
    username: ELASTIC_CLIENT_USERNAME,
    password: ELASTIC_CLIENT_PASSWORD,
  },
});


