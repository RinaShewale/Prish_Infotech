import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema(
  {
    reelVideo: String,
    courseInfoVideo: String,

    img1: String,
    img2: String,

    // 🎓 NEW: Graduate / Student Images (4 images)
    studentImg1: String,
    studentImg2: String,
    studentImg3: String,
    studentImg4: String,
  },
  { timestamps: true }
);

export default mongoose.model("Media", mediaSchema);