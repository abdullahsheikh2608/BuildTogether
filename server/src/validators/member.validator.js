import validator from "validator";

import { MEMBER_MESSAGES } from "../constants/messages.js";

export const validateStartupId = (req, res, next) => {

    const { id } = req.params;

    if (!validator.isUUID(id, 4)) {
        return res.status(400).json({
            success: false,
            message: MEMBER_MESSAGES.INVALID_STARTUP_ID,
        });
    }

    next();

};

export const validateDeveloperId = (req, res, next) => {

    const { developerId } = req.params;

    if (!validator.isUUID(developerId, 4)) {
        return res.status(400).json({
            success: false,
            message: MEMBER_MESSAGES.INVALID_DEVELOPER_ID,
        });
    }

    next();

};