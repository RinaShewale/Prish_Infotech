
// 📁 services/course.api.js


import API, {
  PUBLIC_API,
} from "../../../auth/services/api";


// 🌍 GET ALL COURSES

// Public Route
//
// Used on:
// - Home Page
// - Courses Page
// - Landing Page
//
// Accessible without login/register.


export const getCourses = () =>
  PUBLIC_API.get("/course");


// 🌍 GET SINGLE COURSE

// Public Route
//
// Used for course details page.
//
// Example:
// /course/full-stack-development
//
// Accessible without login/register.


export const getSingleCourse = (
  slug
) =>
  PUBLIC_API.get(
    `/course/${slug}`
  );


// 🔐 CREATE COURSE

// Protected Route
//
// Only admin/instructor can create course.
// Requires authentication.


export const createCourse = (
  data
) =>
  API.post(
    "/course/create",
    data
  );


// 🔐 UPDATE COURSE

// Protected Route
//
// Only admin/instructor can update course.
// Requires authentication.


export const updateCourse = (
  id,
  data
) =>
  API.put(
    `/course/${id}`,
    data
  );


// 🔐 DELETE COURSE

// Protected Route
//
// Only admin/instructor can delete course.
// Requires authentication.


export const deleteCourse = (
  id
) =>
  API.delete(
    `/course/${id}`
  );


// 🔐 UPLOAD COURSE VIDEO

// Protected Route
//
// Only authenticated admin/instructor
// can upload videos.
// Requires authentication.


export const uploadCourseVideo = (
  id,
  data
) =>
  API.put(
    `/course/upload-video/${id}`,
    data
  );