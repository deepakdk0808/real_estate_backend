import express from "express";
import dotenv from "dotenv";
import cors from "cors"; 
import connectDB from "./configs/db.js";
import propertyRoutes from "./routes/propertyRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { createPropertyIndex } from "./elasticSearch/esIndex.js";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: ["https://real-estate-frontend-umber.vercel.app/", "http://localhost:3000"],
    credentials: true,
  })
);

app.use(express.json());

// Create ES index if not exists
createPropertyIndex();

// Routes
app.use("/api/properties", propertyRoutes);
app.use("/api/auth", authRoutes);

// Start server after DB connects
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

export default app;
