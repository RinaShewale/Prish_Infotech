import express from "express";
import { getCourseProgress } from "../controllers/courseProgress.controller.js";
import { protect } from "../middleware//auth.middleware.js";

const router = express.Router();

router.get("/:courseId", protect, getCourseProgress);

export default router;