import { useAuth } from "@/hooks/useAuth"
import { Button } from "./ui/button"
import { Link, useNavigate } from "react-router-dom"

export function Header() {
    const { user, logOut } = useAuth()
    const navigate = useNavigate()

    function handleLogOut() {
        try {
            logOut()
            navigate("/")
        } catch (error) {

        }

    }
    return (
        <header className="flex flex-row w-full bg-gray-800 shadow-md border-b border-b-white   ">
            <div className="px-4 py-2 flex gap-6  items-center">
                <span className="text-white block  ">
                    {user?.username}
                </span>
                <div className="flex-1 gap-3 text-gray-300 flex r items-center">
                    <Link to={"/home"}>
                        Inicio
                    </Link>
                    <Link to={"/searchUser"}>
                        Adicionar amigo
                    </Link>
                </div>

            </div>

            
            <div className="flex flex-1 px-4 py-2  justify-end ">
                <Button
                    variant={"destructive"}
                    className="text-white text-sm "
                    type="button"
                    onClick={handleLogOut}
                >
                    sair
                </Button>
            </div>
        </header>
    )
}