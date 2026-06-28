import API from "../../../auth/services/api";

// GET MEDIA
export const getMedia = () => {
  return API.get("/media");
};

// CREATE / UPDATE MEDIA
export const createMedia = (data) => {
  return API.post("/media/create", data);
};