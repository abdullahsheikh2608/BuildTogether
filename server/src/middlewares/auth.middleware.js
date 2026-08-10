import jwt from "jsonwebtoken";
import { AUTH_MESSAGES } from "../constants/messages.js";

export const authenticate = (req, res, next) => {

    const authHeader = req.headers.authorization;
    let token = null;

    if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
    } else if (req.query && req.query.token) {
        token = req.query.token;
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: AUTH_MESSAGES.TOKEN_REQUIRED,
        });
    }

    try {

        const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET
);

req.user = {
    id: decoded.id,
    email: decoded.email,
    role: decoded.role,
};

next();

    } catch (error) {

        return res.status(401).json({
            success: false,
            message: AUTH_MESSAGES.INVALID_TOKEN,
        });

    }
};