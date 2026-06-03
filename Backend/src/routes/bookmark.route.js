import express from "express";
import {
  addBookmark,
  getBookmarks,
  removeBookmark,
} from "../controllers/bookmark.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, addBookmark);

router.get("/", protect, getBookmarks);

router.delete(
  "/:lessonId",
  protect,
  removeBookmark
);

export default router;