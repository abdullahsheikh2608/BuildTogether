import { Router } from "express";

import {
    createStartup,
    getAllStartups,
    getStartupById,
    updateStartup,
    deleteStartup,
} from "../controllers/startup.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRole } from "../middlewares/role.middleware.js";

import {
    validateCreateStartup,
    validateStartupId,
    validateUpdateStartup,
} from "../validators/startup.validator.js";

const router = Router();

// Get all startups
router.get("/", getAllStartups);

// Get startup by id
router.get(
    "/:id",
    validateStartupId,
    getStartupById
);

// Create startup (Founder only)
router.post(
    "/",
    authenticate,
    authorizeRole("founder"),
    validateCreateStartup,
    createStartup
);

// Update startup (Founder only)
router.patch(
    "/:id",
    authenticate,
    authorizeRole("founder"),
    validateStartupId,
    validateUpdateStartup,
    updateStartup
);

// Delete startup (Founder only)
router.delete(
    "/:id",
    authenticate,
    authorizeRole("founder"),
    validateStartupId,
    deleteStartup
);

export default router;