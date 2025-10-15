import mongoose from "mongoose";

const mockTestSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: String,
  date: String,
  score: Number,
  remarks: String,
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model("MockTest", mockTestSchema);
