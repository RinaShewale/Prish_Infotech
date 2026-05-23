import Certificate from "../models/certificate.model.js";

// ======================================================
// 🎓 CREATE CERTIFICATE
// ======================================================

export const createCertificate = async (req, res) => {
  try {
    const { user, course, certificateUrl } = req.body;

    const certificate = await Certificate.create({
      user,
      course,
      certificateUrl,
    });

    // populate after create
    const populatedCertificate = await Certificate.findById(
      certificate._id
    )
      .populate("user", "name email")
      .populate("course", "title");

    res.status(201).json({
      success: true,
      message: "Certificate created successfully 🎉",
      certificate: populatedCertificate,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// 📥 GET ALL CERTIFICATES
// ======================================================

export const getAllCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find()
      .populate("user", "name email")
      .populate("course", "title");

    res.status(200).json({
      success: true,
      certificates,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// 👤 GET LOGGED-IN USER CERTIFICATES
// ======================================================

export const getUserCertificates = async (req, res) => {
  try {

    const certificates = await Certificate.find({
      user: req.user._id,
    })
      .populate("user", "name email")
      .populate("course", "title");

    res.status(200).json({
      success: true,
      certificates,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// 🔍 GET SINGLE CERTIFICATE
// ======================================================

export const getCertificateById = async (req, res) => {
  try {

    const certificate = await Certificate.findById(req.params.id)
      .populate("user", "name email")
      .populate("course", "title");

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found ❌",
      });
    }

    res.status(200).json({
      success: true,
      certificate,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// 🗑️ DELETE CERTIFICATE
// ======================================================

export const deleteCertificate = async (req, res) => {
  try {

    const certificate = await Certificate.findById(req.params.id);

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found ❌",
      });
    }

    await certificate.deleteOne();

    res.status(200).json({
      success: true,
      message: "Certificate deleted successfully 🗑️",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};