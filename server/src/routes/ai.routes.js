import { Router } from "express";

import { summarizeProject, generateWeeklyReport } from "../controllers/ai.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { aiValidator } from "../validators/ai.validator.js";

const router = Router();

router.post(
    "/startups/:startupId/summary",
    authenticate,
    aiValidator.validateStartupId,
    summarizeProject
);

router.post(
    "/startups/:startupId/weekly-report",
    authenticate,
    aiValidator.validateStartupId,
    generateWeeklyReport
);

export default router;