import express from "express";

import {
  getDashboard,
  blockUser,
} from "../controllers/admin.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/admin.middleware.js";
import { uploadImage } from "../middleware/upload.middleware.js";

const router = express.Router();

// Dashboard
router.get("/dashboard", protect, adminOnly, getDashboard);

// Users
router.put("/users/:id/block", protect, adminOnly, blockUser);


export default router;