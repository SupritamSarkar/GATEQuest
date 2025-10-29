import passport from "passport";
import express from "express";
import jwt from "jsonwebtoken";


const router = express.Router();

// ...existing register/login routes

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
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: "10h",
    });

    // redirect user back to frontend with token in query
    res.redirect(`https://gatequest.netlify.app/index.html?token=${token}`);
  }
);

export default router;
