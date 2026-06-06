import express from "express";
import { createMedia, getMedia } from "../controllers/media.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/admin.middleware.js";

const router = express.Router();

// 📥 SAVE MEDIA (ADMIN ONLY)
router.post("/create", protect, adminOnly, createMedia);

// 📤 GET MEDIA (PUBLIC)
router.get("/", getMedia);

export default router;