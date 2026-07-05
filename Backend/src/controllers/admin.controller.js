import User from "../models/User.model.js";
import Course from "../models/Course.model.js";
import Enrollment from "../models/Enrollment.model.js";
import Payment from "../models/Payment.model.js";
import LessonProgress from "../models/LessonProgress.model.js";
import CourseProgress from "../models/CourseProgress.model.js";
import Contact from "../models/Contact.model.js";





/* ======================================================
   📊 DASHBOARD
====================================================== */
export const getDashboard = async (req, res) => {
  try {
    const users = await User.countDocuments();
    const courses = await Course.countDocuments();
    const enrollments = await Enrollment.countDocuments();
    const contacts = await Contact.countDocuments();
    const payments = await Payment.find({ paymentStatus: "paid" });

    const revenue = payments.reduce(
      (acc, p) => acc + (p.amount || 0),
      0
    );

    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name email role createdAt");

    res.json({
      success: true,
      data: {
        users,
        courses,
        enrollments,
        contacts,
        revenue,
        recentUsers,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// BLOCK / UNBLOCK USER
export const blockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.isBlocked = !user.isBlocked; // (add field later if needed)
    await user.save();

    res.json({
      success: true,
      message: "User status updated",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
