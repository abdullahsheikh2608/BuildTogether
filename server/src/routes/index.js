import { Router } from "express";

import authRoutes from "./auth.routes.js";
import profileRoutes from "./profile.routes.js";
import startupRoutes from "./startup.routes.js";
import applicationRoutes from "./application.routes.js";
import projectRoutes from "./project.routes.js";
import taskRoutes from "./task.routes.js";
import notificationRoutes from "./notification.routes.js";
import memberRoutes from "./member.routes.js";

import dashboardRoutes from "./dashboard.routes.js";
import chatRoutes from "./chat.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/profiles", profileRoutes);
router.use("/startups", startupRoutes);
router.use("/applications", applicationRoutes);
router.use("/projects", projectRoutes);
router.use("/tasks", taskRoutes);
router.use("/notifications", notificationRoutes);
router.use("/members", memberRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/chat", chatRoutes);

export default router;