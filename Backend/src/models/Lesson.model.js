import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    videoUrl: {
      type: String,
      required: true,
    },

    content: {
      type: String,
    },

    resourceUrL: {
      type: String,
      default: "",
    },

    resources: [
      {
        title: { type: String, required: true },
        type: { type: String, default: "link" },
        url: { type: String, required: true },
        description: { type: String, default: "" },
        resourceType: { type: String, default: "external" },
      },
    ],

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    order: {
      type: Number,
      default: 0,
    },

    duration: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Lesson = mongoose.model("Lesson", lessonSchema);

export default Lesson;