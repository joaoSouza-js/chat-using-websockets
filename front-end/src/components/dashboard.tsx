import { useEffect } from "react"
import { Card } from "./ui/card"
import { Link, Outlet } from "react-router-dom"
import { Header } from "@/components/Header"
import { useChat } from "@/hooks/useChat"
import { AppError } from "@/services/appError"
import { useSocket } from "@/hooks/useSocket"
import { ChatPreview } from "./ChatPreview"

export function DashboardMessages() {
    const { chatsPreview, fetchUserChatPreview } = useChat()
    const { usersOnline} = useSocket()


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

                               <ChatPreview
                                    key={chatPreview.chatId}
                                    roomId={chatPreview.chatId}
                                    friendId={chatPreview.friend.id}
                                    friendUsername={chatPreview.friend.username}
                               />


                            ))
                        }
                    </ul>

                </div>
                <Outlet />
            </div>

        </div>
    )
}