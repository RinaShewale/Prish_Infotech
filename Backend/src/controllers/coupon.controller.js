import Coupon from "../models/Coupon.model.js";

export const createCoupon =
  async (req, res) => {

    try {

      const {
        code,
        discountType,
        discountValue,
        minAmount,
        expiresAt,
      } = req.body;

      // ✅ CHECK REQUIRED FIELDS

      if (
        !code ||
        !discountType ||
        !discountValue
      ) {
        return res.status(400).json({
          success: false,
          message:
            "All required fields are mandatory",
        });
      }

      // ✅ CHECK EXISTING COUPON

      const existingCoupon =
        await Coupon.findOne({
          code: code.toUpperCase(),
        });

      if (existingCoupon) {
        return res.status(400).json({
          success: false,
          message:
            "Coupon already exists",
        });
      }

      // ✅ CREATE COUPON

      const coupon =
        await Coupon.create({
          code:
            code.toUpperCase(),

          discountType,

          discountValue,

          minAmount:
            minAmount || 0,

          expiresAt,

          active: true,
        });

      res.status(201).json({
        success: true,
        message:
          "Coupon created successfully",
        coupon,
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };



export const validateCoupon =
  async (req, res) => {

    try {

      const {
        code,
        amount,
      } = req.body;

      // ✅ EMPTY CODE CHECK

      if (!code) {
        return res.status(400).json({
          success: false,
          message:
            "Coupon code is required",
        });
      }

      // ✅ FIND COUPON

      const coupon =
        await Coupon.findOne({
          code:
            code.toUpperCase(),

          active: true,
        });

      // ✅ INVALID COUPON

      if (!coupon) {
        return res.status(404).json({
          success: false,
          message:
            "Invalid coupon",
        });
      }

      // ✅ EXPIRED CHECK

      if (
        coupon.expiresAt &&
        new Date() >
          coupon.expiresAt
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Coupon expired",
        });
      }

      // ✅ MINIMUM AMOUNT CHECK

      if (
        amount &&
        amount <
          coupon.minAmount
      ) {
        return res.status(400).json({
          success: false,
          message:
            `Minimum amount should be ₹${coupon.minAmount}`,
        });
      }

      // ✅ CALCULATE DISCOUNT

      let discount = 0;

      if (
        coupon.discountType ===
        "fixed"
      ) {

        discount =
          coupon.discountValue;

      } else {

        discount = Math.round(
          (
            amount *
            coupon.discountValue
          ) / 100
        );
      }

      // ✅ PREVENT EXTRA DISCOUNT

      if (
        amount &&
        discount > amount
      ) {
        discount = amount;
      }

      // ✅ RESPONSE

      res.status(200).json({
        success: true,

        message:
          "Coupon applied successfully",

        discount,

        coupon: {
          _id: coupon._id,

          code: coupon.code,

          discountType:
            coupon.discountType,

          discountValue:
            coupon.discountValue,

          minAmount:
            coupon.minAmount,

          expiresAt:
            coupon.expiresAt,
        },
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };