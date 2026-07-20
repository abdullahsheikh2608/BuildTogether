import { Router } from "express";

import {
    createApplication,
    getMyApplications,
    getStartupApplications,
    updateApplicationStatus,
} from "../controllers/application.controller.js";

import {
    authenticate,
} from "../middlewares/auth.middleware.js";

import {
    authorizeRole,
} from "../middlewares/role.middleware.js";

import {
    validateCreateApplication,
    validateStartupId,
    validateUpdateApplication,
    validateApplicationId,
} from "../validators/application.validator.js";

const router = Router();

// Get My Applications (Developer only)
router.get(
    "/me",
    authenticate,
    authorizeRole("developer"),
    getMyApplications
);

// Get Applications of a Startup
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
    validateCreateApplication,
    createApplication
);

// Update Application Status (Founder only)
router.patch(
    "/:id",
    authenticate,
    authorizeRole("founder"),
    validateApplicationId,
    validateUpdateApplication,
    updateApplicationStatus
);
export default router;