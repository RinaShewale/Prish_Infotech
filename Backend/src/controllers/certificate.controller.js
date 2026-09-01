import Certificate from "../models/Certificate.model.js";

// ======================================================
// 🎓 CREATE CERTIFICATE
// ======================================================

export const createCertificate = async (req, res) => {
  try {
    const {
      user,
      course,
      bootcamp,
      certificateUrl,
    } = req.body;

    const existingCertificate =
      await Certificate.findOne({
        user,
        course: course || null,
        bootcamp: bootcamp || null,
      });

    if (existingCertificate) {
      return res.status(400).json({
        success: false,
        message: "Certificate already exists",
      });
    }

    const certificate =
      await Certificate.create({
        user,
        course: course || null,
        bootcamp: bootcamp || null,
        certificateUrl:
          certificateUrl || "",
      });

    const populatedCertificate =
      await Certificate.findById(
        certificate._id
      )
        .populate("user", "name email")
        .populate("course", "title")
        .populate(
          "bootcamp",
          "title duration batch"
        );

    res.status(201).json({
      success: true,
      message:
        "Certificate created successfully 🎉",
      certificate:
        populatedCertificate,
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

export const getAllCertificates = async (
  req,
  res
) => {
  try {
    const certificates =
      await Certificate.find()
        .populate(
          "user",
          "name email"
        )
        .populate(
          "course",
          "title"
        )
        .populate(
          "bootcamp",
          "title duration batch"
        );

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

export const getUserCertificates =async (req, res) => {
    try {
      const certificates =
        await Certificate.find({
          user: req.user._id,
        })
          .populate(
            "user",
            "name email"
          )
          .populate(
            "course",
            "title"
          )
          .populate(
            "bootcamp",
            "title duration batch"
          );

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

export const getCertificateById =async (req, res) => {
    try {
      const certificate =
        await Certificate.findById(
          req.params.id
        )
          .populate(
            "user",
            "name email"
          )
          .populate(
            "course",
            "title"
          )
          .populate(
            "bootcamp",
            "title duration batch"
          );

      if (!certificate) {
        return res.status(404).json({
          success: false,
          message:
            "Certificate not found ❌",
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

export const deleteCertificate =async (req, res) => {
    try {
      const certificate =
        await Certificate.findById(
          req.params.id
        );

      if (!certificate) {
        return res.status(404).json({
          success: false,
          message:
            "Certificate not found ❌",
        });
      }

      await certificate.deleteOne();

      res.status(200).json({
        success: true,
        message:
          "Certificate deleted successfully 🗑️",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };