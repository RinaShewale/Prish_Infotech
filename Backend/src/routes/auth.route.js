import express from "express";

import {
  registerUser,
  loginUser,
  getProfile,
  googleCallback,
  logoutUser,
  updateProfile,
  updatePassword,
  resetPassword,
  forgotPassword,
} from "../controllers/auth.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import passport from "../config/passport.js";

const router = express.Router();

// ======================
// AUTH ROUTES
// ======================
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getProfile);
router.post("/logout", logoutUser);

router.patch("/profile",protect,updateProfile);


router.post("/forgot-password",forgotPassword);

router.post("/reset-password/:token",resetPassword);

router.put("/update-password",protect,updatePassword);

// ======================
// GOOGLE OAUTH ROUTES
// ======================

/**
 * STEP 1: Redirect to Google
 */
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
    session: false, // 🔥 ADD THIS for consistency
  })
);

/**
 * STEP 2: Google callback
 */
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.CLIENT_URL}/login`,
    session: false,
  }),
  googleCallback
);





export default router;