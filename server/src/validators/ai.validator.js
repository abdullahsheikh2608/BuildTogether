import validator from "validator";

import { AI_MESSAGES } from "../constants/ai.constants.js";

const badRequest = (res, message) =>
    res.status(400).json({ success: false, message });

const aiValidator = {
    validateStartupId: (req, res, next) => {
        const { startupId } = req.params;

        if (!validator.isUUID(startupId, 4)) {
            return badRequest(res, AI_MESSAGES.INVALID_STARTUP_ID);
        }

        next();
    },
};

export { aiValidator };