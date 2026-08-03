import { chatService } from "../services/chat.service.js";

const getChat = async (req, res, next) => {
    try {

        const { startupId } = req.params;

        const chat = await chatService.getOrCreateChat(startupId);

        res.status(200).json({
            success: true,
            message: "Chat fetched successfully.",
            data: chat,
        });

    } catch (error) {
        next(error);
    }
};

const getMessages = async (req, res, next) => {
    try {

        const { startupId } = req.params;

        const messages = await chatService.getMessages(
            startupId,
            req.user.id
        );

        res.status(200).json({
            success: true,
            message: "Messages fetched successfully.",
            data: messages,
        });

    } catch (error) {
        next(error);
    }
};

const sendMessage = async (req, res, next) => {
    try {

        const { startupId } = req.params;
        const { message } = req.body;

        const newMessage = await chatService.sendMessage(
            startupId,
            req.user.id,
            message
        );

        res.status(201).json({
            success: true,
            message: "Message sent successfully.",
            data: newMessage,
        });

    } catch (error) {
        next(error);
    }
};

export {
    getChat,
    getMessages,
    sendMessage,
};