import { registerUser, loginUser } from "../services/auth.service.js";
import { generateToken } from "../utils/jwt.js";
import { AUTH_MESSAGES } from "../constants/messages.js";
import { HTTP_STATUS } from "../constants/statusCodes.js";
import pool from "../config/db.js";

export const register = async (req, res, next) => {
    try {
        const user = await registerUser(req.body);

        const token = generateToken(user);

        return res.status(HTTP_STATUS.CREATED).json({
            success: true,
            message: AUTH_MESSAGES.REGISTER_SUCCESS,
            data: {
                user,
                token,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const user = await loginUser(req.body);

        const token = generateToken(user);

        return res.status(HTTP_STATUS.OK).json({
            success: true,
            message: AUTH_MESSAGES.LOGIN_SUCCESS,
            data: {
                user,
                token,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const getMe = async (req, res, next) => {
    try {
        const result = await pool.query(
            `
            SELECT u.id, u.email, u.role, p.full_name, p.username
            FROM users u
            LEFT JOIN profiles p ON p.user_id = u.id
            WHERE u.id = $1
            `,
            [req.user.id]
        );

        return res.status(HTTP_STATUS.OK).json({
            success: true,
            data: result.rows[0] || req.user,
        });
    } catch (error) {
        next(error);
    }
};