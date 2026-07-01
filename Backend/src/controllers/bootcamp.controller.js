import Bootcamp from "../models/Bootcamp.model.js";

const normalizeBootcampPayload = (body) => {
  const payload = { ...body };

  if (payload.slug && typeof payload.slug === "string") {
    payload.slug = payload.slug.trim().toLowerCase().replace(/\s+/g, "-");
  }

  if (payload.batch) {
    payload.batch = {
      year: payload.batch.year || new Date().getFullYear(),
      startDate: payload.batch.startDate || null,
      endDate: payload.batch.endDate || null,
      isActive: payload.batch.isActive ?? true,
    };
  }

  return payload;
};

export const createBootcamp = async (req, res) => {
  try {
    const payload = normalizeBootcampPayload(req.body);

    if (!payload.title || !payload.slug) {
      return res.status(400).json({ success: false, message: "Title and slug are required" });
    }

    const existing = await Bootcamp.findOne({ slug: payload.slug });
    if (existing) {
      return res.status(400).json({ success: false, message: "Bootcamp slug already exists" });
    }

    const bootcamp = await Bootcamp.create({
      ...payload,
      isActive: payload.status === "published",
    });

    return res.status(201).json({ success: true, message: "Bootcamp created successfully", bootcamp });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
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