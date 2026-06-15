import express from "express";
import {
  createBootcamp,
  getBootcamps,
  getBootcamp,
} from "../controllers/bootcamp.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/admin.middleware.js";

const router = express.Router();

// PUBLIC
router.get("/", getBootcamps);
router.get("/:id", getBootcamp);

// ADMIN ONLY
router.post("/", protect, adminOnly, createBootcamp);

export default router;