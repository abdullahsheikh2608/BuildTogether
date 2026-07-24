import { Router } from "express";

import authRoutes from "./auth.routes.js";
import profileRoutes from "./profile.routes.js";
import startupRoutes from "./startup.routes.js";
import applicationRoutes from "./application.routes.js";
import projectRoutes from "./project.routes.js";
import taskRoutes from "./task.routes.js";
import notificationRoutes from "./notification.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/profiles", profileRoutes);
router.use("/startups", startupRoutes);
router.use("/applications", applicationRoutes);
router.use("/projects", projectRoutes);
router.use("/tasks", taskRoutes);
router.use("/notifications", notificationRoutes);

export default router;