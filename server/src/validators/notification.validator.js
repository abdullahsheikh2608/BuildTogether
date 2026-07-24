import validator from "validator";

import { NOTIFICATION_MESSAGES } from "../constants/messages.js";

export const validateNotificationId = (req, res, next) => {

    const { id } = req.params;

    if (!validator.isUUID(id, 4)) {
        return res.status(400).json({
            success: false,
            message: NOTIFICATION_MESSAGES.INVALID_NOTIFICATION_ID,
        });
    }

    next();

};