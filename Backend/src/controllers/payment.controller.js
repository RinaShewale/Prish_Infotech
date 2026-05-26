import crypto from "crypto";

import razorpay from "../config/razorpay.js";

import Payment from "../models/payment.model.js";

import Enrollment from "../models/Enrollment.model.js";

export const createOrder = async (
  req,
  res
) => {
  try {

    const {
      courseId,
      originalPrice,
      coursePrice,
      discountAmount,
      discountPercent,
      couponCode,
      couponDiscount,
      platformFee,
      gst,
      totalAmount,
    } = req.body;

    const options = {
      amount: totalAmount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order =
      await razorpay.orders.create(
        options
      );

    await Payment.create({
      user: req.user._id,

      course: courseId,

      amount: totalAmount,

      originalPrice,

      coursePrice,

      discountAmount,

      discountPercent,

      couponCode,

      couponDiscount,

      platformFee,

      gst,

      totalAmount,

      razorpayOrderId: order.id,
    });

    res.status(200).json({
      success: true,
      order,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyPayment = async (
  req,
  res
) => {
  try {

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      courseId,
    } = req.body;

    const sign =
      razorpay_order_id +
      "|" +
      razorpay_payment_id;

    const expectedSign =
      crypto
        .createHmac(
          "sha256",
          process.env
            .RAZORPAY_KEY_SECRET
        )
        .update(sign.toString())
        .digest("hex");

    const isAuthentic =
      expectedSign ===
      razorpay_signature;

    if (!isAuthentic) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid payment signature",
      });
    }

    const payment =
      await Payment.findOne({
        razorpayOrderId:
          razorpay_order_id,
      });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message:
          "Payment not found",
      });
    }

    payment.paymentStatus =
      "paid";

    payment.razorpayPaymentId =
      razorpay_payment_id;

    payment.razorpaySignature =
      razorpay_signature;

    payment.paidAt = new Date();

    await payment.save();

    const alreadyEnrolled =
      await Enrollment.findOne({
        user: req.user._id,
        course: courseId,
      });

    if (!alreadyEnrolled) {

      await Enrollment.create({
        user: req.user._id,
        course: courseId,
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Payment verified successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};