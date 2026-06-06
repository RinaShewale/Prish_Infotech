import express from "express";
import { uploadImage, uploadVideo } from "../middleware/upload.middleware.js";
import { protect } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/admin.middleware.js";

const router = express.Router();

// 📸 IMAGE UPLOAD (ADMIN ONLY)
router.post(
  "/image",
  protect,
  adminOnly,
  uploadImage.single("image"),
  (req, res) => {
    res.json({
      success: true,
      url: req.file.path,
    });
  }
);

// 🎥 VIDEO UPLOAD (ADMIN ONLY)
router.post(
  "/video",
  protect,
  adminOnly,
  uploadVideo.single("video"),
  (req, res) => {
    res.json({
      success: true,
      url: req.file.path,
    });
  }
);

export default router;