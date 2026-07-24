import { Router } from "express";

import projectController from "../controllers/project.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRole } from "../middlewares/role.middleware.js";

import projectValidator from "../validators/project.validator.js";

const router = Router();

router.get(
    "/founder",
    authenticate,
    authorizeRole("founder"),
    projectController.getFounderProjects
);

router.get(
    "/developer",
    authenticate,
    authorizeRole("developer"),
    projectController.getDeveloperProjects
);

router.get(
    "/:id",
    authenticate,
    projectValidator.validateProjectId,
    projectController.getProjectById
);

export default router;