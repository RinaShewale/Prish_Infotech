import API from "../../../../auth/services/api";

// ================= GET COURSE PROGRESS =================
export const getCourseProgressAPI = async (courseId) => {
  const res = await API.get(`/course-progress/${courseId}`);
  return res.data;
};