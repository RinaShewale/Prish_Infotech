// ======================================================
// 📁 middleware/upload.middleware.js
// ======================================================

import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

// ================= IMAGE STORAGE =================
const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "prish-infotech/images",
    allowed_formats: [
      "jpg",
      "jpeg",
      "png",
      "webp",
    ],
  },
});

// ================= VIDEO STORAGE =================
const videoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "prish-infotech/videos",
    resource_type: "video",
    allowed_formats: ["mp4", "mov", "avi"],
  },
});

// ================= EXPORTS =================
export const uploadImage = multer({
  storage: imageStorage,
});

export const uploadVideo = multer({
  storage: videoStorage,
});