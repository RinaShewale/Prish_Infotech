import crypto from "crypto";
import razorpay from "../config/razorpay.js";
import Payment from "../models/payment.model.js";
import Enrollment from "../models/Enrollment.model.js";

// ================= CREATE ORDER =================
export const createOrder = async (req, res) => {
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

    const order = await razorpay.orders.create(options);

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

// ================= VERIFY PAYMENT =================
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      courseId,
    } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    // ❌ Invalid signature
    if (expectedSign !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    const payment = await Payment.findOne({
      razorpayOrderId: razorpay_order_id,
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    // ================= ALREADY PAID SAFE CHECK =================
    if (payment.paymentStatus === "paid") {
      const existingEnrollment = await Enrollment.findOne({
        user: req.user._id,
        course: courseId,
      });

      return res.status(200).json({
        success: true,
        message: "Already processed payment",
        enrolled: true,
        alreadyEnrolled: true,
        enrollment: existingEnrollment || null,
      });
    }

    // ================= MARK PAYMENT AS PAID =================
    payment.paymentStatus = "paid";
    payment.razorpayPaymentId = razorpay_payment_id;
    payment.razorpaySignature = razorpay_signature;
    payment.paidAt = new Date();

    await payment.save();

    // ================= CREATE ENROLLMENT SAFELY =================
    let enrollment = await Enrollment.findOne({
      user: req.user._id,
      course: courseId,
    });

    if (!enrollment) {
      enrollment = await Enrollment.create({
        user: req.user._id,
        course: courseId,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      enrolled: true,
      alreadyEnrolled: false,
      enrollment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};