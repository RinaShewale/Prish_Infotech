import razorpay from "../config/razorpay.js";
import Payment from "../models/payment.model.js";

export const createOrder = async (req, res) => {
  try {
    const { amount, courseId } = req.body;

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    await Payment.create({
      user: req.user._id,
      course: courseId,
      amount,
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