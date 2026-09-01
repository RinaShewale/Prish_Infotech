import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
    },

    occupation: {
      type: String,
      enum: ["Student", "Working", "Gap Year"],
      required: true,
    },

    bootcamp: {
      type: String,
      required: true,
    },

    graduationYear: {
      type: Number,
    },

    contactNumber: {
      type: String,
      required: true,
    },

    collegeOrCompany: {
      type: String,
      required: true,
    },

    personalStatement: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["Pending", "Reviewed", "Accepted", "Rejected"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Application || mongoose.model(
  "Application",
  applicationSchema
);