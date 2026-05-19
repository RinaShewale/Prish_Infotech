import express from "express";

import {
  createCourse,
  getAllCourses,
  getSingleCourse,
  updateCourse,
  deleteCourse,
} from "../controllers/course.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/admin.middleware.js";

const router = express.Router();

router.post(
  "/create",protect,adminOnly, createCourse);

router.get("/", getAllCourses);

router.get("/:id", getSingleCourse);

router.put("/:id", updateCourse);

router.delete("/:id", deleteCourse);

export default router;