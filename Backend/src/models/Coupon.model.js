import mongoose from "mongoose";

const couponSchema =
  new mongoose.Schema(
    {
      code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
      },

      discountType: {
        type: String,
        enum: [
          "fixed",
          "percent",
        ],
        default: "fixed",
      },

      discountValue: {
        type: Number,
        required: true,
      },

      minAmount: {
        type: Number,
        default: 0,
      },

      expiresAt: {
        type: Date,
      },

      active: {
        type: Boolean,
        default: true,
      },
    },
    {
      timestamps: true,
    }
  );

const Coupon =
  mongoose.model(
    "Coupon",
    couponSchema
  );

export default Coupon;