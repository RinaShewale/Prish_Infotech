import express from "express";

import {
  validateCoupon,
  createCoupon,
} from "../controllers/coupon.controller.js";

import { protect } from "../middleware/auth.middleware.js";

import { adminOnly } from "../middleware/admin.middleware.js";

const router = express.Router();


// ✅ CREATE COUPON (ADMIN ONLY)

router.post(
  "/create",
  protect,
  adminOnly,
  createCoupon
);


// ✅ VALIDATE COUPON (USER)

router.post(
  "/validate",
  protect,
  validateCoupon
);

export default router;