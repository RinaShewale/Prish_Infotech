import mongoose from "mongoose";

const testCaseSchema = new mongoose.Schema({
  input: {
    type: String,
    required: true,
  },

  output: {
    type: String,
    required: true,
  },
});

const problemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Easy",
    },

    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
      required: true,
    },

    score: {
      type: Number,
      default: 10,
    },

    testCases: [testCaseSchema],

    starterCode: {
      java: String,
      python: String,
      javascript: String,
    },

    solution: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Problem = mongoose.model(
  "Problem",
  problemSchema
);

export default Problem;