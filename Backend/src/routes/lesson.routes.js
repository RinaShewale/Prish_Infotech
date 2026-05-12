import express from "express";

import {
  createLesson,
  getAllLessons,
  getSingleLesson,
  updateLesson,
  deleteLesson,
} from "../controllers/lesson.controller.js";

import {
  protect,
  adminOnly,
} from "../middleware/auth.middleware.js";

const router = express.Router();



// PUBLIC ROUTES
router.get("/", getAllLessons);

router.get("/:id", getSingleLesson);



// ADMIN ROUTES
router.post(
  "/create",
  protect,
  adminOnly,
  createLesson
);

router.put(
  "/:id",
  protect,
  adminOnly,
  updateLesson
);

router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteLesson
);

export default router;