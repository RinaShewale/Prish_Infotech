import API, { PUBLIC_API } from "../../../auth/services/api";

// ======================
// GET ALL BOOTCAMPS
// ======================
export const fetchBootcampsAPI = async () => {
  const res = await PUBLIC_API.get("/bootcamps");
  return res.data;
};

// ======================
// GET ADMIN BOOTCAMPS
// ======================
export const fetchAdminBootcampsAPI = async () => {
  const res = await API.get("/bootcamps/admin/all");
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

// ======================
// UPDATE BOOTCAMP (ADMIN)
// ======================
export const updateBootcampAPI = async (id, data) => {
  const res = await API.put(`/bootcamps/${id}`, data);
  return res.data;
};

// ======================
// DELETE BOOTCAMP (ADMIN)
// ======================
export const deleteBootcampAPI = async (id) => {
  const res = await API.delete(`/bootcamps/${id}`);
  return res.data;
};