import { Router } from "express";

import { workspaceController } from "../controllers/workspace.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";
import {
    validateWorkspaceId,
    verifyWorkspaceMember,
} from "../middlewares/workspace.middleware.js";

const router = Router();

router.use(authenticate);

// Applied once here rather than per-route, so any workspace sub-route
// added later inherits the membership check automatically instead of
// relying on someone remembering to add it.
router.use(
    "/:workspaceId",
    validateWorkspaceId,
    verifyWorkspaceMember
);

// Initial paint of the Workspace screen — one call instead of four.
router.get("/:workspaceId/overview", workspaceController.getOverview);

// Dedicated endpoints for each section, used once the person opens it.
router.get("/:workspaceId/members", workspaceController.getMembers);
router.get("/:workspaceId/tasks", workspaceController.getTasks);
router.get("/:workspaceId/messages", workspaceController.getMessages);
router.get("/:workspaceId/details", workspaceController.getDetails);

export default router;