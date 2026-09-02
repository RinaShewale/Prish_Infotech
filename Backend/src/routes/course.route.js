import express from "express";

import {
  createCourse,
  getAllCourses,
  getSingleCourse,
  updateCourse,
  deleteCourse,
  uploadCourseVideo,
} from "../controllers/course.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/admin.middleware.js";
import {
  uploadImage,
  uploadVideo,
} from "../middleware/upload.middleware.js";

const router = express.Router();

// ✅ GET ALL COURSES
router.get("/", getAllCourses);

// ✅ CREATE COURSE
router.post(
  "/create",
  protect,
  adminOnly,
  uploadImage.single("thumbnail"),
  createCourse
);

// ✅ GET SINGLE COURSE
router.get("/:slug", getSingleCourse);

// ✅ UPDATE COURSE
router.put(
  "/:id",
  protect,
  adminOnly,
  updateCourse
);

// ✅ DELETE COURSE
router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteCourse
);

// ✅ UPLOAD COURSE VIDEO
router.put(
  "/upload-video/:id",
  protect,
  adminOnly,
  uploadVideo.single("video"),
  uploadCourseVideo
);

export default router;