import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import syllabusRoutes from "./routes/syllabusRoutes.js";
import mockTestRoutes from "./routes/mockTestRoutes.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
connectDB();


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB error:", err));


app.use("/api/v1/auth", authRoutes);
app.use("/api/syllabus", syllabusRoutes);
app.use("/api/mocktests", mockTestRoutes);

// ✅ Health check
app.get("/", (req, res) => {
  res.status(200).send("Backend is live ✅");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
