import LessonProgress from "../models/LessonProgress.model.js";
import Lesson from "../models/Lesson.model.js";
import Leaderboard from "../models/Leaderboard.model.js";
import CourseProgress from "../models/CourseProgress.model.js";
import Certificate from "../models/certificate.model.js";

// ================= SAVE PROGRESS =================
export const saveLessonProgress = async (req, res) => {
  try {
    console.log("SAVE LESSON PROGRESS HIT");

    const {
      lessonId,
      watchedSeconds,
      totalDuration,
    } = req.body;

    const userId = req.user._id;

    // Calculate lesson progress %
    const progressPercentage =
      totalDuration > 0
        ? Math.min(
            Math.round(
              (watchedSeconds / totalDuration) * 100
            ),
            100
          )
        : 0;

    const completed = progressPercentage >= 80;

    // Previous progress
    const existingProgress =
      await LessonProgress.findOne({
        user: userId,
        lesson: lessonId,
      });

    const wasCompleted =
      existingProgress?.completed || false;

    // Save lesson progress
    const progress =
      await LessonProgress.findOneAndUpdate(
        {
          user: userId,
          lesson: lessonId,
        },
        {
          watchedSeconds,
          totalDuration,
          progress: progressPercentage,
          completed,
        },
        {
          upsert: true,
          returnDocument: "after",
        }
      );

    // Get lesson details
    const lesson = await Lesson.findById(
      lessonId
    );

    if (lesson) {
      // ================= LEADERBOARD =================
      if (completed && !wasCompleted) {
        await Leaderboard.findOneAndUpdate(
          {
            user: userId,
            course: lesson.course,
          },
          {
            $inc: {
              points: 100,
              completedLessons: 1,
            },
          },
          {
            upsert: true,
            returnDocument: "after",
          }
        );
      }

      // ================= COURSE PROGRESS =================
      const lessons = await Lesson.find({
        course: lesson.course,
      });

      const lessonIds = lessons.map(
        (item) => item._id
      );

      const totalLessons =
        lessons.length;

      const completedLessons =
        await LessonProgress.countDocuments({
          user: userId,
          lesson: {
            $in: lessonIds,
          },
          completed: true,
        });

      const coursePercentage =
        totalLessons > 0
          ? Math.round(
              (completedLessons /
                totalLessons) *
                100
            )
          : 0;

      const courseProgress =
        await CourseProgress.findOneAndUpdate(
          {
            user: userId,
            course: lesson.course,
          },
          {
            progress: coursePercentage,
            completedLessons,
            totalLessons,
          },
          {
            upsert: true,
            returnDocument: "after",
          }
        );

      // ================= CERTIFICATE =================
      if (coursePercentage >= 100) {
        const existingCertificate =
          await Certificate.findOne({
            user: userId,
            course: lesson.course,
          });

        if (!existingCertificate) {
          await Certificate.create({
            user: userId,
            course: lesson.course,
            certificateUrl: "",
          });

          console.log(
            "🎓 Certificate generated successfully"
          );
        }
      }

      console.log(
        "COURSE PROGRESS UPDATED:",
        courseProgress
      );
    }

    res.status(200).json({
      success: true,
      progress,
    });
  } catch (error) {
    console.log(
      "Save Progress Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET PROGRESS =================
export const getLessonProgress = async (
  req,
  res
) => {
  try {
    const progress =
      await LessonProgress.findOne({
        user: req.user._id,
        lesson: req.params.lessonId,
      });

    res.status(200).json({
      success: true,
      progress,
    });
  } catch (error) {
    console.log(
      "Get Progress Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};