import passport from "passport";
import express from "express";
import jwt from "jsonwebtoken";
import { registerUser, loginUser } from "../controllers/authControllers.js";



const router = express.Router();


// Existing imports for registerUser and loginUser
router.post("/register", registerUser);
router.post("/login", loginUser);

// ✅ Google Auth route
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// ✅ Google Callback route
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "https://gatequest.netlify.app/auth.html" }),
  (req, res) => {
    // Redirect to frontend with JWT token (optional)
    const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, {
      expiresIn: "10h",
    });

    // redirect user back to frontend with token in query
    res.redirect(`https://gatequest.netlify.app/index.html?token=${token}`);
  }
);



export default router;
