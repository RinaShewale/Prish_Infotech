import express from "express";

import {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
} from "../controllers/review.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getAllReviews);

router.get("/:id", getSingleReview);

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