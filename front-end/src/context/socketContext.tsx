import { GET_AUTH_TOKENS_IN_LOCAL_STORAGE } from "@/Storage/authTokens";
import { useAuth } from "@/hooks/useAuth";
import { ReactNode, createContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Socket, io } from "socket.io-client";

type createContextProps = {
    socket: Socket | null
    usersOnline: USER_ONLINE_DTO[]
}
type SocketContextProviderProps = {
    children: ReactNode
}
type paramsProps = {
    chatId: string
}

export const SocketContext = createContext({} as createContextProps)

const URL = "http://localhost:3333"

export function SocketContextProvider({ children }: SocketContextProviderProps) {
    const { user } = useAuth()
    const [socket, setSocket] = useState<Socket | null>(null);
    const [usersOnline, setUsersOnline] = useState<USER_ONLINE_DTO[]>([])

    function connectSocket() {
        const authTokens = GET_AUTH_TOKENS_IN_LOCAL_STORAGE()
        if (!authTokens?.token) return

        const SocketConnection = io(URL, {
            query: {
                token: authTokens.token,
            },
        });

        setSocket(SocketConnection)
    }

    useEffect(() => {
        connectSocket()

        return () => {
            socket?.disconnect()
        }
    }, [user]);

    useEffect(() => {

        if (!socket) return
        socket.on("usersOnline", (data: USER_ONLINE_DTO[]) => {
            console.log(data)
            setUsersOnline(data)
        })

        return () => {
            socket.off("usersOnline")
        }

    }, [socket])
 
    return (
        <SocketContext.Provider value={{
            socket,
            usersOnline,
        }}>
            {children}
        </SocketContext.Provider>
    );
}