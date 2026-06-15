import API, { PUBLIC_API } from "../../../auth/services/api";

// ======================
// GET ALL BOOTCAMPS
// ======================
export const fetchBootcampsAPI = async () => {
  const res = await PUBLIC_API.get("/bootcamps");
  return res.data;
};

// ======================
// GET SINGLE BOOTCAMP
// ======================
export const fetchBootcampByIdAPI = async (id) => {
  const res = await PUBLIC_API.get(`/bootcamps/${id}`);

  console.log("RAW API RESPONSE:", res);

  return res.data; // MUST contain { bootcamp }
};


// ======================
// CREATE BOOTCAMP (ADMIN)
// ======================
export const createBootcampAPI = async (data) => {
  const res = await API.post("/bootcamps", data);
  return res.data;
};