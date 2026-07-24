import { HTTP_STATUS } from "../constants/statusCodes.js";
import { PROJECT_MESSAGES } from "../constants/messages.js";
import projectService from "../services/project.service.js";

const projectController = {

    getFounderProjects: async (req, res, next) => {
        try {

            const projects = await projectService.getFounderProjects(req.user.id);

            return res.status(HTTP_STATUS.OK).json({
                success: true,
                message: PROJECT_MESSAGES.FETCH_SUCCESSFULLY,
                data: projects,
            });

        } catch (error) {
            next(error);
        }
    },

    getDeveloperProjects: async (req, res, next) => {
        try {

            const projects = await projectService.getDeveloperProjects(req.user.id);

            return res.status(HTTP_STATUS.OK).json({
                success: true,
                message: PROJECT_MESSAGES.FETCH_SUCCESSFULLY,
                data: projects,
            });

        } catch (error) {
            next(error);
        }
    },

    getProjectById: async (req, res, next) => {
        try {

            const { id } = req.params;

            const result = await projectService.getProjectById(
                id,
                req.user.id
            );

            if (result === "PROJECT_NOT_FOUND") {
                return res.status(HTTP_STATUS.NOT_FOUND).json({
                    success: false,
                    message: PROJECT_MESSAGES.PROJECT_NOT_FOUND,
                });
            }

            if (result === "FORBIDDEN") {
                return res.status(HTTP_STATUS.FORBIDDEN).json({
                    success: false,
                    message: PROJECT_MESSAGES.FORBIDDEN,
                });
            }

            return res.status(HTTP_STATUS.OK).json({
                success: true,
                message: PROJECT_MESSAGES.FETCH_SUCCESSFULLY,
                data: result,
            });

        } catch (error) {
            next(error);
        }
    },

};

export default projectController;