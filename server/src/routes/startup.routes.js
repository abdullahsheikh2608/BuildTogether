import { Router } from "express";

import { createStartup } from "../controllers/startup.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRole } from "../middlewares/role.middleware.js";

import { validateCreateStartup } from "../validators/startup.validator.js";

const router = Router();

router.post(
    "/",
    authenticate,
    authorizeRole("founder"),
    validateCreateStartup,
    createStartup
);

export default router;