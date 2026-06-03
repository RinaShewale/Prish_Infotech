import Leaderboard from "../models/Leaderboard.model.js";


// GET COURSE LEADERBOARD
export const getCourseLeaderboard =
async (req, res) => {
  try {

    const users = await Leaderboard.find({
      course: req.params.courseId,
    })
      .populate("user", "name avatar")
      .sort({ points: -1 });

    res.status(200).json({
      success: true,
      users,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


// GET TOP USERS
export const getTopUsers =
async (req, res) => {

  try {

    const { courseId, limit = 10 } =
      req.query;

    const users = await Leaderboard.find({
      course: courseId,
    })
      .populate("user", "name avatar")
      .sort({ points: -1 })
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      users: users.map((item, index) => ({
        rank: index + 1,
        name: item.user?.name,
        points: item.points,
      })),
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};