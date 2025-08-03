import mongoose from "mongoose";
import reIndex from "../elasticSearch/reIndex.js";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
    });
    console.log(` MongoDB connected: ${conn.connection.host}`);

    // Try reindexing after DB connection
    try {
      await reIndex();
    } catch (err) {
      console.error(" Elasticsearch reindexing error:", err.message);
    }
  } catch (error) {
    console.error(" MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
