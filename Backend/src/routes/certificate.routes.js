import express from "express";
import {
  createCertificate,
  getAllCertificates,
  getUserCertificates,
  getCertificateById,
  deleteCertificate,
} from "../controllers/certificate.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// ===============================
// 🎓 CREATE CERTIFICATE
// ===============================
router.post("/create", protect, createCertificate);

// ===============================
// 📥 GET ALL CERTIFICATES
// ===============================
router.get("/all", getAllCertificates);

// ===============================
// 👤 USER CERTIFICATES
// ===============================
router.get("/me", protect, getUserCertificates);

// ===============================
// 🔍 SINGLE CERTIFICATE
// ===============================
router.get("/:id", protect, getCertificateById);

// ===============================
// 🗑️ DELETE CERTIFICATE
// ===============================
router.delete("/:id", protect, deleteCertificate);

export default router;