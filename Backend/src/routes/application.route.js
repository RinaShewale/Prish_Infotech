import express from "express";

import {
    createApplication,
    getAllApplications,
    updateApplicationStatus,
} from "../controllers/application.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/admin.middleware.js";

const router = express.Router();

/*
=================================
PUBLIC ROUTE
=================================
*/

// Submit Application
router.post("/", createApplication);

/*
=================================
ADMIN ROUTES
=================================
*/

// Get All Applications
router.get(
    "/",
    protect,
    adminOnly,
    getAllApplications
);

// Update Application Status
router.patch(
    "/:id/status",
    protect,
    adminOnly,
    updateApplicationStatus
);

export default router;