import { useEffect } from "react"
import { Card } from "./ui/card"
import { Link, Outlet } from "react-router-dom"
import { Header } from "@/components/Header"
import { useChat } from "@/hooks/useChat"
import { AppError } from "@/services/appError"
import { useSocket } from "@/hooks/useSocket"

export function DashboardMessages() {
    const { chatsPreview, fetchUserChatPreview } = useChat()
    const { usersOnline } = useSocket()


    function checkUserOnlineStatus(userId: string) {
        const userIsOnline = usersOnline.some(user => user.userId === userId)
        console.log(userId)
        return userIsOnline
    }
    
    async function fetchChatsPreview() {
        try {
            await fetchUserChatPreview()
        } catch (error) {
            console.error(error)
            const isAppError = error instanceof AppError
            const errorMessage = isAppError ? error.error : "Erro no servidor"
            window.alert(errorMessage)
        }
    }

    useEffect(() => { fetchChatsPreview() }, [])

    return (
        <div>
            <Header />
            <div className="bg-foreground min-h-screen grid grid-cols-2 ">

                <div className="p-4 overflow-auto">
                    <ul className="flex flex-col gap-4 ">

                        {
                            chatsPreview.map(chatPreview => (

                                <li
                                    key={chatPreview.chatId}
                                    title={`convesar com ${chatPreview.friend.username}`}
                                >
                                    <Link to={`/home/messages/${chatPreview.chatId}`}>
                                        <Card className="px-4 bg-gray-900 text-gray-200 py-3 relative ">
                                            <div className="flex justify-between">
                                                <span className="block">
                                                    {chatPreview.friend.username}
                                                </span>
                                                <span className="block text-gray-300">
                                                    12/11/2003
                                                </span>

                                            </div>
                                            <div className="flex justify-between mt-2">
                                                <span className="text-gray-300">Text message</span>
                                                <div className="h-6 min-w-[24px] p-1 flex justify-center items-center rounded-full bg-gray-500">
                                                    <span>9</span>
                                                </div>
                                            </div>
                                            <div className={`w-5 h-5 ${checkUserOnlineStatus(chatPreview.friend.id) ? "bg-green-500" : "bg-red-400" } rounded-full -top-[10px]  absolute -right-[10px]`}/>
                                        </Card>

                                    </Link>
                                </li>


                            ))
                        }
                    </ul>

                </div>
                <Outlet />
            </div>

        </div>
    )
}