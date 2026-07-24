import validator from "validator";

import { PROJECT_MESSAGES } from "../constants/messages.js";

const badRequest = (res, message) =>
    res.status(400).json({
        success: false,
        message,
    });

const projectValidator = {

    validateProjectId: (req, res, next) => {

        const { id } = req.params;

        if (!validator.isUUID(id, 4)) {
            return badRequest(
                res,
                PROJECT_MESSAGES.INVALID_PROJECT_ID
            );
        }

        next();

    },

};

export default projectValidator;