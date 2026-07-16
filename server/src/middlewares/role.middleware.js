const FORBIDDEN_MESSAGE =
    "You are not authorized to perform this action";

export const authorizeRole = (...roles) => {

    return (req, res, next) => {

        if (!roles.includes(req.user.role)) {

            return res.status(403).json({
                success: false,
                message: FORBIDDEN_MESSAGE,
            });

        }

        next();

    };

};