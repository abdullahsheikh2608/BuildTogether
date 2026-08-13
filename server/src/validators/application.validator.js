import validator from "validator";

import {
    APPLICATION_STATUS,
    APPLICATION_LIMITS,
} from "../constants/application.constants.js";

import {
    APPLICATION_MESSAGES,
} from "../constants/messages.js";

const isValidOptionalUrl = (value) =>
    value === undefined ||
    value === null ||
    value === "" ||
    validator.isURL(value, { require_protocol: true });

export const validateCreateApplication = (req, res, next) => {

    const {
        startup_id,
        message,
        relevant_experience,
        github_url,
        portfolio_url,
    } = req.body;

    if (!startup_id) {
        return res.status(400).json({
            success: false,
            message: APPLICATION_MESSAGES.STARTUP_ID_REQUIRED,
        });
    }

    if (!validator.isUUID(startup_id, 4)) {
        return res.status(400).json({
            success: false,
            message: APPLICATION_MESSAGES.INVALID_STARTUP_ID,
        });
    }

    if (
        message !== undefined &&
        message !== "" &&
        !validator.isLength(message, { max: APPLICATION_LIMITS.MESSAGE_MAX })
    ) {
        return res.status(400).json({
            success: false,
            message: APPLICATION_MESSAGES.MESSAGE_TOO_LONG,
        });
    }

    if (
        relevant_experience !== undefined &&
        relevant_experience !== "" &&
        !validator.isLength(relevant_experience, { max: APPLICATION_LIMITS.EXPERIENCE_MAX })
    ) {
        return res.status(400).json({
            success: false,
            message: APPLICATION_MESSAGES.EXPERIENCE_TOO_LONG,
        });
    }

    if (!isValidOptionalUrl(github_url) || !isValidOptionalUrl(portfolio_url)) {
        return res.status(400).json({
            success: false,
            message: APPLICATION_MESSAGES.INVALID_URL,
        });
    }

    next();
};

export const validateUpdateApplicationDetails = (req, res, next) => {

    const { message, relevant_experience, github_url, portfolio_url } = req.body;

    if (
        message !== undefined &&
        message !== "" &&
        !validator.isLength(message, { max: APPLICATION_LIMITS.MESSAGE_MAX })
    ) {
        return res.status(400).json({
            success: false,
            message: APPLICATION_MESSAGES.MESSAGE_TOO_LONG,
        });
    }

    if (
        relevant_experience !== undefined &&
        relevant_experience !== "" &&
        !validator.isLength(relevant_experience, { max: APPLICATION_LIMITS.EXPERIENCE_MAX })
    ) {
        return res.status(400).json({
            success: false,
            message: APPLICATION_MESSAGES.EXPERIENCE_TOO_LONG,
        });
    }

    if (!isValidOptionalUrl(github_url) || !isValidOptionalUrl(portfolio_url)) {
        return res.status(400).json({
            success: false,
            message: APPLICATION_MESSAGES.INVALID_URL,
        });
    }

    next();
};

export const validateUpdateApplication = (req, res, next) => {

    const { status } = req.body;

    if (!status) {
        return res.status(400).json({
            success: false,
            message: APPLICATION_MESSAGES.STATUS_REQUIRED,
        });
    }

    if (
        !Object.values(APPLICATION_STATUS).includes(status)
    ) {
        return res.status(400).json({
            success: false,
            message: APPLICATION_MESSAGES.INVALID_STATUS,
        });
    }

    next();
};

export const validateApplicationId = (req, res, next) => {

    const { id } = req.params;

    if (!validator.isUUID(id, 4)) {
        return res.status(400).json({
            success: false,
            message: APPLICATION_MESSAGES.INVALID_APPLICATION_ID,
        });
    }

    next();
};

export const validateStartupId = (req, res, next) => {

    const { startupId } = req.params;

    if (!validator.isUUID(startupId)) {
        return res.status(400).json({
            success: false,
            message: APPLICATION_MESSAGES.INVALID_STARTUP_ID,
        });
    }

    next();
};