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

    const {
        email,
        password,
        role,
        full_name,
        username,
    } = req.body;

    // Required Fields
    if (!email || !password || !role || !full_name || !username) {
        return sendValidationError(
            res,
            AUTH_MESSAGES.ALL_FIELDS_REQUIRED
        );
    }

    // Valid Email Format
    if (!validator.isEmail(email)) {
        return sendValidationError(
            res,
            "Please enter a valid email address."
        );
    }

    // Only Gmail Allowed
    if (!validator.matches(email, /^[a-zA-Z0-9._%+-]+@gmail\.com$/)) {
        return sendValidationError(
            res,
            "Only Gmail addresses are allowed (example@gmail.com)."
        );
    }

    // Password
    if (!validator.isLength(password, { min: 8 })) {
        return sendValidationError(
            res,
            AUTH_MESSAGES.PASSWORD_MIN_LENGTH
        );
    }

    // Full Name
    if (!validator.matches(full_name, /^[A-Za-z ]+$/)) {
        return sendValidationError(
            res,
            "Full name can contain only alphabets and spaces."
        );
    }

    // Username
    if (!validator.matches(username, /^[A-Za-z0-9_]+$/)) {
        return sendValidationError(
            res,
            "Username can contain only letters, numbers and underscore (_)."
        );
    }

    // Role
    if (!["founder", "developer"].includes(role)) {
        return sendValidationError(
            res,
            AUTH_MESSAGES.INVALID_ROLE
        );
    }

    next();
};

export const validateLogin = (req, res, next) => {

    const { email, password } = req.body;

    if (!email) {
        return sendValidationError(
            res,
            AUTH_MESSAGES.EMAIL_REQUIRED
        );
    }

    if (!password) {
        return sendValidationError(
            res,
            AUTH_MESSAGES.PASSWORD_REQUIRED
        );
    }

    if (!validator.isEmail(email)) {
        return sendValidationError(
            res,
            "Please enter a valid email address."
        );
    }

    if (!validator.matches(email, /^[a-zA-Z0-9._%+-]+@gmail\.com$/)) {
        return sendValidationError(
            res,
            "Only Gmail addresses are allowed."
        );
    }

    next();
};

export const validateProfileUpdate = (req, res, next) => {
    const { full_name, username, role } = req.body;

    if (!full_name || !username || !role) {
        return sendValidationError(
            res,
            AUTH_MESSAGES.ALL_FIELDS_REQUIRED
        );
    }

    if (!validator.matches(full_name, /^[A-Za-z ]+$/)) {
        return sendValidationError(
            res,
            "Full name can contain only alphabets and spaces."
        );
    }

    if (!validator.matches(username, /^[A-Za-z0-9_]+$/)) {
        return sendValidationError(
            res,
            "Username can contain only letters, numbers and underscore (_)."
        );
    }

    if (!["founder", "developer"].includes(role)) {
        return sendValidationError(
            res,
            AUTH_MESSAGES.INVALID_ROLE
        );
    }

    next();
};