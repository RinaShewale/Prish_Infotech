import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    thumbnail: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.model("Course", courseSchema);

export default Course;