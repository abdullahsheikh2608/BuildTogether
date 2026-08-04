import { Router } from "express";

import { health, summarizeProject } from "../controllers/ai.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { aiValidator } from "../validators/ai.validator.js";

const router = Router();

router.get("/health", health);

router.post(
    "/startups/:startupId/summary",
    authenticate,
    aiValidator.validateStartupId,
    summarizeProject
);

export default router;