import express from "express";
import { getAdminCourseProgress, getCourseProgress } from "../controllers/courseProgress.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/admin.middleware.js";
const router = express.Router();

router.get("/:courseId", protect, getCourseProgress);
router.get("/admin/:courseId/:userId",protect,adminOnly,getAdminCourseProgress);

export default router;