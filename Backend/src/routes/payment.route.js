import express from "express";

import {
  createOrder,
  getAllPayments,
  verifyPayment,
} from "../controllers/payment.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import {adminOnly} from "../middleware/admin.middleware.js"

const router = express.Router();

router.post(
  "/create-order",
  protect,
  createOrder
);

router.post(
  "/verify",
  protect,
  verifyPayment
);



router.get("/all-transactions", protect, adminOnly, getAllPayments);


export default router;