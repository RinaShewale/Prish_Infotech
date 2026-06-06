import API  from "../../../../auth/services/api";

import { PUBLIC_API } from "../../../../auth/services/api";

// 📤 GET MEDIA (PUBLIC)
export const getMediaAPI = () => PUBLIC_API.get("/media");

// 📥 CREATE MEDIA (ADMIN ONLY)
export const createMediaAPI = (data) =>
  API.post("/media/create", data);

// 📸 UPLOAD IMAGE (ADMIN ONLY)
export const uploadImageAPI = (formData) =>
  API.post("/upload/image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

// 🎥 UPLOAD VIDEO (ADMIN ONLY)
export const uploadVideoAPI = (formData) =>
  API.post("/upload/video", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });