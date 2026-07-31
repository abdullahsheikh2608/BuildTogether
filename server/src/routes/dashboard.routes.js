import { Router } from "express";

import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRole } from "../middlewares/role.middleware.js";

import { getDashboardAnalytics } from "../controllers/dashboard.controller.js";

const router = Router();

router.get(
    "/analytics",
    authenticate,
    authorizeRole("founder"),
    getDashboardAnalytics
);

export default router;