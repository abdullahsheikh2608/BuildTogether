import { Router } from "express";

import taskController from "../controllers/task.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRole } from "../middlewares/role.middleware.js";
import taskValidator from "../validators/task.validator.js";

const router = Router();

router.post(
    "/",
    authenticate,
    authorizeRole("founder"),
    taskValidator.validateCreateTask,
    taskController.createTask
);

router.get(
    "/startup/:startupId",
    authenticate,
    authorizeRole("founder"),
    taskValidator.validateStartupId,
    taskController.getStartupTasks
);

router.get(
    "/me",
    authenticate,
    authorizeRole("developer"),
    taskController.getMyTasks
);

router.patch(
    "/:id",
    authenticate,
    authorizeRole("founder"),
    taskValidator.validateTaskId,
    taskValidator.validateUpdateTask,
    taskController.updateTask
);

router.patch(
    "/:id/status",
    authenticate,
    authorizeRole("developer"),
    taskValidator.validateTaskId,
    taskValidator.validateUpdateTaskStatus,
    taskController.updateTaskStatus
);

router.delete(
    "/:id",
    authenticate,
    authorizeRole("founder"),
    taskValidator.validateTaskId,
    taskController.deleteTask
);

router.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Task Routes Working",
    });
});

export default router;