import {
    createApplication as createApplicationService,
    getMyApplications as getMyApplicationsService,
    getStartupApplications as getStartupApplicationsService,
    updateApplicationStatus as updateApplicationStatusService,
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
export const getMyApplications = async (req, res, next) => {
    try {
        const applications = await getMyApplicationsService(req.user.id);

        return res.status(200).json({
            success: true,
            message: APPLICATION_MESSAGES.FETCH_SUCCESSFULLY,
            data: applications,
        });
    } catch (error) {
        next(error);
    }
};
export const getStartupApplications = async (req, res, next) => {
    try {

        const { startupId } = req.params;

        const applications = await getStartupApplicationsService(
            startupId,
            req.user.id
        );

        if (applications === "STARTUP_NOT_FOUND") {
            return res.status(404).json({
                success: false,
                message: APPLICATION_MESSAGES.STARTUP_NOT_FOUND,
            });
        }

        if (applications === "FORBIDDEN") {
            return res.status(403).json({
                success: false,
                message: APPLICATION_MESSAGES.FORBIDDEN_STARTUP_ACCESS,
            });
        }

        if (applications.length === 0) {
            return res.status(404).json({
                success: false,
                message: APPLICATION_MESSAGES.NO_APPLICATIONS_FOUND,
            });
        }

        return res.status(200).json({
            success: true,
            message: APPLICATION_MESSAGES.FETCH_SUCCESSFULLY,
            data: applications,
        });

    } catch (error) {
        next(error);
    }
};
export const updateApplicationStatus = async (req, res, next) => {
    try {

        const { id } = req.params;
        const { status } = req.body;

        const application = await updateApplicationStatusService(
            id,
            req.user.id,
            status
        );

        if (application === "APPLICATION_NOT_FOUND") {
            return res.status(404).json({
                success: false,
                message: APPLICATION_MESSAGES.APPLICATION_NOT_FOUND,
            });
        }

        if (application === "FORBIDDEN") {
            return res.status(403).json({
                success: false,
                message: APPLICATION_MESSAGES.FORBIDDEN_STARTUP_ACCESS,
            });
        }

        if (application === "ALREADY_UPDATED") {
            return res.status(409).json({
                success: false,
                message: APPLICATION_MESSAGES.ALREADY_UPDATED,
            });
        }

        return res.status(200).json({
            success: true,
            message: APPLICATION_MESSAGES.UPDATED_SUCCESSFULLY,
            data: application,
        });

    } catch (error) {
        next(error);
    }
};