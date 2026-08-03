import { createContext, useContext, useEffect } from "react";
import { socket } from "../socket/socket";
import { useAuth } from "../hooks/useAuth";

const SocketContext = createContext(socket);

export const SocketProvider = ({ children }) => {
    const { user } = useAuth();

    useEffect(() => {
        const token = localStorage.getItem("access_token");

        if (!user || !token) {
            socket.disconnect();
            return;
        }

        socket.auth = {
            token,
        };

        socket.connect();

        return () => {
            socket.disconnect();
        };
    }, [user]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);