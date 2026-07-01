import express from "express";
import {
  createBootcamp,
  getBootcamps,
  getAdminBootcamps,
  getBootcamp,
  updateBootcamp,
  deleteBootcamp,
} from "../controllers/bootcamp.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/admin.middleware.js";

const router = express.Router();

// PUBLIC
router.get("/", getBootcamps);
router.get("/admin/all", protect, adminOnly, getAdminBootcamps);
router.get("/:id", getBootcamp);

// ADMIN ONLY
router.post("/", protect, adminOnly, createBootcamp);
router.put("/:id", protect, adminOnly, updateBootcamp);
router.delete("/:id", protect, adminOnly, deleteBootcamp);

export default router;