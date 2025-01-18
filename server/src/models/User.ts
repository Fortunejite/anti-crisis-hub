import mongoose from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  phone: string;
  profileImage?: string;
  role: 'user' | 'admin';
  location: {
    type: 'Point',
    coordinates: number[]
  }
  comparePassword: (password: string) => Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUser>({
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

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

userSchema.index({ location: "2dsphere" }); // Enable geospatial queries

const User: mongoose.Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema)
export default User;