import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema({
  provider: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, required: true }, // e.g., food, shelter, medical aid
  description: { type: String, required: true }, // e.g., "5 bags of rice"
  quantity: { type: Number, required: true },
  location: {
    type: { type: String, enum: ["Point"], required: true },
    coordinates: { type: [Number], required: true } // [longitude, latitude]
  },
  availability: { type: Boolean, default: true }, // Is the resource still available?
  images: [{ type: String }], // Array of image URLs
  expirationDate: { type: Date }, // Optional
}, { timestamps: true });

resourceSchema.index({ location: "2dsphere" });

const Resource = mongoose.models.Resource || mongoose.model("Resource", resourceSchema);
export default Resource;
