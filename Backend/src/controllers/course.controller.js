import Course from "../models/Course.model.js";


// ✅ CREATE COURSE
export const createCourse = async (req, res) => {
  try {
    const {
      title,
      description,
      thumbnail,
      price,
      level,
      category,
      instructor,
    } = req.body;

    if (
      !title ||
      !description ||
      !thumbnail ||
      !price ||
      !category
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    const course = await Course.create({
      title,
      description,
      thumbnail,
      price,
      level,
      category,
      instructor,
    });

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    console.log("CREATE COURSE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// ✅ GET ALL COURSES
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("instructor", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: courses.length,
      courses,
    });
  } catch (error) {
    console.log("GET COURSES ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// ✅ GET SINGLE COURSE
export const getSingleCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("instructor", "name email");

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    console.log("GET SINGLE COURSE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// ✅ UPDATE COURSE
export const updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      course,
    });
  } catch (error) {
    console.log("UPDATE COURSE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// ✅ DELETE COURSE
export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    await course.deleteOne();

    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.log("DELETE COURSE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};