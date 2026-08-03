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

            if (process.env.NODE_ENV !== "production") {
                console.log(`🟢 Socket connected: ${socket.user.id}`);
            }

            socket.on("join_startup", (startupId) => {
                socket.join(startupId);

                if (process.env.NODE_ENV !== "production") {
                    console.log(
                        `Socket ${socket.user.id} joined startup ${startupId}`
                    );
                }
            });

            socket.on("disconnect", () => {
                if (process.env.NODE_ENV !== "production") {
                    console.log(`🔴 Socket disconnected: ${socket.user.id}`);
                }
            });

        });
};

export const getIO = () => {
    if (!io) {
        throw new Error("Socket.IO has not been initialized.");
    }

    return io;
};