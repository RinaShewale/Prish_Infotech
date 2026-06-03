import CourseProgress from "../models/CourseProgress.model.js";

export const getCourseProgress = async (req, res) => {
  try {
    const progress = await CourseProgress.findOne({
      user: req.user._id,
      course: req.params.courseId,
    });

    // If no progress exists yet
    if (!progress) {
      return res.json({
        success: true,
        progress: {
          progress: 0,
          completedLessons: 0,
          totalLessons: 0,
          courseCompletedAt: null, // ⭐ important
        },
      });
    }

    res.json({
      success: true,
      progress: {
        _id: progress._id,
        user: progress.user,
        course: progress.course,
        progress: progress.progress,
        completedLessons: progress.completedLessons,
        totalLessons: progress.totalLessons,
        courseCompletedAt: progress.courseCompletedAt || null, // ⭐ important
        createdAt: progress.createdAt,
        updatedAt: progress.updatedAt,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};