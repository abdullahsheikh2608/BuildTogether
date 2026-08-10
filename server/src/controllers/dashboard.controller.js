import { getDashboardAnalytics as getDashboardAnalyticsService } from "../services/dashboard.service.js";

import { DASHBOARD_MESSAGES } from "../constants/messages.js";

export const getDashboardAnalytics = async (req, res, next) => {
    try {

        const startupId = req.query.startupId || null;
        const analytics = await getDashboardAnalyticsService(req.user.id, startupId);

        return res.status(200).json({
            success: true,
            message: DASHBOARD_MESSAGES.FETCH_SUCCESSFULLY,
            data: analytics,
        });

    } catch (error) {
        next(error);
    }
};