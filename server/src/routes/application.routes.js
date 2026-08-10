import { Router } from "express";

import {
    createApplication,
    updateApplication,
    getApplicationById,
    downloadApplicationResume,
    getMyApplications,
    getStartupApplications,
    updateApplicationStatus,
} from "../controllers/application.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRole } from "../middlewares/role.middleware.js";
import { uploadResume } from "../middlewares/upload.middleware.js";

import {
    validateCreateApplication,
    validateStartupId,
    validateApplicationId,
} from "../validators/application.validator.js";

const router = Router();

// Get My Applications (Developer only)
router.get(
    "/",
    authenticate,
    authorizeRole("developer"),
    getMyApplications
);

router.get(
    "/my",
    authenticate,
    authorizeRole("developer"),
    getMyApplications
);

// Get Applications of a Startup (Founder only)
router.get(
    "/startup/:startupId",
    authenticate,
    authorizeRole("founder"),
    validateStartupId,
    getStartupApplications
);

// Apply to Startup (Developer only)
router.post(
    "/",
    authenticate,
    authorizeRole("developer"),
    uploadResume.single("resume"),
    validateCreateApplication,
    createApplication
);

// Get Application Details by ID (Developer owner or Founder owner)
router.get(
    "/:id",
    authenticate,
    validateApplicationId,
    getApplicationById
);

// Download / View Application Resume File (Developer owner or Founder owner)
router.get(
    "/:id/resume",
    authenticate,
    validateApplicationId,
    downloadApplicationResume
);

// Update Application (Dispatches based on role: Founder updates status, Developer updates content/resume)
router.patch(
    "/:id",
    authenticate,
    validateApplicationId,
    uploadResume.single("resume"),
    (req, res, next) => {
        if (req.user.role === "founder") {
            return updateApplicationStatus(req, res, next);
        } else if (req.user.role === "developer") {
            return updateApplication(req, res, next);
        }
        return res.status(403).json({ success: false, message: "Forbidden" });
    }
);

// Explicit Status Update Endpoint (Founder only)
router.patch(
    "/:id/status",
    authenticate,
    authorizeRole("founder"),
    validateApplicationId,
    updateApplicationStatus
);

export default router;