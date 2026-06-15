import express from "express";
import {
  getNotifications,
  createNotification,
  markAsRead,
  deleteNotification,
} from "../controllers/notification.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/admin.middleware.js";

const router = express.Router();

// ✅ USER: get their notifications
router.get("/", protect, getNotifications);

// 🔥 ADMIN ONLY: create notification
router.post("/", protect, adminOnly, createNotification);

// ✅ USER: mark as read
router.put("/:id/read", protect, markAsRead);

// 🔥 ADMIN ONLY: delete notification (optional strict control)
router.delete("/:id", protect, adminOnly, deleteNotification);

export default router;