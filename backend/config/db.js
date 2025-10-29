import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    console.log("🔄 Trying to connect to MongoDB...");
    console.log("🧩 Using URI:", process.env.MONGO_URI ? "Found ✅" : "Missing ❌");

    const conn = await mongoose.connect(process.env.MONGO_URI, {
    });

    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
