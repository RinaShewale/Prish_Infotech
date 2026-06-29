import CourseProgress from "../models/CourseProgress.model.js";

export const getCourseProgress = async (req, res) => {
  try {
    const progress = await CourseProgress.findOne({
      user: req.user._id,
      course: req.params.courseId,
    });

    // ===============================
    // IF NO PROGRESS FOUND
    // ===============================
    if (!progress) {
      return res.status(200).json({
        success: true,
        progress: {
          progress: 0,
          completedLessons: 0,
          totalLessons: 0,
          courseCompletedAt: null,
          createdAt: null,
          updatedAt: null,
        },
      });
    }

    // ===============================
    // SAFE RESPONSE OBJECT
    // ===============================
    const response = {
      _id: progress._id,
      user: progress.user,
      course: progress.course,

      progress: progress.progress || 0,
      completedLessons: progress.completedLessons || 0,
      totalLessons: progress.totalLessons || 0,

      // ✅ FIX: proper date handling
      courseCompletedAt: progress.courseCompletedAt
        ? new Date(progress.courseCompletedAt)
        : null,

      createdAt: progress.createdAt,
      updatedAt: progress.updatedAt,
    };

    return res.status(200).json({
      success: true,
      progress: response,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};




// ================= ADMIN: GET USER COURSE PROGRESS =================
export const getAdminCourseProgress = async (req, res) => {
  try {
    const { courseId, userId } = req.params;

    const progress = await CourseProgress.findOne({
      user: userId,
      course: courseId,
    });

    if (!progress) {
      return res.status(200).json({
        success: true,
        progress: {
          progress: 0,
          completedLessons: 0,
          totalLessons: 0,
          courseCompletedAt: null,
        },
      });
    }

    return res.status(200).json({
      success: true,
      progress: {
        _id: progress._id,
        user: progress.user,
        course: progress.course,
        progress: progress.progress || 0,
        completedLessons: progress.completedLessons || 0,
        totalLessons: progress.totalLessons || 0,
        courseCompletedAt: progress.courseCompletedAt || null,
        createdAt: progress.createdAt,
        updatedAt: progress.updatedAt,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};