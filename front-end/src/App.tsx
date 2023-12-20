import { Router } from "@/routes/index.routes";
import { AuthContextProvider } from "./context/authContext";
import { SocketContextProvider } from "./context/socketContext";
import { ChatContextProvider } from "./context/chatContext";

export function App(){
  return (
    <AuthContextProvider>
      <SocketContextProvider>
        <ChatContextProvider>
          <Router/>
        </ChatContextProvider>
      </SocketContextProvider>
    </AuthContextProvider>
  )
}