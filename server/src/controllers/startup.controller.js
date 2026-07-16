import {
    createStartup as createStartupService,
    getAllStartups as getAllStartupsService,
} from "../services/startup.service.js";
import { STARTUP_MESSAGES } from "../constants/messages.js";

export const createStartup = async (req, res, next) => {
    try {
        const startup = await createStartupService(req.body, req.user.id);

        return res.status(201).json({
            success: true,
            message: STARTUP_MESSAGES.CREATED_SUCCESSFULLY,
            data: startup,
        });
    } catch (error) {
        next(error);
    }
};
export const getAllStartups = async (req, res, next) => {
    try {

        const startups = await getAllStartupsService();

        return res.status(200).json({
            success: true,
            message: STARTUP_MESSAGES.FETCH_SUCCESSFULLY,
            data: startups,
        });

    } catch (error) {
        next(error);
    }
};