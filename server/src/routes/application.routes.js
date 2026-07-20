import { Router } from "express";

import {
    createApplication,
    getMyApplications,
} from "../controllers/application.controller.js";

import {
    authenticate,
} from "../middlewares/auth.middleware.js";

import {
    authorizeRole,
} from "../middlewares/role.middleware.js";

import {
    validateCreateApplication,
} from "../validators/application.validator.js";

const router = Router();

// Get My Applications (Developer only)
router.get(
    "/me",
    authenticate,
    authorizeRole("developer"),
    getMyApplications
);

// Apply to Startup (Developer only)
router.post(
    "/",
    authenticate,
    authorizeRole("developer"),
    validateCreateApplication,
    createApplication
);

export default router;