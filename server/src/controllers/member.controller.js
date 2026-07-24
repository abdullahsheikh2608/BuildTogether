import { HTTP_STATUS } from "../constants/statusCodes.js";
import { MEMBER_MESSAGES } from "../constants/messages.js";

import { memberService } from "../services/member.service.js";

const getStartupMembers = async (req, res) => {

    try {

        const { id } = req.params;
        const founderId = req.user.id;

        const members = await memberService.getStartupMembers(
            id,
            founderId
        );

        if (members === "STARTUP_NOT_FOUND") {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: MEMBER_MESSAGES.STARTUP_NOT_FOUND,
            });
        }

        if (members === "FORBIDDEN") {
            return res.status(HTTP_STATUS.FORBIDDEN).json({
                success: false,
                message: MEMBER_MESSAGES.FORBIDDEN,
            });
        }

        if (members.length === 0) {
            return res.status(HTTP_STATUS.OK).json({
                success: true,
                message: MEMBER_MESSAGES.NO_MEMBERS_FOUND,
                data: [],
            });
        }

        return res.status(HTTP_STATUS.OK).json({
            success: true,
            message: MEMBER_MESSAGES.FETCH_SUCCESSFULLY,
            data: members,
        });

    } catch (error) {

        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message,
        });

    }

};

const getMyProjects = async (req, res) => {

    try {

        const developerId = req.user.id;

        const projects = await memberService.getMyProjects(
            developerId
        );

        if (projects.length === 0) {
            return res.status(HTTP_STATUS.OK).json({
                success: true,
                message: MEMBER_MESSAGES.NO_PROJECTS_FOUND,
                data: [],
            });
        }

        return res.status(HTTP_STATUS.OK).json({
            success: true,
            message: MEMBER_MESSAGES.PROJECTS_FETCHED_SUCCESSFULLY,
            data: projects,
        });

    } catch (error) {

        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message,
        });

    }

};

const removeProjectMember = async (req, res) => {

    try {

        const { id, developerId } = req.params;
        const founderId = req.user.id;

        const result = await memberService.removeProjectMember(
            id,
            developerId,
            founderId
        );

        if (result === "STARTUP_NOT_FOUND") {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: MEMBER_MESSAGES.STARTUP_NOT_FOUND,
            });
        }

        if (result === "FORBIDDEN") {
            return res.status(HTTP_STATUS.FORBIDDEN).json({
                success: false,
                message: MEMBER_MESSAGES.FORBIDDEN,
            });
        }

        if (result === "DEVELOPER_NOT_FOUND") {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: MEMBER_MESSAGES.DEVELOPER_NOT_FOUND,
            });
        }

        return res.status(HTTP_STATUS.OK).json({
            success: true,
            message: MEMBER_MESSAGES.MEMBER_REMOVED_SUCCESSFULLY,
        });

    } catch (error) {

        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message,
        });

    }

};

export const memberController = {
    getStartupMembers,
    getMyProjects,
    removeProjectMember,
};