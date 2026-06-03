import API from "../../../auth/services/api";

// ================= GET COURSE WITH LESSONS =================
export const getCourseDetailAPI = async (courseId) => {
  const { data } = await API.get(`/course/details/${courseId}`);
  return data;
};

// ================= GET COURSE BY ID =================
export const getCourseByIdAPI = async (courseId) => {
  const { data } = await API.get(`/course/${courseId}`);
  return data;
};
