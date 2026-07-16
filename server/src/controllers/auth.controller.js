import { registerUser } from "../services/auth.service.js";
import { generateToken } from "../utils/jwt.js";

export const register = async (req, res, next) => {
    try {
        const user = await registerUser(req.body);

        const token = generateToken(user);

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
                user,
                token,
            },
        });
    } catch (error) {
        next(error);
    }
};