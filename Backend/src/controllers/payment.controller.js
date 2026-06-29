import crypto from "crypto";
import razorpay from "../config/razorpay.js";
import Payment from "../models/payment.model.js";
import Enrollment from "../models/Enrollment.model.js";

// ================= CREATE ORDER =================
export const createOrder = async (req, res) => {
  try {
    console.log("🔥 CREATE ORDER BODY:", req.body);
    console.log("👤 USER:", req.user?._id);

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

    // ---------------- AUTH CHECK ----------------
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user",
      });
    }

    // ---------------- VALIDATION ----------------
    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "courseId is required",
      });
    }

    const amount = Number(totalAmount);

    if (!amount || isNaN(amount)) {
      return res.status(400).json({
        success: false,
        message: "Invalid totalAmount",
      });
    }

    // ---------------- CHECK ENROLLMENT ----------------
    const alreadyEnrolled = await Enrollment.findOne({
      user: req.user._id,
      course: courseId,
    });

    if (alreadyEnrolled) {
      return res.status(200).json({
        success: true,
        alreadyEnrolled: true,
        message: "Already enrolled",
      });
    }

    // ================= CREATE RAZORPAY ORDER =================
    let order;

    try {
      const options = {
        amount: Math.round(amount * 100), // paise conversion
        currency: "INR",
        receipt: `rcpt_${Date.now()}`,
      };

      order = await razorpay.orders.create(options);

      console.log("✅ Razorpay Order Created:", order.id);

    } catch (err) {
      console.log("❌ Razorpay Order Error:", err);

      return res.status(500).json({
        success: false,
        message: "Razorpay order creation failed",
        error: err.message,
      });
    }

    if (!order || !order.id) {
      return res.status(500).json({
        success: false,
        message: "Failed to create order",
      });
    }

    // ================= SAVE PAYMENT =================
    await Payment.create({
      user: req.user._id,
      course: courseId,
      amount,
      originalPrice: originalPrice || 0,
      coursePrice: coursePrice || 0,
      discountAmount: discountAmount || 0,
      discountPercent: discountPercent || 0,
      couponCode: couponCode || "",
      couponDiscount: couponDiscount || 0,
      platformFee: platformFee || 0,
      gst: gst || 0,
      totalAmount: amount,
      currency: "INR",
      razorpayOrderId: order.id,
      paymentStatus: "pending",
    });

    return res.status(200).json({
      success: true,
      alreadyEnrolled: false,
      order,
    });

  } catch (error) {
    console.log("🔥 CREATE ORDER ERROR:", error);

    return res.status(500).json({
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

    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user",
      });
    }

    // ---------------- SIGNATURE CHECK ----------------
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    // ---------------- FIND PAYMENT ----------------
    const payment = await Payment.findOne({
      razorpayOrderId: razorpay_order_id,
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    // ---------------- ALREADY PAID CHECK ----------------
    if (payment.paymentStatus === "paid") {
      return res.status(200).json({
        success: true,
        enrolled: true,
        message: "Already processed",
      });
    }

    // ---------------- UPDATE PAYMENT ----------------
    payment.paymentStatus = "paid";
    payment.razorpayPaymentId = razorpay_payment_id;
    payment.razorpaySignature = razorpay_signature;
    payment.paidAt = new Date();

    await payment.save();

    // ---------------- CREATE ENROLLMENT ----------------
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
      enrolled: true,
      enrollment,
    });

  } catch (error) {
    console.log("🔥 VERIFY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("user", "name email")    // 🔥 This fetches student name/email from User model
      .populate("course", "title price") // 🔥 This fetches course title from Course model
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      payments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch transactions",
      error: error.message
    });
  }
};