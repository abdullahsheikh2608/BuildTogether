import { Router } from "express";

import {
    createTaskController,
    getStartupTasksController,
    getMyTasksController,
    updateTaskController,
    updateTaskStatusController,
    deleteTaskController,
} from "../controllers/task.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRole } from "../middlewares/role.middleware.js";
import {
    validateCreateTask,
    validateTaskId,
    validateStartupId,
    validateUpdateTask,
    validateUpdateTaskStatus,
} from "../validators/task.validator.js";

const router = Router();

router.post(
    "/",
    authenticate,
    authorizeRole("founder"),
    validateCreateTask,
    createTaskController
);

router.get(
    "/startup/:startupId",
    authenticate,
    authorizeRole("founder"),
    validateStartupId,
    getStartupTasksController
);

router.get(
    "/me",
    authenticate,
    authorizeRole("developer"),
    getMyTasksController
);

router.patch(
    "/:id",
    authenticate,
    authorizeRole("founder"),
    validateTaskId,
    validateUpdateTask,
    updateTaskController
);

router.patch(
    "/:id/status",
    authenticate,
    authorizeRole("developer"),
    validateTaskId,
    validateUpdateTaskStatus,
    updateTaskStatusController
);

router.delete(
    "/:id",
    authenticate,
    authorizeRole("founder"),
    validateTaskId,
    deleteTaskController
);

router.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Task Routes Working",
    });
});

export default router;