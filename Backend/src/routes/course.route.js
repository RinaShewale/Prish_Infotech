import express from "express";

import {
  getAllCourses,
  getSingleCourse,
  uploadCourseVideo,
} from "../controllers/course.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/admin.middleware.js";
import { uploadVideo } from "../middleware/upload.middleware.js";

const router = express.Router();

// ✅ GET ALL COURSES
router.get("/", getAllCourses);

// ✅ GET SINGLE COURSE
router.get("/:slug", getSingleCourse);

// ✅ UPLOAD COURSE VIDEO
router.put(
  "/upload-video/:id",
  protect,
  adminOnly,
  uploadVideo.single("video"),
  uploadCourseVideo
);

export default router;