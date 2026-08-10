import { Router } from "express";

import {
    register,
    login,
    forgotPassword,
    resetPassword,
    getMe,
} from "../controllers/auth.controller.js";

import {
    authenticate,
} from "../middlewares/auth.middleware.js";

import {
    validateRegister,
    validateLogin,
    validateForgotPassword,
    validateResetPassword,
} from "../validators/auth.validator.js";

const router = Router();

router.post("/register", validateRegister, register);

router.post("/login", validateLogin, login);

router.post("/forgot-password", validateForgotPassword, forgotPassword);

router.post("/reset-password", validateResetPassword, resetPassword);

router.get(
    "/me",
    authenticate,
    getMe
);

export default router;