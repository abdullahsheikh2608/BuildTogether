import { HTTP_STATUS } from "../constants/statusCodes.js";

import { NOTIFICATION_MESSAGES } from "../constants/messages.js";

import { notificationService } from "../services/notification.service.js";

const getMyNotifications = async (req, res) => {

    try {

        const userId = req.user.id;

        const notifications = await notificationService.getMyNotifications(
            userId
        );

        if (notifications.length === 0) {
            return res.status(HTTP_STATUS.OK).json({
                success: true,
                message: NOTIFICATION_MESSAGES.NO_NOTIFICATIONS_FOUND,
                data: [],
            });
        }

        return res.status(HTTP_STATUS.OK).json({
            success: true,
            message: NOTIFICATION_MESSAGES.FETCH_SUCCESSFULLY,
            data: notifications,
        });

    } catch (error) {

        return res.status(
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        ).json({
            success: false,
            message: error.message,
        });

    }

};

const markNotificationAsRead = async (req, res) => {

    try {

        const { id } = req.params;

        const userId = req.user.id;

        const notification =
            await notificationService.markNotificationAsRead(
                id,
                userId
            );

        if (notification === "NOTIFICATION_NOT_FOUND") {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: NOTIFICATION_MESSAGES.NOTIFICATION_NOT_FOUND,
            });
        }

        return res.status(HTTP_STATUS.OK).json({
            success: true,
            message: NOTIFICATION_MESSAGES.READ_SUCCESSFULLY,
            data: notification,
        });

    } catch (error) {

        return res.status(
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        ).json({
            success: false,
            message: error.message,
        });

    }

};

const markAllNotificationsAsRead = async (req, res) => {

    try {

        const userId = req.user.id;

        await notificationService.markAllNotificationsAsRead(
            userId
        );

        return res.status(HTTP_STATUS.OK).json({
            success: true,
            message: NOTIFICATION_MESSAGES.READ_ALL_SUCCESSFULLY,
        });

    } catch (error) {

        return res.status(
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        ).json({
            success: false,
            message: error.message,
        });

    }

};

const deleteNotification = async (req, res) => {

    try {

        const { id } = req.params;

        const userId = req.user.id;

        const result =
            await notificationService.deleteNotification(
                id,
                userId
            );

        if (result === "NOTIFICATION_NOT_FOUND") {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: NOTIFICATION_MESSAGES.NOTIFICATION_NOT_FOUND,
            });
        }

        return res.status(HTTP_STATUS.OK).json({
            success: true,
            message: NOTIFICATION_MESSAGES.DELETE_SUCCESSFULLY,
        });

    } catch (error) {

        return res.status(
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        ).json({
            success: false,
            message: error.message,
        });

    }

};

export const notificationController = {
    getMyNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
};