import validator from "validator";
import { AUTH_MESSAGES } from "../constants/messages.js";
import { HTTP_STATUS } from "../constants/statusCodes.js";

const sendValidationError = (res, message) => {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message,
    });
};

export const validateRegister = (req, res, next) => {
    const { email, password, role, full_name, username } = req.body;

    if (!email || !password || !role || !full_name || !username) {
        return sendValidationError(res, AUTH_MESSAGES.ALL_FIELDS_REQUIRED);
    }

    if (!validator.isEmail(email)) {
        return sendValidationError(res, AUTH_MESSAGES.INVALID_EMAIL);
    }

    if (!validator.isLength(password, { min: 8 })) {
        return sendValidationError(
            res,
            AUTH_MESSAGES.PASSWORD_MIN_LENGTH
        );
    }

    if (!["founder", "developer"].includes(role)) {
        return sendValidationError(res, AUTH_MESSAGES.INVALID_ROLE);
    }

    next();
};

export const validateLogin = (req, res, next) => {
    const { email, password } = req.body;

    if (!email) {
        return sendValidationError(res, AUTH_MESSAGES.EMAIL_REQUIRED);
    }

    if (!password) {
        return sendValidationError(res, AUTH_MESSAGES.PASSWORD_REQUIRED);
    }

    if (!validator.isEmail(email)) {
        return sendValidationError(res, AUTH_MESSAGES.INVALID_EMAIL);
    }

    next();
};