import validator from "validator";

import {
    STARTUP_LIMITS,
    STARTUP_STATUS,
} from "../constants/startup.constants.js";

import {
    STARTUP_MESSAGES,
} from "../constants/messages.js";

export const validateCreateStartup = (req, res, next) => {

    const {
        title,
        tagline,
        description,
        tech_stack,
        required_roles,
        status,
    } = req.body;

    if (!title) {
        return res.status(400).json({
            success: false,
            message: STARTUP_MESSAGES.TITLE_REQUIRED,
        });
    }

    if (
        !validator.isLength(title, {
            min: STARTUP_LIMITS.TITLE_MIN,
            max: STARTUP_LIMITS.TITLE_MAX,
        })
    ) {
        return res.status(400).json({
            success: false,
            message: STARTUP_MESSAGES.TITLE_LENGTH,
        });
    }

    if (!tagline) {
        return res.status(400).json({
            success: false,
            message: STARTUP_MESSAGES.TAGLINE_REQUIRED,
        });
    }

    if (
        !validator.isLength(tagline, {
            min: STARTUP_LIMITS.TAGLINE_MIN,
            max: STARTUP_LIMITS.TAGLINE_MAX,
        })
    ) {
        return res.status(400).json({
            success: false,
            message: STARTUP_MESSAGES.TAGLINE_LENGTH,
        });
    }

    if (!description) {
        return res.status(400).json({
            success: false,
            message: STARTUP_MESSAGES.DESCRIPTION_REQUIRED,
        });
    }

    if (
        !validator.isLength(description, {
            min: STARTUP_LIMITS.DESCRIPTION_MIN,
            max: STARTUP_LIMITS.DESCRIPTION_MAX,
        })
    ) {
        return res.status(400).json({
            success: false,
            message: STARTUP_MESSAGES.DESCRIPTION_LENGTH,
        });
    }

    if (!Array.isArray(tech_stack)) {
        return res.status(400).json({
            success: false,
            message: STARTUP_MESSAGES.TECH_STACK_ARRAY,
        });
    }

    if (tech_stack.length === 0) {
        return res.status(400).json({
            success: false,
            message: STARTUP_MESSAGES.TECH_STACK_EMPTY,
        });
    }

    if (!Array.isArray(required_roles)) {
        return res.status(400).json({
            success: false,
            message: STARTUP_MESSAGES.REQUIRED_ROLES_ARRAY,
        });
    }

    if (required_roles.length === 0) {
        return res.status(400).json({
            success: false,
            message: STARTUP_MESSAGES.REQUIRED_ROLES_EMPTY,
        });
    }

    if (!status) {
        return res.status(400).json({
            success: false,
            message: STARTUP_MESSAGES.STATUS_REQUIRED,
        });
    }

    if (
        !Object.values(STARTUP_STATUS).includes(status)
    ) {
        return res.status(400).json({
            success: false,
            message: STARTUP_MESSAGES.INVALID_STATUS,
        });
    }

    next();
};