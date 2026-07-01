import Coupon from "../models/Coupon.model.js";

const buildCouponPayload = (body = {}) => {
  const payload = { ...body };
  if (payload.code) payload.code = String(payload.code).toUpperCase();
  if (payload.discountValue !== undefined) payload.discountValue = Number(payload.discountValue);
  if (payload.maxDiscount !== undefined) payload.maxDiscount = Number(payload.maxDiscount);
  if (payload.minAmount !== undefined) payload.minAmount = Number(payload.minAmount);
  if (payload.usageLimit !== undefined) payload.usageLimit = Number(payload.usageLimit);
  if (payload.perUserLimit !== undefined) payload.perUserLimit = Number(payload.perUserLimit);
  if (payload.startsAt) payload.startsAt = new Date(payload.startsAt);
  if (payload.expiresAt) payload.expiresAt = new Date(payload.expiresAt);
  return payload;
};

export const createCoupon = async (req, res) => {
  try {
    const payload = buildCouponPayload(req.body);
    const { code, discountType, discountValue } = payload;

    if (!code || !discountType || discountValue === undefined) {
      return res.status(400).json({ success: false, message: "All required fields are mandatory" });
    }

    const existingCoupon = await Coupon.findOne({ code: payload.code });
    if (existingCoupon) {
      return res.status(400).json({ success: false, message: "Coupon already exists" });
    }

    const coupon = await Coupon.create({
      ...payload,
      active: payload.active ?? true,
      isPublic: payload.isPublic ?? true,
    });

    return res.status(201).json({ success: true, message: "Coupon created successfully", coupon });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const listCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, coupons });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ success: false, message: "Coupon not found" });
    }
    return res.status(200).json({ success: true, coupon });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCoupon = async (req, res) => {
  try {
    const payload = buildCouponPayload(req.body);
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, payload, { new: true });
    if (!coupon) {
      return res.status(404).json({ success: false, message: "Coupon not found" });
    }
    return res.status(200).json({ success: true, message: "Coupon updated successfully", coupon });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) {
      return res.status(404).json({ success: false, message: "Coupon not found" });
    }
    return res.status(200).json({ success: true, message: "Coupon deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleCouponStatus = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ success: false, message: "Coupon not found" });
    }
    coupon.active = !coupon.active;
    await coupon.save();
    return res.status(200).json({ success: true, message: `Coupon ${coupon.active ? "activated" : "deactivated"} successfully`, coupon });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const validateCoupon = async (req, res) => {
  try {
    const { code, amount } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, message: "Coupon code is required" });
    }

    const coupon = await Coupon.findOne({ code: String(code).toUpperCase(), active: true });
    if (!coupon) {
      return res.status(404).json({ success: false, message: "Invalid coupon" });
    }

    if (coupon.expiresAt && new Date() > coupon.expiresAt) {
      return res.status(400).json({ success: false, message: "Coupon expired" });
    }

    if (amount && amount < coupon.minAmount) {
      return res.status(400).json({ success: false, message: `Minimum amount should be ₹${coupon.minAmount}` });
    }

    let discount = 0;
    if (coupon.discountType === "fixed") {
      discount = coupon.discountValue;
    } else {
      discount = Math.round((amount * coupon.discountValue) / 100);
    }

    if (amount && discount > amount) {
      discount = amount;
    }

    return res.status(200).json({
      success: true,
      message: "Coupon applied successfully",
      discount,
      coupon: {
        _id: coupon._id,
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minAmount: coupon.minAmount,
        expiresAt: coupon.expiresAt,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};