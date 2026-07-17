import { Router } from "express";

import {
    createApplication,
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

// Apply to Startup (Developer only)
router.post(
    "/",
    authenticate,
    authorizeRole("developer"),
    validateCreateApplication,
    createApplication
);

export default router;