import Bootcamp from "../models/Bootcamp.model.js";

const normalizeBootcampPayload = (body) => {
  const payload = { ...body };

  // 1. Normalize Batch
  if (payload.batch) {
    const currentYear = new Date().getFullYear();
    payload.batch = {
      year: Number(payload.batch.year) || currentYear,
      startDate: payload.batch.startDate === "" ? null : payload.batch.startDate,
      endDate: payload.batch.endDate === "" ? null : payload.batch.endDate,
      isActive: payload.batch.isActive ?? true,
      label: payload.batch.label || String(payload.batch.year || currentYear),
    };
  }

  // 2. Normalize Numbers
  payload.price = Number(payload.price) || 0;
  payload.discountedPrice = Number(payload.discountedPrice) || 0;

  // 3. Clean Syllabus (Mongoose requires subtitle to be present)
  if (payload.syllabus) {
    payload.syllabus = payload.syllabus
      .filter(s => s.title && s.title.trim() !== "")
      .map(s => ({
        ...s,
        content: s.content.filter(c => c.subtitle && c.subtitle.trim() !== "")
      }));
  }

  return payload;
};

export const createBootcamp = async (req, res) => {
  try {
    const payload = normalizeBootcampPayload(req.body);

    // Validation
    if (!payload.title || !payload.description || !payload.duration || payload.price <= 0) {
      return res.status(400).json({
        success: false,
        message: "Title, Description, Duration, and Price are required.",
      });
    }

    const bootcamp = await Bootcamp.create(payload);

    return res.status(201).json({
      success: true,
      message: "Bootcamp created successfully.",
      bootcamp,
    });
  } catch (error) {
    console.error("DB CREATE ERROR:", error); // Check your terminal for this!
    return res.status(500).json({
      success: false,
      message: error.message, // This will tell you exactly which field failed
    });
  }
};



export const getAdminBootcamps = async (req, res) => {
  try {
    const bootcamps = await Bootcamp.find().sort({ createdAt: -1 }).select("-__v");
    return res.status(200).json({ success: true, count: bootcamps.length, bootcamps });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getBootcamps = async (req, res) => {
  try {
    const bootcamps = await Bootcamp.find({ isActive: true }).sort({ createdAt: -1 }).select("-__v");
    return res.status(200).json({ success: true, count: bootcamps.length, bootcamps });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getBootcamp = async (req, res) => {
  try {
    const { id } = req.params;
    const bootcamp = await Bootcamp.findById(id).select("-__v");

    if (!bootcamp) {
      return res.status(404).json({ success: false, message: "Bootcamp not found" });
    }

    return res.status(200).json({ success: true, bootcamp });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateBootcamp = async (req, res) => {
  try {
    const payload = normalizeBootcampPayload(req.body);
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, payload, { new: true });

    if (!bootcamp) {
      return res.status(404).json({ success: false, message: "Bootcamp not found" });
    }

    return res.status(200).json({ success: true, message: "Bootcamp updated successfully", bootcamp });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteBootcamp = async (req, res) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
    if (!bootcamp) {
      return res.status(404).json({ success: false, message: "Bootcamp not found" });
    }

    return res.status(200).json({ success: true, message: "Bootcamp deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};