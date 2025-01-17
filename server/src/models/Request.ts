import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
  seeker: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, required: true }, // e.g., food, shelter
  description: { type: String, required: true },
  location: {
    type: { type: String, enum: ["Point"], required: true },
    coordinates: { type: [Number], required: true }
  },
  status: { 
    type: String, 
    enum: ["Pending", "Fulfilled"], 
    default: "Pending" 
  },
}, { timestamps: true });

requestSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Request", requestSchema);
