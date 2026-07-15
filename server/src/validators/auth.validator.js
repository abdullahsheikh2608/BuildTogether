import validator from "validator";

export const validateRegister = (req, res, next) => {
    const { email, password, role, full_name, username } = req.body;

    if (!email || !password || !role || !full_name || !username) {
        return res.status(400).json({
            success: false,
            message: "All fields are required",
        });
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json({
            success: false,
            message: "Invalid email address",
        });
    }

    if (!validator.isLength(password, { min: 8 })) {
        return res.status(400).json({
            success: false,
            message: "Password must be at least 8 characters long",
        });
    }

    if (!["founder", "developer"].includes(role)) {
        return res.status(400).json({
            success: false,
            message: "Role must be founder or developer",
        });
    }

    next();
};

