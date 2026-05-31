import express from "express";

import {
  createProblem,
  getProblemsByLesson,
} from "../controllers/problem.controller.js";

import {
  protect,
} from "../middleware/auth.middleware.js";

import {
  adminOnly,
} from "../middleware/admin.middleware.js";

const router = express.Router();



// GET PROBLEMS
router.get(
  "/lesson/:lessonId",
  protect,
  getProblemsByLesson
);



// CREATE PROBLEM
router.post(
  "/create",
  protect,
  adminOnly,
  createProblem
);

export default router;