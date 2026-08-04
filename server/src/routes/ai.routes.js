import { Router } from "express";

import { health } from "../controllers/ai.controller.js";

const router = Router();

router.get("/health", health);

export default router;