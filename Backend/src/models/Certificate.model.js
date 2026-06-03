import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
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

    certificateUrl: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate certificates
certificateSchema.index(
  { user: 1, course: 1 },
  { unique: true }
);

const Certificate = mongoose.model(
  "Certificate",
  certificateSchema
);

export default Certificate;