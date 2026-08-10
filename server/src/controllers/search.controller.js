import { HTTP_STATUS } from "../constants/statusCodes.js";
import { SEARCH_MESSAGES } from "../constants/messages.js";
import searchService from "../services/search.service.js";

const searchController = {

    globalSearch: async (req, res, next) => {
        try {

            const query = (req.query.q || "").trim();

            if (!query) {
                return res.status(HTTP_STATUS.OK).json({
                    success: true,
                    message: SEARCH_MESSAGES.FETCH_SUCCESSFULLY,
                    data: [],
                });
            }

            const results = await searchService.globalSearch(
                req.user.id,
                req.user.role,
                query
            );

            return res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SEARCH_MESSAGES.FETCH_SUCCESSFULLY,
                data: results,
            });

        } catch (error) {
            next(error);
        }
    },

};

export default searchController;