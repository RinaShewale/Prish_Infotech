import express from "express";

import {
  saveLessonProgress,
  getLessonProgress,
} from "../controllers/lessonProgress.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post(
  "/save",
  protect,
  saveLessonProgress
);

router.get(
  "/:lessonId",
  protect,
  getLessonProgress
);

export default router;