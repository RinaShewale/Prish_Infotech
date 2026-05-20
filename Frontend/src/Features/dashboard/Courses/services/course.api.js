// ======================================================
// 📁 services/course.api.js
// ======================================================

import API from "../../../auth/services/api";

// GET ALL COURSES
export const getCourses = () =>
  API.get("/course");


// GET SINGLE COURSE (BY SLUG)
export const getSingleCourse = (slug) =>
  API.get(`/course/${slug}`);

// CREATE COURSE
export const createCourse = (data) =>
  API.post("/course/create", data);

// UPDATE COURSE
export const updateCourse = (id, data) =>
  API.put(`/course/${id}`, data);

// DELETE COURSE
export const deleteCourse = (id) =>
  API.delete(`/course/${id}`);

// UPLOAD VIDEO
export const uploadCourseVideo = (
  id,
  data
) =>
  API.put(
    `/course/upload-video/${id}`,
    data
  );