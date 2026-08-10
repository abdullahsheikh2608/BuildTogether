import { Router } from "express";

import searchController from "../controllers/search.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

// Global search across projects, tasks, startups, and applications.
// GET /api/search?q=term
router.get(
    "/",
    authenticate,
    searchController.globalSearch
);

export default router;