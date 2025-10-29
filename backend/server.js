import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import syllabusRoutes from "./routes/syllabusRoutes.js";
import mockTestRoutes from "./routes/mockTestRoutes.js";
import "./config/passport.js";
import session from "express-session";
import passport from "passport";

dotenv.config();
const app = express();

// -----------------------------
// ⚙️ CORS Configuration
// -----------------------------
const allowedOrigins = [
  "http://localhost:5500",           // for local testing
  "https://gatequest.netlify.app",   // your Netlify frontend
];

//Cors middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (like Postman or curl)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


// ✅ Sessions (required for Passport)
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// ✅ Passport
app.use(passport.initialize());
app.use(passport.session());


//JSON parser middleware
app.use(express.json());
connectDB();

// -----------------------------
// ⚡ Database Connection
// -----------------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// -----------------------------
// 🧩 Routes
// -----------------------------
app.use("/api/v1/auth", authRoutes);
app.use("/api/syllabus", syllabusRoutes);
app.use("/api/mocktests", mockTestRoutes);

// ✅ Health check
app.get("/", (req, res) => {
  res.status(200).send("Backend is live ✅");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
