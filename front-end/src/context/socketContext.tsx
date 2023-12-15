import { ReactNode, createContext, useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";

type createContextProps = {
    socket: Socket | null
}

export const SocketContext = createContext({} as createContextProps)

type SocketContextProviderProps = {
    children: ReactNode
}

const URL = "http://localhost:3333"


export function SocketContextProvider({ children }: SocketContextProviderProps) {
    const [socket, setSocket] = useState<Socket | null>(null);

    function connectSocket() {
      
        const SocketConnection = io(URL, {
          
        });
        setSocket(SocketConnection)
      }

    useEffect(() => {
        const newSocket = io(URL)
        setSocket(newSocket);
        
        return () => {
            newSocket.disconnect();
        };
    }, []);


    return (
        <SocketContext.Provider value={{
            socket
        }}>
            {children}
        </SocketContext.Provider>
    );
}