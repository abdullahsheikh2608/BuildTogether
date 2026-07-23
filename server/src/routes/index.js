import { Router } from "express";

import authRoutes from "./auth.routes.js";
import profileRoutes from "./profile.routes.js";
import startupRoutes from "./startup.routes.js";
import applicationRoutes from "./application.routes.js";
import projectRoutes from "./project.routes.js";
import taskRoutes from "./task.routes.js";
import memberRoutes from "./member.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/profiles", profileRoutes);
router.use("/startups", startupRoutes);
router.use("/applications", applicationRoutes);
router.use("/projects", projectRoutes);
router.use("/tasks", taskRoutes);
router.use("/members", memberRoutes);

export default router;