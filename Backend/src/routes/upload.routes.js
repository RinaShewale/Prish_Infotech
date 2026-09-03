import express from "express";
import { uploadImage, uploadVideo, uploadFile } from "../middleware/upload.middleware.js";
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
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image uploaded" });
    }

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
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No video uploaded" });
    }

    res.json({
      success: true,
      url: req.file.path,
    });
  }
);

// 📁 GENERIC FILE UPLOAD (ADMIN ONLY)
router.post(
  "/file",
  protect,
  adminOnly,
  uploadFile.single("file"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    res.json({
      success: true,
      url: req.file.path,
      filename: req.file.originalname,
    });
  }
);

router.use((error, req, res, next) => {
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "File upload failed",
    });
  }

  next();
});

export default router;