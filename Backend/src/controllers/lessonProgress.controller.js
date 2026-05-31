import LessonProgress from "../models/LessonProgress.model.js";



// ================= SAVE PROGRESS =================
export const saveLessonProgress =
  async (req, res) => {

    try {

      const {
        lessonId,
        watchedSeconds,
        totalDuration,
      } = req.body;

      const userId = req.user._id;



      const progressPercentage =
        Math.min(
          Math.round(
            (watchedSeconds /
              totalDuration) *
              100
          ),
          100
        );



      const completed =
        progressPercentage >= 80;



      const progress =
        await LessonProgress.findOneAndUpdate(
          {
            user: userId,
            lesson: lessonId,
          },
          {
            watchedSeconds,
            totalDuration,
            progress:
              progressPercentage,
            completed,
          },
          {
            upsert: true,
            new: true,
          }
        );



      res.status(200).json({
        success: true,
        progress,
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };



// ================= GET PROGRESS =================
export const getLessonProgress =
  async (req, res) => {

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

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };