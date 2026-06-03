import Bookmark from "../models/Bookmark.model.js";

// Add Bookmark
export const addBookmark = async (req, res) => {
  try {
    const { courseId, lessonId } = req.body;

    const bookmark = await Bookmark.findOneAndUpdate(
      {
        user: req.user.id,
        lesson: lessonId,
      },
      {
        user: req.user.id,
        course: courseId,
        lesson: lessonId,
      },
      {
        upsert: true,
        new: true,
      }
    );

    res.status(201).json({
      success: true,
      bookmark,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get My Bookmarks
export const getBookmarks = async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({
      user: req.user.id,
    })
      .populate("course", "title")
      .populate("lesson", "title videoUrl")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      bookmarks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Remove Bookmark
export const removeBookmark = async (req, res) => {
  try {
    const { lessonId } = req.params;

    await Bookmark.findOneAndDelete({
      user: req.user.id,
      lesson: lessonId,
    });

    res.status(200).json({
      success: true,
      message: "Bookmark removed",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};