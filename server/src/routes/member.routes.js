import { Router } from "express";

import { authenticate } from "../middlewares/auth.middleware.js";

import { memberController } from "../controllers/member.controller.js";

import { validateStartupId } from "../validators/member.validator.js";

const router = Router();

// Founder Routes
router.get(
    "/startups/:id/members",
    authenticate,
    validateStartupId,
    memberController.getStartupMembers
);

// Developer Routes
router.get(
    "/me",
    authenticate,
    memberController.getMyProjects
);

export default router;