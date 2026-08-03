import { useEffect } from "react";
import { socket } from "../socket/socket";
import { useAuth } from "./useAuth";

export const useSocket = () => {
    const { user } = useAuth();

    useEffect(() => {
        if (!user) return;

        socket.connect();

        return () => {
            socket.disconnect();
        };
    }, [user]);

    return socket;
};