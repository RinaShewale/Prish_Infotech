import MediaModel from "../models/Media.model.js";


// 📥 CREATE / UPDATE SINGLE MEDIA DOC
export const createMedia = async (req, res) => {
  try {
    const updateFields = {};
    const allowedFields = [
      "reelVideo",
      "courseInfoVideo",
      "img1",
      "img2",
      "studentImg1",
      "studentImg2",
      "studentImg3",
      "studentImg4",
      "customAssets",
      "images",
    ];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updateFields[field] = req.body[field];
      }
    }

    const media = await Media.findOneAndUpdate(
      {},
      {
        $set: updateFields,
      },
      {
        new: true,
        upsert: true,
      }
    );

    res.status(200).json({
      success: true,
      media,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 📤 GET MEDIA
export const getMedia = async (req, res) => {
  try {
    const media = await Media.findOne();

    res.status(200).json({
      success: true,
      media,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};