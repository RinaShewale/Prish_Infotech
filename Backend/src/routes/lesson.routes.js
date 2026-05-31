import express from "express";

import {
  createLesson,
  getAllLessons,
  getSingleLesson,
  getLessonsByCourse,
  updateLesson,
  deleteLesson,
} from "../controllers/lesson.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/admin.middleware.js";

const router = express.Router();



// ================= PUBLIC ROUTES =================

// GET ALL LESSONS
router.get("/", getAllLessons);



// ================= PROTECTED ROUTES =================

// GET LESSONS BY COURSE
router.get(
  "/course/:courseId",
  protect,
  getLessonsByCourse
);

// GET SINGLE LESSON
router.get(
  "/:id",
  protect,
  getSingleLesson
);



// ================= ADMIN ROUTES =================

// CREATE LESSON
router.post(
  "/create",
  protect,
  adminOnly,
  createLesson
);

// UPDATE LESSON
router.put(
  "/:id",
  protect,
  adminOnly,
  updateLesson
);

// DELETE LESSON
router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteLesson
);

export default router;