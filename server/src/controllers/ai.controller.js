import { aiService } from "../services/ai.service.js";
import { AI_MESSAGES } from "../constants/ai.constants.js";
import { HTTP_STATUS } from "../constants/statusCodes.js";

const health = async (req, res, next) => {
    try {

        const status = aiService.checkHealth();

        res.status(200).json({
            success: true,
            message: status.message,
        });

    } catch (error) {
        next(error);
    }
};

const summarizeProject = async (req, res, next) => {
    try {

        const { startupId } = req.params;
        const requesterId = req.user.id;

        const result = await aiService.summarizeProject(
            startupId,
            requesterId
        );

        if (result === "STARTUP_NOT_FOUND") {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: AI_MESSAGES.STARTUP_NOT_FOUND,
            });
        }

        if (result === "FORBIDDEN") {
            return res.status(HTTP_STATUS.FORBIDDEN).json({
                success: false,
                message: AI_MESSAGES.FORBIDDEN,
            });
        }

        res.status(HTTP_STATUS.OK).json({
            success: true,
            message: AI_MESSAGES.SUMMARY_GENERATED,
            data: result,
        });

    } catch (error) {
        next(error);
    }
};

export {
    health,
    summarizeProject,
};