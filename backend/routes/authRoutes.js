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
  passport.authenticate("google", {
    failureRedirect: "https://gatequest.netlify.app/auth.html",
  }),
  (req, res) => {
    // 1. Create the token
    const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, {
      expiresIn: "10h",
    });

    // 2. Get the user object from Passport
    // We only send the non-sensitive parts (or all of it, if your model is clean)
    const user = {
      _id: req.user._id,
      fullName: req.user.fullName,
      email: req.user.email,
    };

    // 3. Stringify and URL-encode the user object
    const userQuery = encodeURIComponent(JSON.stringify(user)); // 4. Redirect with BOTH token and user in the query

    res.redirect(
      `https://gatequest.netlify.app/auth.html?token=${token}&user=${userQuery}`
    );
  }
);

export default router;
