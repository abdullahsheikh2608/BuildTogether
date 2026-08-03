import jwt from "jsonwebtoken";

let io = null;

export const initializeSocket = (socketServer) => {
    io = socketServer;

    io.use((socket, next) => {
        try {
            const token = socket.handshake.auth?.token;

            if (!token) {
                return next(new Error("Authentication required"));
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            socket.user = decoded;

            next();
        } catch (error) {
            next(new Error("Invalid token"));
        }
    });

        io.on("connection", (socket) => {

            socket.on("join_startup", (startupId) => {
                socket.join(startupId);
            });

        });
};

export const getIO = () => {
    if (!io) {
        throw new Error("Socket.IO has not been initialized.");
    }

    return io;
};