import express from "express";
import {
    getChat,
    getMessages,
    sendMessage,
} from "../controllers/chat.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(authenticate);

router.get("/:startupId", getChat);

router.get("/:startupId/messages", getMessages);

router.post("/:startupId/messages", sendMessage);

export default router;