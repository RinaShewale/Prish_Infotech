import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import cors from "cors";

import passport from "./config/passport.js";

// ROUTES
import authRoutes from "./routes/auth.route.js";
import testRoutes from "./routes/test.routes.js";
import contactRoutes from "./routes/contact.route.js";
import courseRoutes from "./routes/course.route.js";
import lessonRoutes from "./routes/lesson.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import paymentRoutes from "./routes/payment.route.js";
import certificateRoutes from "./routes/certificate.routes.js";
import enrollmentRoutes from "./routes/enrollment.routes.js";
import couponRoutes from "./routes/coupon.route.js";
import lessonProgressRoutes from "./routes/lessonProgress.routes.js";
import leaderboardRoutes from "./routes/leaderboard.routes.js";
import courseProgressRoutes from "./routes/courseProgress.routes.js";
import bookmarkRoutes from "./routes/bookmark.route.js";
import mediaRoutes from "./routes/media.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import notificationRoutes from "./routes/notification.routes.js";

import bootcampRoutes from "./routes/bootcamp.route.js";
import applicationRoutes from "./routes/application.route.js";

import adminRoutes from "./routes/admin.routes.js";

import { createAdminIfNotExists } from "./utils/initAdmin.js";

const app = express();

// ======================
// INIT ADMIN
// ======================
createAdminIfNotExists();

// ======================
// CORS
// ======================
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ======================
// BODY PARSER
// ======================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ======================
// SESSION (GOOGLE OAUTH NEEDS THIS)
// ======================
app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // true in production (HTTPS)
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);
// ======================
// PASSPORT
// ======================
app.use(passport.initialize());
app.use(passport.session());
// ======================
// ROUTES
// ======================
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/certificate", certificateRoutes);
app.use("/api/enrollment", enrollmentRoutes);
app.use("/api/coupon", couponRoutes);
app.use("/api/lesson-progress", lessonProgressRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/course-progress", courseProgressRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/bootcamps", bootcampRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/admin", adminRoutes);


// ======================
// HEALTH CHECK
// ======================
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Server running on port 3000 🚀",
  });
});

export default app;