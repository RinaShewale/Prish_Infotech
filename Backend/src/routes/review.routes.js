import express from "express";

import {
  createReview,
  getAllReviews,
  getSingleReview,
  getCourseReviews,
  updateReview,
  deleteReview,
} from "../controllers/review.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();



// PUBLIC ROUTES
router.get("/", getAllReviews);

// IMPORTANT: put specific route first
router.get("/course/:courseId", getCourseReviews);

router.get("/:id", getSingleReview);



// AUTH ROUTES
router.post(
  "/create",
  protect,
  createReview
);

router.put(
  "/:id",
  protect,
  updateReview
);

router.delete(
  "/:id",
  protect,
  deleteReview
);

export default router;