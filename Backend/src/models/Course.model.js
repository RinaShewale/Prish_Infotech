import mongoose from "mongoose";


// ======================================================
// ✅ SYLLABUS SCHEMA
// ======================================================

const syllabusSchema = new mongoose.Schema(
  {
    // ✅ PHASE

    phase: {
      type: String,
      required: true,
      trim: true,
    },

    // ✅ MODULE TITLE

    title: {
      type: String,
      required: true,
      trim: true,
    },

    // ✅ DURATION

    duration: {
      type: String,
      required: true,
      trim: true,
    },

    // ✅ TOPICS

    topics: {
      type: [String],
      default: [],
    },

    // ✅ TOOLS / TECH STACK

    tools: {
      type: [String],
      default: [],
    },
  },
  {
    _id: false,
  }
);


// ======================================================
// ✅ COURSE SCHEMA
// ======================================================

const courseSchema = new mongoose.Schema(
  {
    // ✅ COURSE TITLE

    title: {
      type: String,
      required: true,
      trim: true,
    },

    // ✅ SEO FRIENDLY URL SLUG

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // ✅ COURSE DESCRIPTION

    description: {
      type: String,
      required: true,
      maxlength: [
        250,
        "Description cannot exceed 250 characters",
      ],
    },

    // ✅ COURSE THUMBNAIL

    thumbnail: {
      type: String,
      required: true,
    },

    // ✅ COURSE VIDEO

    video: {
      type: String,
      default: "",
    },

    // ✅ COURSE TYPE

    type: {
      type: String,
      enum: ["live", "recorded"],
      default: "recorded",
    },

    // ✅ CURRENT PRICE

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    // ✅ OLD PRICE

    oldPrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    // ✅ AUTO DISCOUNT PERCENT

    discount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // ✅ COURSE LEVEL

    level: {
      type: String,
      enum: [
        "beginner",
        "intermediate",
        "advanced",
      ],
      default: "beginner",
    },

    // ✅ MULTIPLE CATEGORIES

    category: {
      type: [String],
      required: true,
    },

    // ✅ ACCESS DURATION

    accessDuration: {
      type: String,
      default: "Lifetime Access",
    },

    // ✅ HERO QUOTE

    heroQuote: {
      type: String,
      default:
        "Build Enterprise Software Like The Top 1%",
    },

    // ✅ HERO HIGHLIGHT TEXT

    heroHighlight: {
      type: String,
      default:
        "Become Industry Ready",
    },

    // ✅ COURSE SYLLABUS

    syllabus: {
      type: [syllabusSchema],
      default: [],
    },

    // ✅ COURSE INSTRUCTOR

    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);


// ======================================================
// ✅ AUTO CALCULATE DISCOUNT
// ======================================================

courseSchema.pre("save", function () {

  // If oldPrice exists and is greater than price

  if (
    this.oldPrice > 0 &&
    this.oldPrice > this.price
  ) {

    this.discount = Math.round(
      (
        (this.oldPrice - this.price) /
        this.oldPrice
      ) * 100
    );

  } else {

    this.discount = 0;
  }


});


// ======================================================
// ✅ EXPORT MODEL
// ======================================================

const Course = mongoose.model(
  "Course",
  courseSchema
);

export default Course;