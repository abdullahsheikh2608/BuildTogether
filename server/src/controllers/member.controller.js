import { HTTP_STATUS } from "../constants/statusCodes.js";
import { MEMBER_MESSAGES } from "../constants/messages.js";

import {
    getStartupMembers as getStartupMembersService,
    getMyProjects as getMyProjectsService,
} from "../services/member.service.js";

const getStartupMembers = async (req, res) => {

    try {

        const { id } = req.params;
        const founderId = req.user.id;

        const members = await getStartupMembersService(
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

        const projects = await getMyProjectsService(
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

export const memberController = {
    getStartupMembers,
    getMyProjects,
};