// ======================================================
// 📁 auth/services/api.js
// ======================================================

import axios from "axios";

// ======================================================
// 🔐 PRIVATE API INSTANCE
// ------------------------------------------------------
// Used for authenticated/protected routes.
//
// Examples:
// - Create Course
// - Update Course
// - Delete Course
// - Upload Video
// - User Dashboard
// - Payments
//
// Automatically sends cookies/token.
// ======================================================

const API = axios.create({
  baseURL: "http://localhost:3000/api",

  // ✅ Send auth cookies automatically
  withCredentials: true,
});

// ======================================================
// 🌍 PUBLIC API INSTANCE
// ------------------------------------------------------
// Used for public routes.
//
// Examples:
// - Get Courses
// - Get Single Course
// - Get Reviews
// - Public Website Data
//
// No authentication cookies are sent.
// This allows guest users to access data
// before login/register.
// ======================================================

export const PUBLIC_API =
  axios.create({
    baseURL:
      "http://localhost:3000/api",

    // ✅ No auth required
    withCredentials: false,
  });

// ======================================================
// ✅ EXPORTS
// ======================================================

export default API;