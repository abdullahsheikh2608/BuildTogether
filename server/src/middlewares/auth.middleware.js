import jwt from "jsonwebtoken";
import { AUTH_MESSAGES } from "../constants/messages.js";

export const authenticate = (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: TOKEN_REQUIRED_MESSAGE,
        });
    }

    const token = authHeader.split(" ")[1];

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
            message: INVALID_TOKEN_MESSAGE,
        });

    }
};