import { workspaceService } from "../services/workspace.service.js";
import { HTTP_STATUS } from "../constants/statusCodes.js";
import { WORKSPACE_MESSAGES } from "../constants/messages.js";

const SENTINEL_RESPONSES = {
    WORKSPACE_NOT_FOUND: {
        status: HTTP_STATUS.NOT_FOUND,
        message: WORKSPACE_MESSAGES.WORKSPACE_NOT_FOUND,
    },
    STARTUP_NOT_FOUND: {
        status: HTTP_STATUS.NOT_FOUND,
        message: WORKSPACE_MESSAGES.WORKSPACE_NOT_FOUND,
    },
    FORBIDDEN: {
        status: HTTP_STATUS.FORBIDDEN,
        message: WORKSPACE_MESSAGES.FORBIDDEN,
    },
};

// verifyWorkspaceMember has already run before every handler below, so
// these sentinel strings are only a defense-in-depth fallback (e.g. a
// membership change landing mid-request) — not the normal path.
function handleSentinel(result, res) {
    const match = SENTINEL_RESPONSES[result];

    if (!match) return false;

    res.status(match.status).json({
        success: false,
        message: match.message,
    });

    return true;
}

const getOverview = async (req, res, next) => {
    try {
        const { workspaceId } = req.params;

        const overview = await workspaceService.getOverview(
            workspaceId,
            req.user.id
        );

        if (handleSentinel(overview, res)) return;

        return res.status(HTTP_STATUS.OK).json({
            success: true,
            message: WORKSPACE_MESSAGES.OVERVIEW_FETCHED_SUCCESSFULLY,
            data: overview,
        });

    } catch (error) {
        next(error);
    }
};

const getMembers = async (req, res, next) => {
    try {
        const { workspaceId } = req.params;
        const { search = "" } = req.query;

        const members = await workspaceService.getMembers(
            workspaceId,
            req.user.id,
            search
        );

        if (handleSentinel(members, res)) return;

        return res.status(HTTP_STATUS.OK).json({
            success: true,
            message: WORKSPACE_MESSAGES.MEMBERS_FETCHED_SUCCESSFULLY,
            data: members,
        });

    } catch (error) {
        next(error);
    }
};

const getTasks = async (req, res, next) => {
    try {
        const { workspaceId } = req.params;
        const { search = "", page, limit } = req.query;

        const tasks = await workspaceService.getTasks(
            workspaceId,
            req.user.id,
            { search, page, limit }
        );

        if (handleSentinel(tasks, res)) return;

        return res.status(HTTP_STATUS.OK).json({
            success: true,
            message: WORKSPACE_MESSAGES.TASKS_FETCHED_SUCCESSFULLY,
            data: tasks,
        });

    } catch (error) {
        next(error);
    }
};

const getMessages = async (req, res, next) => {
    try {
        const { workspaceId } = req.params;
        const { page, limit } = req.query;

        const messages = await workspaceService.getMessages(
            workspaceId,
            req.user.id,
            { page, limit }
        );

        if (handleSentinel(messages, res)) return;

        return res.status(HTTP_STATUS.OK).json({
            success: true,
            message: WORKSPACE_MESSAGES.MESSAGES_FETCHED_SUCCESSFULLY,
            data: messages,
        });

    } catch (error) {
        next(error);
    }
};

const getDetails = async (req, res, next) => {
    try {
        const { workspaceId } = req.params;

        const details = await workspaceService.getDetails(workspaceId);

        if (details === null) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: WORKSPACE_MESSAGES.WORKSPACE_NOT_FOUND,
            });
        }

        return res.status(HTTP_STATUS.OK).json({
            success: true,
            message: WORKSPACE_MESSAGES.DETAILS_FETCHED_SUCCESSFULLY,
            data: details,
        });

    } catch (error) {
        next(error);
    }
};

export const workspaceController = {
    getOverview,
    getMembers,
    getTasks,
    getMessages,
    getDetails,
};