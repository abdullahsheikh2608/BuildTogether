import { Router } from "express";

import {
    createStartup,
    getAllStartups,
    getStartupById,
} from "../controllers/startup.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRole } from "../middlewares/role.middleware.js";

import {
     validateCreateStartup ,
     validateStartupId ,
    } from "../validators/startup.validator.js";

const router = Router();

// Get all startups
router.get("/", getAllStartups);

// Get startup by id
router.get("/:id", validateStartupId, getStartupById);

// Create startup (Founder only)
router.post(
    "/",
    authenticate,
    authorizeRole("founder"),
    validateCreateStartup,
    createStartup
);

export default router;