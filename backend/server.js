import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import passport from "passport";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import syllabusRoutes from "./routes/syllabusRoutes.js";
import mockTestRoutes from "./routes/mockTestRoutes.js";
import "./config/passport.js";

dotenv.config();
const app = express();

// -----------------------------
// ⚙️ CORS Configuration (Express 5 Safe)
// -----------------------------
const allowedOrigins = [
  "http://localhost:5500",        // Live Server (localhost)
  "http://127.0.0.1:5500",        // Live Server (127)
  "https://gatequest.netlify.app", // Deployed frontend
  "https://gatequest.onrender.com" // Deployed backend
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (e.g., Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("❌ Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// ✅ Apply CORS middleware
app.use(cors(corsOptions));

// ✅ Handle all preflight requests explicitly
app.options(/.*/, cors(corsOptions)); // regex ✅

// -----------------------------
// ✅ Express + Passport setup
// -----------------------------
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// -----------------------------
// 🧩 Routes
// -----------------------------
app.use("/api/v1/auth", authRoutes);
app.use("/api/syllabus", syllabusRoutes);
app.use("/api/mocktests", mockTestRoutes);

// -----------------------------
// ⚡ Health check
// -----------------------------
app.get("/", (req, res) => {
  res.status(200).send("Backend is live ✅");
});

// -----------------------------
// 🚀 Start server
// -----------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
