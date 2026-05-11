import express from "express";
import { uploadImage } from "../middleware/upload.middleware.js";

const router = express.Router();

// ======================
// IMAGE UPLOAD ROUTE
// ======================
router.post("/upload", uploadImage.single("image"), (req, res) => {
  try {
    res.status(200).json({
      success: true,
      file: req.file,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;