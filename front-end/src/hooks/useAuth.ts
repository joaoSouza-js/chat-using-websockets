import { AuthContext } from "@/context/authContext";
import { useContext } from "react";

export function useAuth(){
    const context = useContext(AuthContext)
    return context
}