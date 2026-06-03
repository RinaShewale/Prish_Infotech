import mongoose from "mongoose";

const bookmarkSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Same lesson duplicate bookmark hou naye
bookmarkSchema.index(
  {
    user: 1,
    lesson: 1,
  },
  {
    unique: true,
  }
);

const Bookmark = mongoose.model(
  "Bookmark",
  bookmarkSchema
);

export default Bookmark;