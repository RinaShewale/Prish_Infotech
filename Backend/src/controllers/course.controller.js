import Course from "../models/Course.model.js";
import Notification from "../models/Notification.model.js";
import User from "../models/User.model.js";
import slugify from "slugify";


// ======================================================
// ✅ CREATE COURSE
// ======================================================

export const createCourse = async (
  req,
  res
) => {
  try {

    const {
      title,
      description,
      price,
      oldPrice,
      accessDuration,
      level,
      category,
      type,
      heroQuote,
      heroHighlight,
      syllabus,
      batchYear,
      cohortStartDate
    } = req.body;

    // ✅ VALIDATION

    if (
      !title ||
      !description ||
      price === undefined ||
      !category
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please fill all fields",
      });
    }

    // ✅ THUMBNAIL

    const thumbnail =
      req.file?.path || req.body.thumbnail;

    if (!thumbnail) {
      return res.status(400).json({
        success: false,
        message:
          "Thumbnail is required",
      });
    }

    // ✅ GENERATE SLUG

    const slug = slugify(title, {
      lower: true,
      strict: true,
    });

    // ✅ CHECK EXISTING COURSE

    const existingCourse =
      await Course.findOne({
        slug,
      });

    if (existingCourse) {
      return res.status(400).json({
        success: false,
        message:
          "Course already exists",
      });
    }

    // ✅ FORMAT CATEGORY

    const formattedCategory =
      Array.isArray(category)
        ? category.map((c) =>
          c.trim()
        )
        : [category.trim()];

    // ✅ PARSE SYLLABUS

    const parsedSyllabus =
      typeof syllabus === "string"
        ? JSON.parse(syllabus)
        : syllabus || [];

    // ✅ PRICE CONVERSION

    const finalPrice =
      Number(price) || 0;

    const finalOldPrice =
      Number(oldPrice) || 0;

    // ✅ CALCULATE DISCOUNT

    let discount = 0;

    if (
      finalOldPrice > 0 &&
      finalOldPrice >
      finalPrice
    ) {

      discount = Math.round(
        (
          (finalOldPrice -
            finalPrice) /
          finalOldPrice
        ) * 100
      );
    }

    // ✅ CREATE COURSE

    const course =
      await Course.create({
        title,
        slug,
        description,
        thumbnail,

        video:
          req.body.video || "",

        type:
          type || "recorded",

        price: finalPrice,

        oldPrice:
          finalOldPrice,

        discount,

        accessDuration:
          accessDuration ||
          "Lifetime Access",

        level:
          level || "beginner",

        category:
          formattedCategory,

        heroQuote:
          heroQuote ||
          "Build Enterprise Software Like The Top 1%",

        heroHighlight:
          heroHighlight ||
          "Become Industry Ready",


        batchYear:
          Number(batchYear) ||
          new Date().getFullYear(),


        cohortStartDate: cohortStartDate
          ? new Date(cohortStartDate)
          : null,

        syllabus:
          parsedSyllabus,

        instructor:
          req.user._id,
      });

    // ✅ POPULATE INSTRUCTOR

    await course.populate(
      "instructor",
      "name email"
    );

    // Notify students when a new course is published.
    const students = await User.find({
      role: { $ne: "admin" },
    }).select("_id");

    if (students.length > 0) {
      await Notification.insertMany(
        students.map((student) => ({
          user: student._id,
          title: "New Course Published",
          message: `${course.title} is now available to explore`,
          type: "success",
        }))
      );
    }

    res.status(201).json({
      success: true,
      course,
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


// ======================================================
// ✅ GET ALL COURSES
// ======================================================

export const getAllCourses =
  async (req, res) => {
    try {

      const courses =
        await Course.find()
          .populate(
            "instructor",
            "name email"
          )
          .sort({
            createdAt: -1,
          });

      res.json({
        success: true,
        courses,
      });

    } catch (err) {

      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  };


// ======================================================
// ✅ GET SINGLE COURSE
// ======================================================

export const getSingleCourse =
  async (req, res) => {
    try {

      const { slug } =
        req.params;

      const course =
        await Course.findOne({
          slug,
        }).populate(
          "instructor",
          "name email"
        );

      if (!course) {
        return res.status(404).json({
          success: false,
          message:
            "Course not found",
        });
      }

      res.json({
        success: true,
        course,
      });

    } catch (err) {

      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  };


// ======================================================
// ✅ UPDATE COURSE
// ======================================================

export const updateCourse =
  async (req, res) => {
    try {

      // ✅ GENERATE NEW SLUG

      if (req.body.title) {
        req.body.slug =
          slugify(
            req.body.title,
            {
              lower: true,
              strict: true,
            }
          );
      }

      // ✅ CONVERT PRICES

      if (req.body.price) {
        req.body.price =
          Number(
            req.body.price
          );
      }

      if (req.body.oldPrice) {
        req.body.oldPrice =
          Number(
            req.body.oldPrice
          );
      }

      if (req.body.batchYear) {
        req.body.batchYear = Number(
          req.body.batchYear
        );
      }


      if (req.body.cohortStartDate) {
        req.body.cohortStartDate = new Date(req.body.cohortStartDate);
      }

      // ✅ CALCULATE DISCOUNT

      const price =
        req.body.price || 0;

      const oldPrice =
        req.body.oldPrice || 0;

      if (
        oldPrice > 0 &&
        oldPrice > price
      ) {

        req.body.discount =
          Math.round(
            (
              (oldPrice -
                price) /
              oldPrice
            ) * 100
          );

      } else {

        req.body.discount = 0;
      }

      // ✅ UPDATE COURSE

      const course =
        await Course.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            new: true,
            runValidators: true,
          }
        ).populate(
          "instructor",
          "name email"
        );

      // ✅ NOT FOUND

      if (!course) {
        return res.status(404).json({
          success: false,
          message:
            "Course not found",
        });
      }

      res.json({
        success: true,
        course,
      });

    } catch (err) {

      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  };


// ======================================================
// ✅ DELETE COURSE
// ======================================================

export const deleteCourse =
  async (req, res) => {
    try {

      const course =
        await Course.findByIdAndDelete(
          req.params.id
        );

      if (!course) {
        return res.status(404).json({
          success: false,
          message:
            "Course not found",
        });
      }

      res.json({
        success: true,
        message:
          "Deleted successfully",
      });

    } catch (err) {

      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  };


// ======================================================
// ✅ UPLOAD COURSE VIDEO
// ======================================================

export const uploadCourseVideo =
  async (req, res) => {
    try {

      const course =
        await Course.findById(
          req.params.id
        );

      if (!course) {
        return res.status(404).json({
          success: false,
          message:
            "Course not found",
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message:
            "Video required",
        });
      }

      // ✅ SAVE VIDEO PATH

      course.video =
        req.file.path;

      await course.save();

      res.json({
        success: true,
        course,
      });

    } catch (err) {

      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  };