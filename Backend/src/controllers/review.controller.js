import Review from "../models/Review.model.js";



// CREATE REVIEW
export const createReview = async (req, res) => {
  try {
    const { course, rating, comment } = req.body;

    const alreadyReviewed = await Review.findOne({
      user: req.user.id,
      course,
    });

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: "You already reviewed this course",
      });
    }

    const review = await Review.create({
      user: req.user.id,
      course,
      rating,
      comment,
    });

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      review,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




// GET ALL REVIEWS
export const getAllReviews = async (req, res) => {
  try {

    const reviews = await Review.find()
      .populate("user")
      .populate("course");

    res.status(200).json({
      success: true,
      reviews,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




// GET SINGLE REVIEW
export const getSingleReview = async (req, res) => {
  try {

    const review = await Review.findById(req.params.id)
      .populate("user")
      .populate("course");

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    res.status(200).json({
      success: true,
      review,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




// GET COURSE REVIEWS
export const getCourseReviews = async (req, res) => {
  try {

    const reviews = await Review.find({
      course: req.params.courseId,
    }).populate("user");

    res.status(200).json({
      success: true,
      reviews,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




// UPDATE REVIEW
export const updateReview = async (req, res) => {
  try {

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // only owner can update
    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    review.rating = req.body.rating || review.rating;
    review.comment = req.body.comment || review.comment;

    await review.save();

    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      review,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




// DELETE REVIEW
export const deleteReview = async (req, res) => {
  try {

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // only owner can delete
    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    await review.deleteOne();

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};