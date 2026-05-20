// ======================================================
// 📁 store/store.js
// ======================================================

import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/auth/auth.slice";
import courseReducer from "../Features/dashboard/Courses/course.slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    course: courseReducer,
  },
});