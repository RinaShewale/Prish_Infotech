import User from "../models/User.model.js";
import generateToken from "../utils/generateToken.js";

/* =========================
   REGISTER USER
========================= */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // create new user
    const user = await User.create({
      name,
      email,
      password,
      role: email === "prishinfotech@gmail.com" ? "admin" : "student",
    });

    // generate JWT token
    const token = generateToken(user._id.toString());

    // set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true in production (HTTPS)
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // send response
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   LOGIN USER
========================= */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // find user + include password
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // check password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // generate token
    const token = generateToken(user._id.toString());

    // set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // send response
    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   GET CURRENT USER
========================= */
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // send full user (includes avatar)
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   LOGOUT USER
========================= */
export const logoutUser = async (req, res) => {
  try {
    // clear cookie
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   GOOGLE OAUTH CALLBACK
========================= */
export const googleCallback = (req, res) => {
  try {
    const user = req.user;

    // if login failed
    if (!user) {
      return res.redirect(`${process.env.CLIENT_URL}/login`);
    }

    // generate token
    const token = generateToken(user._id.toString());

    // set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // redirect to frontend home
    return res.redirect(`${process.env.CLIENT_URL}/`);
  } catch (error) {
    console.log("Google Callback Error:", error);

    return res.redirect(`${process.env.CLIENT_URL}/login`);
  }
};