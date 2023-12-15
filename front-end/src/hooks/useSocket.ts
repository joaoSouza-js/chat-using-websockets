import { SocketContext } from "@/context/socketContext";
import { useContext } from "react";

export function useSocket(){
    const context = useContext(SocketContext)
    return context
}