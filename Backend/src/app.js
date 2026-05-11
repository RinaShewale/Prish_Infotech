import express from "express";
import cookieParser from "cookie-parser";

import authRoutes from "../src/routes/auth.route.js";
import testRoutes from "../src/routes/test.routes.js";

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