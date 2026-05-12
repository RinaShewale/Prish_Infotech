import jwt from "jsonwebtoken";
import User from "../models/User.model.js";



// ✅ PROTECT ROUTE
export const protect = async (req, res, next) => {
  try {
    let token;

    // ✅ Check Bearer token
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // ✅ Check Cookie token
    else if (req.cookies.token) {
      token = req.cookies.token;
    }

    // ❌ No token
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, no token",
      });
    }

    // ✅ Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // ✅ Find user
    const user = await User.findById(decoded.id)
      .select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // ✅ Attach user
    req.user = user;

    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};



// ✅ ADMIN ONLY
export const adminOnly = (req, res, next) => {
  try {

    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access only",
      });
    }

    next();

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};