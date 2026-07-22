import { updateUserProfile } from "../services/profile.service.js";
import { HTTP_STATUS } from "../constants/statusCodes.js";

export const updateProfile = async (req, res, next) => {
    try {
        const updatedUser = await updateUserProfile(req.user.id, req.body);

        return res.status(HTTP_STATUS.OK).json({
            success: true,
            message: "Profile updated successfully",
            data: updatedUser,
        });
    } catch (error) {
        next(error);
    }
};
