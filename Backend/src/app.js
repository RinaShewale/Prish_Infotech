import express from "express";
import cookieParser from "cookie-parser";

import authRoutes from "../src/routes/auth.route.js";
import testRoutes from "../src/routes/test.routes.js";
import contactRoutes from "../src/routes/contact.route.js"
import courseRoutes from "./routes/course.route.js";
import lessonRoutes from "./routes/lesson.routes.js";
import reviewRoutes from "./routes/review.routes.js";

const app = express();

// ======================
// MIDDLEWARES
// ======================
app.use(express.json());
app.use(cookieParser());

// ======================
// ROUTES
// ======================
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);

app.use("/api/contact", contactRoutes);
app.use("/api/course", courseRoutes);


app.use("/api/lessons", lessonRoutes);

app.use("/api/reviews", reviewRoutes);

// ======================
// HEALTH CHECK ROUTE (GOOD PRACTICE)
// ======================
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running 🚀",
  });
});

export default app;