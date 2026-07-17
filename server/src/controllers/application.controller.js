import {
    createApplication as createApplicationService,
} from "../services/application.service.js";

import {
    APPLICATION_MESSAGES,
} from "../constants/messages.js";

export const createApplication = async (req, res, next) => {
    try {

        const application = await createApplicationService(
            req.body,
            req.user.id
        );

        if (application === "STARTUP_NOT_FOUND") {
            return res.status(404).json({
                success: false,
                message: APPLICATION_MESSAGES.STARTUP_NOT_FOUND,
            });
        }

        if (application === "ALREADY_APPLIED") {
            return res.status(409).json({
                success: false,
                message: APPLICATION_MESSAGES.ALREADY_APPLIED,
            });
        }

        return res.status(201).json({
            success: true,
            message: APPLICATION_MESSAGES.APPLICATION_SUBMITTED,
            data: application,
        });

    } catch (error) {
        next(error);
    }
};