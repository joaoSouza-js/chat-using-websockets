import { Router } from "@/routes/index.routes";
import { AuthContextProvider } from "./context/authContext";

export function App(){
  return (
    <AuthContextProvider>
      <Router/>
    </AuthContextProvider>
  )
}