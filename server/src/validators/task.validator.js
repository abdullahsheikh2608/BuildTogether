import validator from "validator";

import {
    TASK_PRIORITY,
    TASK_STATUS,
    TASK_LIMITS,
} from "../constants/task.constant.js";

import { TASK_MESSAGES } from "../constants/messages.js";

const badRequest = (res, message) =>
    res.status(400).json({ success: false, message });

export const validateCreateTask = (req, res, next) => {
    const {
        startup_id,
        assigned_to,
        title,
        description,
        priority,
        status,
        deadline,
    } = req.body;

    if (!startup_id) {
        return badRequest(res, TASK_MESSAGES.STARTUP_ID_REQUIRED);
    }

    if (!validator.isUUID(startup_id, 4)) {
        return badRequest(res, TASK_MESSAGES.INVALID_STARTUP_ID);
    }

    if (!assigned_to) {
        return badRequest(res, TASK_MESSAGES.ASSIGNED_TO_REQUIRED);
    }

    if (!validator.isUUID(assigned_to, 4)) {
        return badRequest(res, TASK_MESSAGES.INVALID_USER_ID);
    }

    if (!title) {
        return badRequest(res, TASK_MESSAGES.TITLE_REQUIRED);
    }

    if (!description) {
        return badRequest(res, TASK_MESSAGES.DESCRIPTION_REQUIRED);
    }

    if (
        !validator.isLength(title, {
            min: TASK_LIMITS.TITLE_MIN,
            max: TASK_LIMITS.TITLE_MAX,
        })
    ) {
        return badRequest(res, TASK_MESSAGES.TITLE_LENGTH);
    }

    if (
        !validator.isLength(description, {
            min: 10,
            max: TASK_LIMITS.DESCRIPTION_MAX,
        })
    ) {
        return badRequest(res, TASK_MESSAGES.DESCRIPTION_LENGTH);
    }

    if (priority && !Object.values(TASK_PRIORITY).includes(priority)) {
        return badRequest(res, TASK_MESSAGES.INVALID_PRIORITY);
    }

    if (status && !Object.values(TASK_STATUS).includes(status)) {
        return badRequest(res, TASK_MESSAGES.INVALID_STATUS);
    }

    next();
};

export const validateTaskId = (req, res, next) => {
    const { id } = req.params;

    if (!validator.isUUID(id, 4)) {
        return badRequest(res, TASK_MESSAGES.INVALID_TASK_ID);
    }

    next();
};

export const validateStartupId = (req, res, next) => {
    const { startupId } = req.params;

    if (!validator.isUUID(startupId, 4)) {
        return badRequest(res, TASK_MESSAGES.INVALID_STARTUP_ID);
    }

    next();
};

export const validateUpdateTask = (req, res, next) => {
    const {
        assigned_to,
        title,
        description,
        priority,
        status,
        deadline,
    } = req.body;

    const allowedKeys = [
        "assigned_to",
        "title",
        "description",
        "priority",
        "status",
        "deadline",
    ];

    const hasKnownFields = Object.keys(req.body).some((key) =>
        allowedKeys.includes(key)
    );

    if (!hasKnownFields) {
        return badRequest(res, TASK_MESSAGES.NOTHING_TO_UPDATE);
    }

    if (assigned_to !== undefined && !validator.isUUID(assigned_to, 4)) {
        return badRequest(res, TASK_MESSAGES.INVALID_USER_ID);
    }

    if (
        title !== undefined &&
        !validator.isLength(title, {
            min: TASK_LIMITS.TITLE_MIN,
            max: TASK_LIMITS.TITLE_MAX,
        })
    ) {
        return badRequest(res, TASK_MESSAGES.TITLE_LENGTH);
    }

    if (
        description !== undefined &&
        !validator.isLength(description, {
            min: 10,
            max: TASK_LIMITS.DESCRIPTION_MAX,
        })
    ) {
        return badRequest(res, TASK_MESSAGES.DESCRIPTION_LENGTH);
    }

    if (priority !== undefined && !Object.values(TASK_PRIORITY).includes(priority)) {
        return badRequest(res, TASK_MESSAGES.INVALID_PRIORITY);
    }

    if (status !== undefined && !Object.values(TASK_STATUS).includes(status)) {
        return badRequest(res, TASK_MESSAGES.INVALID_STATUS);
    }

    next();
};

export const validateUpdateTaskStatus = (req, res, next) => {
    const { status } = req.body;

    if (!status) {
        return badRequest(res, TASK_MESSAGES.STATUS_REQUIRED);
    }

    if (!Object.values(TASK_STATUS).includes(status)) {
        return badRequest(res, TASK_MESSAGES.INVALID_STATUS);
    }

    next();
};