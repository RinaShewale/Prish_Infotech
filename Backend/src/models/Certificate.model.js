import mongoose from "mongoose";

const certificateSchema =
  new mongoose.Schema(
    {
      user: {
        type:
          mongoose.Schema.Types
            .ObjectId,
        ref: "User",
        required: true,
      },

      course: {
        type:
          mongoose.Schema.Types
            .ObjectId,
        ref: "Course",
        default: null,
      },

      bootcamp: {
        type:
          mongoose.Schema.Types
            .ObjectId,
        ref: "Bootcamp",
        default: null,
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

certificateSchema.index(
  {
    user: 1,
    course: 1,
    bootcamp: 1,
  },
  {
    unique: true,
  }
);

const Certificate =
  mongoose.models.Certificate ||
  mongoose.model(
    "Certificate",
    certificateSchema
  );

export default Certificate;