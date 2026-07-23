import { Router } from "express";

import { authenticate } from "../middlewares/auth.middleware.js";

import { memberController } from "../controllers/member.controller.js";

import {
    validateStartupId,
    validateDeveloperId,
} from "../validators/member.validator.js";

const router = Router();

// Founder Routes
router.get(
    "/startups/:id/members",
    authenticate,
    validateStartupId,
    memberController.getStartupMembers
);

router.delete(
    "/startups/:id/developers/:developerId",
    authenticate,
    validateStartupId,
    validateDeveloperId,
    memberController.removeProjectMember
);

// Developer Routes
router.get(
    "/me",
    authenticate,
    memberController.getMyProjects
);

export default router;