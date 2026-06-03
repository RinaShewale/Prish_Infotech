import express from "express";
import {
  getCourseLeaderboard,
  getTopUsers,
} from "../controllers/leaderboard.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get(
  "/course/:courseId",
  protect,
  getCourseLeaderboard
);

router.get(
  "/top",
  protect,
  getTopUsers
);

export default router;