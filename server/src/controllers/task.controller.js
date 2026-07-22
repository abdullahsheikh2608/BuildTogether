import { HTTP_STATUS } from "../constants/statusCodes.js";

import { TASK_MESSAGES } from "../constants/messages.js";

import {
    createTask,
    getStartupTasks,
    getMyTasks,
    updateTask,
    updateTaskStatus,
    deleteTask,
} from "../services/task.service.js";

export const createTaskController = async (req, res, next) => {

    try {

        const result = await createTask(req.body, req.user.id);

        if (result === "STARTUP_NOT_FOUND") {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: TASK_MESSAGES.STARTUP_NOT_FOUND,
            });
        }

        if (result === "FORBIDDEN") {
            return res.status(HTTP_STATUS.FORBIDDEN).json({
                success: false,
                message: TASK_MESSAGES.FORBIDDEN,
            });
        }

        if (result === "DEVELOPER_NOT_ACCEPTED") {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                success: false,
                message: TASK_MESSAGES.DEVELOPER_NOT_ACCEPTED,
            });
        }

        return res.status(HTTP_STATUS.CREATED).json({
            success: true,
            message: TASK_MESSAGES.CREATED_SUCCESSFULLY,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

export const getStartupTasksController = async (req, res, next) => {
    try {
        const { startupId } = req.params;
        const result = await getStartupTasks(startupId, req.user.id);

        if (result === "STARTUP_NOT_FOUND") {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: TASK_MESSAGES.STARTUP_NOT_FOUND,
            });
        }

        if (result === "FORBIDDEN") {
            return res.status(HTTP_STATUS.FORBIDDEN).json({
                success: false,
                message: TASK_MESSAGES.FORBIDDEN,
            });
        }

        return res.status(HTTP_STATUS.OK).json({
            success: true,
            message: TASK_MESSAGES.FETCH_SUCCESSFULLY,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

export const getMyTasksController = async (req, res, next) => {
    try {
        const tasks = await getMyTasks(req.user.id);

        return res.status(HTTP_STATUS.OK).json({
            success: true,
            message: TASK_MESSAGES.FETCH_SUCCESSFULLY,
            data: tasks,
        });
    } catch (error) {
        next(error);
    }
};

export const updateTaskController = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await updateTask(id, req.user.id, req.body);

        if (result === "TASK_NOT_FOUND") {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: TASK_MESSAGES.TASK_NOT_FOUND,
            });
        }

        if (result === "FORBIDDEN") {
            return res.status(HTTP_STATUS.FORBIDDEN).json({
                success: false,
                message: TASK_MESSAGES.FORBIDDEN,
            });
        }

        if (result === "DEVELOPER_NOT_ACCEPTED") {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                success: false,
                message: TASK_MESSAGES.DEVELOPER_NOT_ACCEPTED,
            });
        }

        if (result === "NOTHING_TO_UPDATE") {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                success: false,
                message: TASK_MESSAGES.NOTHING_TO_UPDATE,
            });
        }

        return res.status(HTTP_STATUS.OK).json({
            success: true,
            message: TASK_MESSAGES.UPDATED_SUCCESSFULLY,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

export const updateTaskStatusController = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const result = await updateTaskStatus(id, req.user.id, status);

        if (result === "TASK_NOT_FOUND") {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: TASK_MESSAGES.TASK_NOT_FOUND,
            });
        }

        if (result === "FORBIDDEN") {
            return res.status(HTTP_STATUS.FORBIDDEN).json({
                success: false,
                message: TASK_MESSAGES.FORBIDDEN,
            });
        }

        return res.status(HTTP_STATUS.OK).json({
            success: true,
            message: TASK_MESSAGES.UPDATED_SUCCESSFULLY,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteTaskController = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await deleteTask(id, req.user.id);

        if (result === "TASK_NOT_FOUND") {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: TASK_MESSAGES.TASK_NOT_FOUND,
            });
        }

        if (result === "FORBIDDEN") {
            return res.status(HTTP_STATUS.FORBIDDEN).json({
                success: false,
                message: TASK_MESSAGES.FORBIDDEN,
            });
        }

        return res.status(HTTP_STATUS.OK).json({
            success: true,
            message: TASK_MESSAGES.DELETED_SUCCESSFULLY,
        });
    } catch (error) {
        next(error);
    }
};