import Lesson from "../models/Lesson.model.js";
import LessonProgress from "../models/LessonProgress.model.js";
import Notification from "../models/Notification.model.js";
import Course from "../models/Course.model.js";
import Enrollment from "../models/Enrollment.model.js";

// ================= CREATE LESSON =================
export const createLesson = async (req, res) => {
  try {
    const lesson = await Lesson.create(req.body);

    console.log("👉 LESSON CREATED");

    // 🔥 GET COURSE INFO
    const course = await Course.findById(lesson.course);

    // 👥 GET ENROLLED USERS (FROM ENROLLMENT MODEL)
    const enrollments = await Enrollment.find({
      course: lesson.course,
    }).populate("user");

    console.log("👉 ENROLLMENTS FOUND:", enrollments.length);

    const users = enrollments.map((e) => e.user);

    console.log("👉 USERS FOUND:", users.length);

    // 🔔 CREATE NOTIFICATIONS
    const notifications = users.map((u) => ({
      user: u._id,
      title: "New Lesson Added 📚",
      message: `${course?.title || "Course"} - ${lesson.title} is now available`,
      type: "info",
    }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
      console.log("👉 NOTIFICATIONS SAVED ✔");
    }

    res.status(201).json({
      success: true,
      message: "Lesson created successfully",
      lesson,
    });

  } catch (error) {
    console.log("ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET ALL LESSONS =================
export const getAllLessons = async (req, res) => {
  try {
    const lessons = await Lesson.find()
      .populate("course")
      .sort({ order: 1 });

    res.status(200).json({
      success: true,
      lessons,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET COURSE LESSONS =================
export const getLessonsByCourse = async (req, res) => {
  try {
    const lessons = await Lesson.find({
      course: req.params.courseId,
    })
      .sort({ order: 1 })
      .populate("course");

    if (!req.user) {
      return res.status(200).json({
        success: true,
        lessons,
      });
    }

    const progressData = await LessonProgress.find({
      user: req.user._id,
    });

    const progressMap = {};

    progressData.forEach((item) => {
      progressMap[item.lesson.toString()] = item;
    });

    const lessonsWithProgress = lessons.map((lesson) => ({
      ...lesson.toObject(),
      completed:
        progressMap[lesson._id.toString()]?.completed || false,
      progress:
        progressMap[lesson._id.toString()]?.progress || 0,
    }));

    res.status(200).json({
      success: true,
      lessons: lessonsWithProgress,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET SINGLE LESSON =================
export const getSingleLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id).populate("course");

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    res.status(200).json({
      success: true,
      lesson,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= UPDATE LESSON =================
export const updateLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Lesson updated successfully",
      lesson,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= DELETE LESSON =================
export const deleteLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndDelete(req.params.id);

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Lesson deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};