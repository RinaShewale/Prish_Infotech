import express from "express";

import {
  validateCoupon,
  createCoupon,
  listCoupons,
  getCoupon,
  updateCoupon,
  deleteCoupon,
  toggleCouponStatus,
} from "../controllers/coupon.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/admin.middleware.js";

const router = express.Router();

router.get("/admin", protect, adminOnly, listCoupons);
router.get("/admin/:id", protect, adminOnly, getCoupon);
router.post("/create", protect, adminOnly, createCoupon);
router.put("/:id", protect, adminOnly, updateCoupon);
router.patch("/:id/toggle", protect, adminOnly, toggleCouponStatus);
router.delete("/:id", protect, adminOnly, deleteCoupon);
router.post("/validate", protect, validateCoupon);

export default router;