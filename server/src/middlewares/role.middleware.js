import { AUTH_MESSAGES } from "../constants/messages.js";
export const authorizeRole = (...roles) => {

    return (req, res, next) => {

        if (!roles.includes(req.user.role)) {

            return res.status(403).json({
                success: false,
                message: AUTH_MESSAGES.FORBIDDEN,
            });

        }

        next();

    };

};