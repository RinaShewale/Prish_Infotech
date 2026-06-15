import mongoose from "mongoose";
import yearSchema from "./schemas/year.schema.js";

const bootcampSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,

    type: {
      type: String,
      enum: ["online", "offline"],
      required: true,
    },

    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
    },

    duration: String,
    price: Number,
    discountedPrice: Number,
    location: String,

    // ✅ GENERIC FIELD (NOT COHORT)
    batch: {
      type: yearSchema,
      required: true,
    },

    syllabus: [
      {
        title: { type: String, required: true },
        content: [
          {
            subtitle: { type: String, required: true },
            items: { type: [String], default: [] },
          },
        ],
      },
    ],

    highlights: [String],

    features: [
      {
        title: String,
        enabled: Boolean,
      },
    ],

    pricing: [
      {
        code: String,
        name: String,
        price: Number,
        details: String,
        isPremium: Boolean,
        features: [String],
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Bootcamp", bootcampSchema);