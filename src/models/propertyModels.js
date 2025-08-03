import mongoose from "mongoose";

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  location: {
    city: { type: String, required: true },
    locality: { type: String, required: true },
    sector: { type: String },
  },
  type: {
    type: String,
    enum: ["2BHK", "3BHK", "Commercial", "Residential"],
    required: true,
  },
  price: { type: Number, required: true },
  area: { type: Number, required: true }, // in sq.ft
  status: { type: String, enum: ["For Sale", "For Rent"], required: true },
  amenities: [{ type: String, enum: ["parking", "pool", "gym", "garden"] }],
});

export default mongoose.model("Property", propertySchema);
