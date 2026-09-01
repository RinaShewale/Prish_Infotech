import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    name: { type: String, default: "" },
    description: { type: String, default: "" },
    discountType: {
      type: String,
      enum: ["fixed", "percent"],
      default: "fixed",
    },
    discountValue: { type: Number, required: true },
    maxDiscount: { type: Number, default: 0 },
    minAmount: { type: Number, default: 0 },
    applicableTo: { type: String, enum: ["all", "courses", "bootcamps", "categories"], default: "all" },
    selectedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
    selectedBootcamps: [{ type: mongoose.Schema.Types.ObjectId, ref: "Bootcamp" }],
    categories: [{ type: String }],
    usageLimit: { type: Number, default: 0 },
    perUserLimit: { type: Number, default: 1 },
    startsAt: { type: Date, default: null },
    expiresAt: { type: Date, default: null },
    active: { type: Boolean, default: true },
    isPublic: { type: Boolean, default: true },
    firstTimeUserOnly: { type: Boolean, default: false },
    stackable: { type: Boolean, default: false },
    adminNotes: { type: String, default: "" },
    usageCount: { type: Number, default: 0 },
    createdBy: { type: String, default: "admin" },
  },
  { timestamps: true }
);

const Coupon = mongoose.models.Coupon || mongoose.model("Coupon", couponSchema);

export default Coupon;