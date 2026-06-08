import Media from "../models/Media.model.js";

// 📥 CREATE / UPDATE SINGLE MEDIA DOC
export const createMedia = async (req, res) => {
  try {
    const {
      reelVideo,
      courseInfoVideo,

      img1,
      img2,

      studentImg1,
      studentImg2,
      studentImg3,
      studentImg4,
    } = req.body;

    const media = await Media.findOneAndUpdate(
      {},
      {
        $set: {
          reelVideo: reelVideo || "",
          courseInfoVideo: courseInfoVideo || "",

          img1: img1 || "",
          img2: img2 || "",

          studentImg1: studentImg1 || "",
          studentImg2: studentImg2 || "",
          studentImg3: studentImg3 || "",
          studentImg4: studentImg4 || "",
        },
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