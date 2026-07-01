import Lesson from "../models/Lesson.model.js";
import LessonProgress from "../models/LessonProgress.model.js";
import Notification from "../models/Notification.model.js";
import Course from "../models/Course.model.js";
import Enrollment from "../models/Enrollment.model.js";

// ================= CREATE LESSON =================
export const createLesson = async (req, res) => {
  try {
    const lessonData = {
      ...req.body,
      title: req.body.title?.trim(),
      videoUrl: req.body.videoUrl?.trim(),
      resourceUrL: req.body.resourceUrL?.trim() || "",
    };

    // ================= SANITIZE RESOURCES =================
    if (Array.isArray(req.body.resources)) {
      lessonData.resources = req.body.resources
        .filter((resource) => resource?.title?.trim() && resource?.url?.trim())
        .map((resource) => ({
          title: resource.title.trim(),
          type: resource.type || resource.resourceType || "link",
          url: resource.url.trim(),
          description: resource.description || "",
          resourceType: resource.resourceType || resource.type || "link",
        }));
    } else {
      lessonData.resources = [];
    }

    if (!lessonData.resourceUrL) {
      const pdfResource = lessonData.resources.find((resource) => {
        const type = (resource.resourceType || resource.type || "").toLowerCase();
        return type === "pdf" || type === "notes";
      });

      if (pdfResource?.url) {
        lessonData.resourceUrL = pdfResource.url;
      }
    }

    // ================= CREATE LESSON =================
    const lesson = await Lesson.create(lessonData);

    console.log("👉 LESSON CREATED");

    // ================= GET COURSE =================
    const course = await Course.findById(lesson.course);

    // ================= GET ENROLLED USERS =================
    const enrollments = await Enrollment.find({
      course: lesson.course,
    }).populate("user");

    console.log("👉 ENROLLMENTS FOUND:", enrollments.length);

    const notifications = enrollments.map((enrollment) => ({
      user: enrollment.user._id,
      title: "New Lesson Added 📚",
      message: `${course?.title || "Course"} - ${lesson.title} is now available`,
      type: "info",
    }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
      console.log("👉 NOTIFICATIONS SAVED ✔");
    }

    return res.status(201).json({
      success: true,
      message: "Lesson created successfully",
      lesson,
    });

  } catch (error) {
    console.error("CREATE LESSON ERROR:", error);

    return res.status(500).json({
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
      .populate("course")
      .sort({ order: 1 });

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

    return res.status(200).json({
      success: true,
      lessons: lessonsWithProgress,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET SINGLE LESSON =================
export const getSingleLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id)
      .populate("course");

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    return res.status(200).json({
      success: true,
      lesson,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= UPDATE LESSON =================
export const updateLesson = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (Array.isArray(req.body.resources)) {
      updateData.resources = req.body.resources
        .filter(
          (resource) =>
            resource.title?.trim() &&
            resource.url?.trim()
        )
        .map((resource) => ({
          title: resource.title.trim(),
          type: resource.type || resource.resourceType || "link",
          url: resource.url.trim(),
          description: resource.description || "",
          resourceType: resource.resourceType || resource.type || "link",
        }));
    }

    if (!updateData.resourceUrL) {
      const pdfResource = updateData.resources?.find((resource) => {
        const type = (resource.resourceType || resource.type || "").toLowerCase();
        return type === "pdf" || type === "notes";
      });

      if (pdfResource?.url) {
        updateData.resourceUrL = pdfResource.url;
      }
    }

    const lesson = await Lesson.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Lesson updated successfully",
      lesson,
    });

  } catch (error) {
    return res.status(500).json({
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

    return res.status(200).json({
      success: true,
      message: "Lesson deleted successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};