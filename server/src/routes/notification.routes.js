import { Router } from "express";

import { authenticate } from "../middlewares/auth.middleware.js";

import { notificationController } from "../controllers/notification.controller.js";

import {
    validateNotificationId,
} from "../validators/notification.validator.js";

const router = Router();

router.get(
    "/",
    authenticate,
    notificationController.getMyNotifications
);

router.patch(
    "/read-all",
    authenticate,
    notificationController.markAllNotificationsAsRead
);

router.patch(
    "/:id/read",
    authenticate,
    validateNotificationId,
    notificationController.markNotificationAsRead
);

router.delete(
    "/:id",
    authenticate,
    validateNotificationId,
    notificationController.deleteNotification
);

export default router;