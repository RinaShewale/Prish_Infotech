import { configureStore } from "@reduxjs/toolkit";

// ================= AUTH =================
import authReducer from "../Features/auth/redux/auth.slice";

// ================= COURSE =================
import courseReducer from "../Features/dashboard/Courses/redux/course.slice";
import courseDetailReducer from "../Features/dashboard/Courses/redux/courseDetail.slice";

// ================= DASHBOARD =================
import contactReducer from "../Features/auth/redux/contact.slice";
import reviewReducer from "../Features/dashboard/Home/components/redux/review.slice";

// ================= COURSE MODULES =================
import certificateReducer from "../Features/dashboard/Courses/redux/certificate.slice";
import enrollmentReducer from "../Features/dashboard/Courses/redux/enrollment.slice";
import paymentReducer from "../Features/dashboard/Courses/redux/payment.slice";
import couponReducer from "../Features/dashboard/Courses/redux/coupon.slice";

// ================= CLASSROOM =================
import lessonReducer from "../Features/dashboard/Courses/Classroom/redux/lesson.slice";
import lessonProgressReducer from "../Features/dashboard/Courses/Classroom/redux/lessonProgress.slice";
import leaderboardReducer from "../Features/dashboard/Courses/Classroom/redux/leaderboard.slice";

// 🚨 IMPORTANT: ADD THIS (YOU MISSED THIS)
import courseProgressReducer from "../Features/dashboard/Courses/Classroom/redux/courseProgress.slice";

import bookmarkReducer from "../Features/dashboard/Courses/Classroom/redux/bookmark.slice";

import notificationReducer from "../Features/dashboard/Courses/Classroom/redux/notification.slice";


import bootcampReducer from "../Features/dashboard/Courses/redux/bootcampSlice";

import applicationReducer from"../Features/dashboard/Courses/redux/application.slice";

import adminReducer from "../Features/dashboard/adminPanel/redux/admin.slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    course: courseReducer,
    courseDetail: courseDetailReducer,

    contact: contactReducer,
    reviews: reviewReducer,

    certificate: certificateReducer,
    enrollment: enrollmentReducer,
    payment: paymentReducer,
    coupon: couponReducer,

    lesson: lessonReducer,
    lessonProgress: lessonProgressReducer,

    leaderboard: leaderboardReducer,

    // ✅ FIX: COURSE PROGRESS STATE
    courseProgress: courseProgressReducer,
    bookmark: bookmarkReducer,
    notification: notificationReducer,

     bootcamp: bootcampReducer,

     application: applicationReducer,

     admin: adminReducer,
  },
});