import validator from "validator";

import pool from "../config/db.js";
import { HTTP_STATUS } from "../constants/statusCodes.js";
import { WORKSPACE_MESSAGES } from "../constants/messages.js";

// A "workspace" is not its own database entity — it's the collaboration
// space for a specific startup, so workspaceId === startups.id. This
// middleware is the single place that answers "is this user allowed in
// here", replacing the three near-identical founder-or-accepted-developer
// checks that used to live separately inside chat.service.js,
// task.service.js, and member.service.js.

export const validateWorkspaceId = (req, res, next) => {

    const { workspaceId } = req.params;

    if (!validator.isUUID(workspaceId, 4)) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            message: WORKSPACE_MESSAGES.INVALID_WORKSPACE_ID,
        });
    }

    next();
};

export const verifyWorkspaceMember = async (req, res, next) => {
    try {

        const { workspaceId } = req.params;
        const userId = req.user.id;

        const startupResult = await pool.query(
            `
            SELECT id, founder_id
            FROM startups
            WHERE id = $1
            `,
            [workspaceId]
        );

        if (startupResult.rows.length === 0) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: WORKSPACE_MESSAGES.WORKSPACE_NOT_FOUND,
            });
        }

        const isFounder = startupResult.rows[0].founder_id === userId;

        if (!isFounder) {

            const membershipResult = await pool.query(
                `
                SELECT id
                FROM applications
                WHERE startup_id = $1
                AND developer_id = $2
                AND status = 'accepted'
                `,
                [workspaceId, userId]
            );

            if (membershipResult.rows.length === 0) {
                return res.status(HTTP_STATUS.FORBIDDEN).json({
                    success: false,
                    message: WORKSPACE_MESSAGES.FORBIDDEN,
                });
            }
        }

        // Downstream handlers can use this instead of re-deriving it —
        // e.g. to decide whether to expose founder-only fields.
        req.workspaceRole = isFounder ? "founder" : "developer";

        next();

    } catch (error) {
        next(error);
    }
};