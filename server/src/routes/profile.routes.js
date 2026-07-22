import { Router } from "express";

import { updateProfile } from "../controllers/profile.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { validateProfileUpdate } from "../validators/auth.validator.js";

const router = Router();

router.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Profile Routes Working",
    });
});

router.put("/me", authenticate, validateProfileUpdate, updateProfile);

export default router;