import express from "express";

import {
    enrollCourse,
    getUserEnrollments,
} from "../controllers/entrollment.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// GET USER ENROLLMENTS
router.get(
    "/my-enrollments",
    protect,
    getUserEnrollments
);

// ENROLL COURSE
router.post(
    "/enroll",
    protect,
    enrollCourse
);

export default router;