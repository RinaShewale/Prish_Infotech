import mongoose from "mongoose";
import yearSchema from "./schemas/year.schema.js";

const bootcampSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    shortDescription: { type: String, default: "" },
    fullDescription: { type: String, default: "" },
    thumbnail: { type: String, default: "" },
    heroBanner: { type: String, default: "" },
    introVideo: { type: String, default: "" },
    demoVideo: { type: String, default: "" },
    duration: { type: String, default: "" },
    startDate: { type: Date, default: null },
    endDate: { type: Date, default: null },
    batchSize: { type: Number, default: 0 },
    language: { type: String, default: "English" },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    category: { type: String, default: "General" },
    enrollmentDeadline: { type: Date, default: null },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    certificateEnabled: { type: Boolean, default: false },
    price: { type: Number, default: 0 },
    discountPrice: { type: Number, default: 0 },
    type: {
      type: String,
      enum: ["online", "offline"],
      default: "online",
    },
    batch: {
      type: yearSchema,
      default: { year: new Date().getFullYear() },
    },

    syllabusModules: [{ title: String, topics: [String] }],
    learningOutcomes: [String],
    prerequisites: [String],
    features: [String],
    technologies: [String],
    faqs: [{ question: String, answer: String }],
    mentors: [{ name: String, role: String, bio: String, image: String }],
    projects: [{ title: String, description: String, link: String }],
    careerSupport: [String],
    testimonials: [{ name: String, role: String, quote: String }],
    pricingPlans: [{ name: String, price: Number, description: String, features: [String], popular: Boolean }],
    brochures: [{ title: String, url: String, type: String }],
    attachments: [{ title: String, url: String, type: String, description: String }],
    seo: {
      metaTitle: { type: String, default: "" },
      metaDescription: { type: String, default: "" },
      keywords: [{ type: String }],
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Bootcamp", bootcampSchema);