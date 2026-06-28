import express from "express";
import {
  getDashboard,
  createCourse,
  getAllCourses,
  updateCourse,
  deleteCourse,
  getAllUsers,
  blockUser,
  getEnrollments,
  getCourseStudents,
} from "../controllers/admin.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/admin.middleware.js";

const router = express.Router();


/* DASHBOARD */
router.get("/dashboard", protect, adminOnly, getDashboard);

/* COURSES */
router.post("/courses", protect, adminOnly, createCourse);
router.get("/courses", protect, adminOnly, getAllCourses);
router.put("/courses/:id", protect, adminOnly, updateCourse);
router.delete("/courses/:id", protect, adminOnly, deleteCourse);

/* USERS */
router.get("/users", protect, adminOnly, getAllUsers);
router.patch("/users/:id", protect, adminOnly, blockUser);

/* ENROLLMENTS */
router.get("/enrollments", protect, adminOnly, getEnrollments);
router.get("/courses/:courseId/students", protect, adminOnly, getCourseStudents);

export default router;