import express from "express";

import {
    enrollCourse,
    getAllEnrollments,
    getUserEnrollments,
} from "../controllers/entrollment.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/admin.middleware.js";

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


router.get(
    "/admin/enrollments",
    protect,
    adminOnly,
    getAllEnrollments
);

export default router;