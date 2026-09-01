import LessonProgress from "../models/LessonProgress.model.js";
import Lesson from "../models/Lesson.model.js";
import Leaderboard from "../models/Leaderboard.model.js";
import CourseProgress from "../models/CourseProgress.model.js";
import Certificate from "../models/Certificate.model.js";



// ================= SAVE PROGRESS =================
export const saveLessonProgress = async (req, res) => {
  try {
    const { lessonId, watchedSeconds, totalDuration } = req.body;
    const userId = req.user._id;

    // ================= LESSON PROGRESS =================
    const progressPercentage =
      totalDuration > 0
        ? Math.min(Math.round((watchedSeconds / totalDuration) * 100), 100)
        : 0;

    const completed = progressPercentage >= 80;

    const existingLessonProgress = await LessonProgress.findOne({
      user: userId,
      lesson: lessonId,
    });

    const wasCompleted = existingLessonProgress?.completed || false;

    const lessonProgress = await LessonProgress.findOneAndUpdate(
      { user: userId, lesson: lessonId },
      {
        watchedSeconds,
        totalDuration,
        progress: progressPercentage,
        completed,
      },
      { upsert: true, new: true }
    );

    // ================= LESSON =================
    const lesson = await Lesson.findById(lessonId);

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    // ================= LEADERBOARD =================
    if (completed && !wasCompleted) {
      await Leaderboard.findOneAndUpdate(
        { user: userId, course: lesson.course },
        {
          $inc: {
            points: 100,
            completedLessons: 1,
          },
        },
        { upsert: true, new: true }
      );
    }

    // ================= COURSE PROGRESS =================
    const lessons = await Lesson.find({ course: lesson.course });

    const lessonIds = lessons.map((l) => l._id);
    const totalLessons = lessons.length;

    const completedLessons = await LessonProgress.countDocuments({
      user: userId,
      lesson: { $in: lessonIds },
      completed: true,
    });

    const coursePercentage =
      totalLessons > 0
        ? Math.round((completedLessons / totalLessons) * 100)
        : 0;

    // ================= ⭐ FIXED DATE LOGIC =================
    let courseProgress = await CourseProgress.findOne({
      user: userId,
      course: lesson.course,
    });

    // ✅ ONLY SET DATE ON FIRST TIME 100%
    let courseCompletedAt = courseProgress?.courseCompletedAt || null;

    if (coursePercentage >= 100 && !courseCompletedAt) {
      courseCompletedAt = new Date(); // 🔥 ONLY FIRST TIME
    }

    courseProgress = await CourseProgress.findOneAndUpdate(
      { user: userId, course: lesson.course },
      {
        progress: coursePercentage,
        completedLessons,
        totalLessons,
        courseCompletedAt,
      },
      { upsert: true, new: true }
    );

    // ================= CERTIFICATE =================
    if (coursePercentage >= 100 && totalLessons > 0) {
      const existingCertificate = await Certificate.findOne({
        user: userId,
        course: lesson.course,
      });

      if (!existingCertificate) {
        await Certificate.create({
          user: userId,
          course: lesson.course,
          certificateUrl: "",
        });

        console.log("🎓 Certificate generated");
      }
    }

    return res.status(200).json({
      success: true,
      lessonProgress,
      courseProgress,
    });
  } catch (error) {
    console.log("Save Progress Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// ================= GET LESSON PROGRESS =================
export const getLessonProgress = async (req, res) => {
  try {
    const progress = await LessonProgress.findOne({
      user: req.user._id,
      lesson: req.params.lessonId,
    });

    return res.status(200).json({
      success: true,
      progress,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};