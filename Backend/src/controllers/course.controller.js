import Course from "../models/Course.model.js";
import slugify from "slugify";

// CREATE COURSE 
export const createCourse = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      oldPrice,
      accessDuration,
      level,
      category,
      type,
      heroQuote,
      heroHighlight,
      syllabus,
    } = req.body;

    if (!title || !description || price === undefined || !category) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields",
      });
    }

    const thumbnail = req.file?.path;
    if (!thumbnail) {
      return res.status(400).json({
        success: false,
        message: "Thumbnail is required",
      });
    }

    const slug = slugify(title, {
      lower: true,
      strict: true,
    });

    const existingCourse = await Course.findOne({ slug });

    if (existingCourse) {
      return res.status(400).json({
        success: false,
        message: "Course already exists",
      });
    }

    const formattedCategory = Array.isArray(category)
      ? category.map((c) => c.trim())
      : [category.trim()];

    const parsedSyllabus =
      typeof syllabus === "string" ? JSON.parse(syllabus) : syllabus || [];

    const course = await Course.create({
      title,
      slug,
      description,
      thumbnail,
      video: req.body.video || "",
      type: type || "recorded",
      price: Number(price) || 0,
      oldPrice: Number(oldPrice) || 0,
      accessDuration: accessDuration || "Lifetime Access",
      level: level || "beginner",
      category: formattedCategory,
      heroQuote:
        heroQuote || "Build Enterprise Software Like The Top 1%",
      heroHighlight: heroHighlight || "Become Industry Ready",
      syllabus: parsedSyllabus,
      instructor: req.user._id,
    });

    await course.populate("instructor", "name email");

    res.status(201).json({
      success: true,
      course,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

//  GET ALL 
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("instructor", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      courses,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// SINGLE (FIXED) 
export const getSingleCourse = async (req, res) => {
  try {
    const { slug } = req.params;

    const course = await Course.findOne({ slug }).populate(
      "instructor",
      "name email"
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.json({
      success: true,
      course,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// UPDATE 
export const updateCourse = async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title, {
        lower: true,
        strict: true,
      });
    }

    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate("instructor", "name email");

    res.json({
      success: true,
      course,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

//  DELETE 
export const deleteCourse = async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

//  VIDEO UPLOAD 
export const uploadCourseVideo = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Video required",
      });
    }

    course.video = req.file.path;
    await course.save();

    res.json({
      success: true,
      course,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};