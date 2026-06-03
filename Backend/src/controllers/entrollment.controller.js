import Enrollment from "../models/Enrollment.model.js";
import CourseProgress from "../models/CourseProgress.model.js";

// ================= GET USER ENROLLMENTS =================
export const getUserEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({
      user: req.user._id,
    }).populate("course");

    const formattedEnrollments = await Promise.all(
      enrollments.map(async (enroll) => {
        const courseProgress =
          await CourseProgress.findOne({
            user: req.user._id,
            course: enroll.course._id,
          });

        return {
          _id: enroll._id,
          user: enroll.user,
          course: enroll.course,

          progress:
            courseProgress?.progress || 0,

          completedLessons:
            courseProgress?.completedLessons || 0,

          totalLessons:
            courseProgress?.totalLessons || 0,

          enrolledAt: enroll.enrolledAt,
          createdAt: enroll.createdAt,
          updatedAt: enroll.updatedAt,
        };
      })
    );

    res.status(200).json({
      success: true,
      enrollments: formattedEnrollments,
    });
  } catch (error) {
    console.log("GET ENROLLMENTS ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= MANUAL ENROLL =================
export const enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.body;

    const alreadyEnrolled =
      await Enrollment.findOne({
        user: req.user._id,
        course: courseId,
      }).populate("course");

    if (alreadyEnrolled) {
      return res.status(200).json({
        success: true,
        message: "Already enrolled",
        enrollment: {
          ...alreadyEnrolled.toObject(),
          progress: 0,
        },
      });
    }

    const enrollment =
      await Enrollment.create({
        user: req.user._id,
        course: courseId,
      });

    const populated =
      await enrollment.populate("course");

    res.status(201).json({
      success: true,
      enrollment: {
        ...populated.toObject(),
        progress: 0,
      },
    });
  } catch (error) {
    console.log("ENROLL COURSE ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};