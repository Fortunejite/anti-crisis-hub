import mongoose from "mongoose";

export interface IRequest extends mongoose.Document {
  seeker: string | mongoose.Schema.Types.ObjectId;
  resource: string | mongoose.Schema.Types.ObjectId;
  status: 'Pending' | 'Fulfilled'
}

const requestSchema = new mongoose.Schema<IRequest>({
  seeker: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  resource: { type: mongoose.Schema.Types.ObjectId, ref: "Resource", required: true },
  status: { 
    type: String, 
    enum: ["Pending", "Fulfilled"], 
    default: "Pending" 
  },
}, { timestamps: true });

const Request: mongoose.Model<IRequest> = mongoose.models.Request || mongoose.model<IRequest>("Request", requestSchema);
export default Request;
