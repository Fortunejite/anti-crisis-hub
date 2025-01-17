import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ["Seeker", "Provider", "Admin"], 
    required: true 
  },
  location: {
    type: { type: String, enum: ["Point"], required: true },
    coordinates: { type: [Number], required: true } // [longitude, latitude]
  },
  phone: { type: String, required: true },
  profileImage: { type: String }, // URL to image
}, { timestamps: true });

userSchema.index({ location: "2dsphere" }); // Enable geospatial queries

module.exports = mongoose.model("User", userSchema);
