// ======================================================
// 📁 store/store.js
// ======================================================

import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/auth/auth.slice";
import courseReducer from "../Features/dashboard/Courses/course.slice";
import contactReducer from "../Features/auth/contact.slice";
import reviewReducer from "../Features/dashboard/components/slice/review.slice";

// 🎓 ADD CERTIFICATE SLICE
import certificateReducer from "../Features/dashboard/Courses/certificate.slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    course: courseReducer,
    contact: contactReducer,
    reviews: reviewReducer,

    // 🎓 NEW
    certificate: certificateReducer,
  },
});