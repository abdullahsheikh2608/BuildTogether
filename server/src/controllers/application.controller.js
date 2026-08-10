import {
    createApplication as createApplicationService,
    updateApplication as updateApplicationService,
    getApplicationById as getApplicationByIdService,
    getApplicationResumeFile as getApplicationResumeFileService,
    getMyApplications as getMyApplicationsService,
    getStartupApplications as getStartupApplicationsService,
    updateApplicationStatus as updateApplicationStatusService,
} from "../services/application.service.js";

import { APPLICATION_MESSAGES } from "../constants/messages.js";
import path from "path";

export const createApplication = async (req, res, next) => {
    try {
        const application = await createApplicationService(
            req.body,
            req.user.id,
            req.file
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

export const updateApplication = async (req, res, next) => {
    try {
        const { id } = req.params;
        const application = await updateApplicationService(
            id,
            req.user.id,
            req.body,
            req.file
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
                message: "You are not authorized to edit this application.",
            });
        }

        if (application === "CANNOT_EDIT_NON_PENDING") {
            return res.status(400).json({
                success: false,
                message: "Only pending applications can be edited.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Application updated successfully.",
            data: application,
        });
    } catch (error) {
        next(error);
    }
};

export const getApplicationById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const application = await getApplicationByIdService(id, req.user.id);

        if (application === "APPLICATION_NOT_FOUND") {
            return res.status(404).json({
                success: false,
                message: APPLICATION_MESSAGES.APPLICATION_NOT_FOUND,
            });
        }

        if (application === "FORBIDDEN") {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to view this application.",
            });
        }

        return res.status(200).json({
            success: true,
            message: APPLICATION_MESSAGES.FETCH_SUCCESSFULLY,
            data: application,
        });
    } catch (error) {
        next(error);
    }
};

export const downloadApplicationResume = async (req, res, next) => {
    try {
        const { id } = req.params;
        const fileData = await getApplicationResumeFileService(id, req.user.id);

        if (fileData === "APPLICATION_NOT_FOUND") {
            return res.status(404).json({
                success: false,
                message: APPLICATION_MESSAGES.APPLICATION_NOT_FOUND,
            });
        }

        if (fileData === "FORBIDDEN") {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to access this resume.",
            });
        }

        if (fileData === "FILE_NOT_FOUND") {
            return res.status(404).json({
                success: false,
                message: "Resume file not found.",
            });
        }

        const ext = path.extname(fileData.filePath).toLowerCase();
        if (ext === ".pdf") {
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", `inline; filename="${fileData.fileName}"`);
            return res.sendFile(path.resolve(fileData.filePath));
        }

        return res.download(path.resolve(fileData.filePath), fileData.fileName);
    } catch (error) {
        next(error);
    }
};

export const getMyApplications = async (req, res, next) => {
    try {
        const {
            search,
            status,
            page,
            limit,
            sortBy,
            order,
        } = req.query;

        const applications = await getMyApplicationsService(
            req.user.id,
            search,
            status,
            page,
            limit,
            sortBy,
            order
        );

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
        const {
            search,
            status,
            page,
            limit,
            sortBy,
            order,
        } = req.query;

        const applications = await getStartupApplicationsService(
            startupId,
            req.user.id,
            search,
            status,
            page,
            limit,
            sortBy,
            order
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