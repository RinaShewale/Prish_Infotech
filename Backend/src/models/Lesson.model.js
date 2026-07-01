import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["pdf", "zip", "code", "github", "link"],
      default: "link",
    },

    url: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    resourceType: {
      type: String,
      default: "external",
      trim: true,
    },
  },
  {
    _id: false,
  }
);

const lessonSchema = new mongoose.Schema(
  {
    // Lesson Title
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // Video URL
    videoUrl: {
      type: String,
      required: true,
      trim: true,
    },

    // Lesson Content
    content: {
      type: String,
      default: "",
      trim: true,
    },

    // Main Notes PDF
    resourceUrL: {
      type: String,
      default: "",
      trim: true,
    },

    // Optional Additional Resources
    resources: {
      type: [resourceSchema],
      default: [],
    },

    // Course Reference
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    // Lesson Order
    order: {
      type: Number,
      default: 0,
    },

    // Duration (minutes)
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