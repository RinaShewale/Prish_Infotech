import mongoose from "mongoose";
import yearSchema from "./schemas/year.schema.js";

const bootcampSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["online", "offline"],
      required: true,
    },

    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },

    duration: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    discountedPrice: {
      type: Number,
      default: 0,
    },

    location: {
      type: String,
      default: "",
    },

    batch: {
      type: yearSchema,
      required: true,
    },

    syllabus: [
      {
        title: {
          type: String,
          required: true,
        },

        content: [
          {
            subtitle: {
              type: String,
              required: true,
            },

            items: [
              {
                type: String,
              },
            ],
          },
        ],
      },
    ],

    highlights: [
      {
        type: String,
      },
    ],

    features: [
      {
        title: {
          type: String,
          required: true,
        },

        enabled: {
          type: Boolean,
          default: true,
        },
      },
    ],

    pricing: [
      {
        code: {
          type: String,
          required: true,
        },

        name: {
          type: String,
          required: true,
        },

        price: {
          type: Number,
          required: true,
        },

        details: {
          type: String,
          default: "",
        },

        isPremium: {
          type: Boolean,
          default: false,
        },

        features: [
          {
            type: String,
          },
        ],
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Bootcamp || mongoose.model("Bootcamp", bootcampSchema);