import API from "../../../auth/services/api";

// GET MEDIA DATA
export const getMedia = () => {
  return API.get("/media");
};

// SAVE METADATA (The $set logic)
export const createMedia = (data) => {
  return API.post("/media/create", data);
};

// UPLOAD IMAGE FILE
export const uploadMediaImage = (formData) => {
  return API.post("/media/image", formData);
};

// UPLOAD VIDEO FILE
export const uploadMediaVideo = (formData) => {
  return API.post("/media/video", formData);
};