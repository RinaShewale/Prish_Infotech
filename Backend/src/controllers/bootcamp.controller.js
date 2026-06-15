import Bootcamp from "../models/Bootcamp.model.js";

// ======================
// CREATE BOOTCAMP (ADMIN)
// ======================
export const createBootcamp = async (req, res) => {
  try {
    const {
      title,
      description,
      type,
      level,
      duration,
      price,
      discountedPrice,
      location,
      batch,
      syllabus,
      highlights,
      features,
      pricing,
    } = req.body;

    // ======================
    // VALIDATION
    // ======================
    if (!title || !type) {
      return res.status(400).json({
        success: false,
        message: "Title and Type are required",
      });
    }

    // batch validation (important because it's required in schema)
    if (!batch || !batch.year) {
      return res.status(400).json({
        success: false,
        message: "Batch year is required",
      });
    }

    // ======================
    // CREATE BOOTCAMP
    // ======================
    const bootcamp = await Bootcamp.create({
      title,
      description,
      type,
      level,
      duration,
      price,
      discountedPrice,
      location,

      // ✅ batch (your reusable year schema)
      batch: {
        year: batch.year,
        startDate: batch.startDate || null,
        endDate: batch.endDate || null,
        isActive: batch.isActive ?? true,
      },

      // safe defaults
      syllabus: syllabus || [],
      highlights: highlights || [],
      features: features || [],
      pricing: pricing || [],
    });

    return res.status(201).json({
      success: true,
      message: "Bootcamp created successfully",
      bootcamp,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================
// GET ALL BOOTCAMPS
// ======================
export const getBootcamps = async (req, res) => {
  try {
    const bootcamps = await Bootcamp.find({ isActive: true })
      .sort({ createdAt: -1 })
      .select("-__v");

    return res.status(200).json({
      success: true,
      count: bootcamps.length,
      bootcamps,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================
// GET SINGLE BOOTCAMP
// ======================
export const getBootcamp = async (req, res) => {
  try {
    const { id } = req.params;

    const bootcamp = await Bootcamp.findById(id).select("-__v");

    if (!bootcamp) {
      return res.status(404).json({
        success: false,
        message: "Bootcamp not found",
      });
    }

    return res.status(200).json({
      success: true,
      bootcamp,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};