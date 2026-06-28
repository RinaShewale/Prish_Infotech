import API from "../../../auth/services/api"; // your axios instance

// ================= DASHBOARD =================
export const getDashboard = () => API.get("/admin/dashboard");

// ================= COURSES =================
export const createCourse = (data) => API.post("/admin/courses", data);

export const getAllCourses = () => API.get("/admin/courses");

export const updateCourse = (id, data) =>
  API.put(`/admin/courses/${id}`, data);

export const deleteCourse = (id) =>
  API.delete(`/admin/courses/${id}`);

// ================= USERS =================
export const getAllUsers = () => API.get("/admin/users");

// Backend route: PATCH /admin/users/:id (toggles isBlocked)
export const blockUser = (id) => API.patch(`/admin/users/${id}`);

// ================= ENROLLMENTS =================
export const getEnrollments = () => API.get("/admin/enrollments");

export const getCourseStudents = (courseId) =>
  API.get(`/admin/courses/${courseId}/students`);


// ================= UPLOAD =================
export const uploadImage = (formData) =>
  API.post("/upload/image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const uploadVideo = (formData) =>
  API.post("/upload/video", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });