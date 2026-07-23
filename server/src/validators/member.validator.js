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