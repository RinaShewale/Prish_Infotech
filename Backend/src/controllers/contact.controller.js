import Contact from "../models/Contact.model.js";

export const createContact = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      preferredDate,
      preferredTime,
      inquiryReason,
    } = req.body;

    // ✅ Validation
    if (
      !name ||
      !email ||
      !phone ||
      !preferredDate ||
      !preferredTime ||
      !inquiryReason
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // ✅ Create Contact
    const contact = await Contact.create({
      name,
      email,
      phone,
      preferredDate,
      preferredTime,
      inquiryReason,
    });

    res.status(201).json({
      success: true,
      message: "Callback request submitted successfully",
      contact,
    });
  } catch (error) {
    console.log("CONTACT ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};