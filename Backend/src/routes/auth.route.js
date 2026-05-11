import express from "express";

import {
  registerUser,
  loginUser,
  getProfile,
} from "../controllers/auth.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// ======================
// AUTH ROUTES
// ======================

// Register user
router.post("/register", registerUser);

// Login user
router.post("/login", loginUser);

// Get logged-in user profile (protected)
router.get("/me", protect, getProfile);

export default router;