import { ChatContext } from "@/context/chatContext";
import { useContext } from "react";

export function useChat(){
    const context = useContext(ChatContext)
    return context
}