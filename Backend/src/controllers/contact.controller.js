import Contact from "../models/Contact.model.js";

// ======================================================
// 📞 CREATE CONTACT (DEFAULT = PENDING)
// ======================================================
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

    const contact = await Contact.create({
      name,
      email,
      phone,
      preferredDate,
      preferredTime,
      inquiryReason,
      status: "pending",
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

// ======================================================
// 📋 GET ALL CONTACTS (ADMIN)
// ======================================================
export const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      contacts,
    });
  } catch (error) {
    console.log("GET CONTACTS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ======================================================
// 🗑 DELETE CONTACT
// ======================================================
export const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact request not found",
      });
    }

    await Contact.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Contact request deleted successfully",
    });
  } catch (error) {
    console.log("DELETE CONTACT ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ======================================================
// 🔁 UPDATE STATUS (NEW API)
// ======================================================
export const updateContactStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowed = ["pending", "contacted", "missed"];

    if (!allowed.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    contact.status = status;
    await contact.save();

    res.status(200).json({
      success: true,
      message: "Status updated successfully",
      contact,
    });
  } catch (error) {
    console.log("STATUS UPDATE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};