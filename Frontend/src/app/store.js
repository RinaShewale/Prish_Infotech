import { configureStore } from "@reduxjs/toolkit";

// ================= AUTH =================
import authReducer from "../features/auth/auth.slice";

// ================= COURSE =================
import courseReducer from "../Features/dashboard/Courses/course.slice";
import courseDetailReducer from "../Features/dashboard/Courses/courseDetail.slice";

// ================= DASHBOARD =================
import contactReducer from "../Features/auth/contact.slice";
import reviewReducer from "../Features/dashboard/Home/components/slice/review.slice";

// ================= COURSE MODULES =================
import certificateReducer from "../Features/dashboard/Courses/certificate.slice";
import enrollmentReducer from "../Features/dashboard/Courses/enrollment.slice";
import paymentReducer from "../Features/dashboard/Courses/payment.slice";
import couponReducer from "../Features/dashboard/Courses/coupon.slice";

// ================= CLASSROOM =================
import lessonReducer from "../Features/dashboard/Courses/Classroom/lesson.slice";
import lessonProgressReducer from "../Features/dashboard/Courses/Classroom/lessonProgress.slice";
import leaderboardReducer from "../Features/dashboard/Courses/Classroom/leaderboard.slice";

// 🚨 IMPORTANT: ADD THIS (YOU MISSED THIS)
import courseProgressReducer from "../Features/dashboard/Courses/Classroom/courseProgress.slice";

import bookmarkReducer from "../features/dashboard/Courses/Classroom/bookmark.slice";

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
  },
});