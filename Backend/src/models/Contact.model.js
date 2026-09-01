import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    // 👤 FULL NAME
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // 📧 EMAIL
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    // 📞 PHONE
    phone: {
      type: String,
      required: true,
      trim: true,
    },

    // 📅 DATE
    preferredDate: {
      type: String,
      required: true,
    },

    // ⏰ TIME
    preferredTime: {
      type: String,
      required: true,
    },

    // 💬 REASON
    inquiryReason: {
      type: String,
      required: true,
      trim: true,
    },

    // 🚀 NEW: STATUS SYSTEM
    status: {
      type: String,
      enum: ["pending", "contacted", "missed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const Contact = mongoose.models.Contact || mongoose.model("Contact", contactSchema);

export default Contact;