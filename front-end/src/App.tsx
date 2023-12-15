import { Router } from "@/routes/index.routes";
import { AuthContextProvider } from "./context/authContext";
import { SocketContextProvider } from "./context/socketContext";

export function App(){
  return (
    <AuthContextProvider>
      <SocketContextProvider>

        <Router/>
      </SocketContextProvider>
    </AuthContextProvider>
  )
}