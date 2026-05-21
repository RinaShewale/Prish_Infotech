// ======================================================
// 📁 routes/contact.routes.js
// ======================================================

import express from "express";

import {
  createContact,
  getAllContacts,
  deleteContact,
} from "../controllers/contact.controller.js";

import { protect } from "../middleware/auth.middleware.js";

import { adminOnly } from "../middleware/admin.middleware.js";

const router = express.Router();


// ✅ CREATE CALLBACK REQUEST (PUBLIC)

router.post("/create", createContact);


// ✅ GET ALL CALLBACK REQUESTS (ADMIN ONLY)

router.get(
  "/all",
  protect,
  adminOnly,
  getAllContacts
);


// ✅ DELETE CALLBACK REQUEST (ADMIN ONLY)

router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteContact
);

export default router;