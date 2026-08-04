import { aiService } from "../services/ai.service.js";

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

export {
    health,
};