import { useSocket } from "@/hooks/useSocket";
import { ComponentProps, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "./ui/card";
import { useAuth } from "@/hooks/useAuth";
import dayjs from "dayjs";

interface ChatPreviewProps extends ComponentProps<"li"> {
    friendUsername: string;
    roomId: string;
    friendId: string;

}

type messageProps = {
    author: USER_DTO,
    id: string,
    content: string;
    createdAt: string;
}

export function ChatPreview({ friendId, roomId, friendUsername, ...rest }: ChatPreviewProps) {
    const { usersOnline, socket } = useSocket()
    const { user } = useAuth()

    function formatDate(Date: string | Date){
        const dateFormated = dayjs(Date).format("HH[:]mm")
        return dateFormated
    }

    const [notifications, setNotifications] = useState<messageProps[]>([])

    useEffect(() => {
        socket?.on(`notification/roomId/${roomId}`, (message: messageProps) => {
            console.log("message =>", { message })
            if (message.author.id === user?.id) return
            setNotifications(state => [message, ...state])
        })

        return () => {
            socket?.off(`notification/roomId/${roomId}`)
        }

    }, [socket])

    useEffect(() => {
        socket?.on(`notificationVisualized/room/${roomId}`, (data: { roomId: string }) => {
            if (data.roomId !== roomId) return

            setNotifications([])

        })
    }, [socket])


    function checkUserOnlineStatus(userId: string) {
        const userIsOnline = usersOnline.some(user => user.userId === userId)

        return userIsOnline
    }


    return (
        <li
            {
            ...rest
            }
            key={roomId}
            title={`convesar com ${friendUsername}`}
        >
            <Link to={`/home/messages/${roomId}`}>
                <Card className="px-4 bg-gray-900 text-gray-200 py-3 relative ">
                    <div className="flex justify-between">
                        <span className="block">
                            {friendUsername}
                        </span>
                        <span className="block text-gray-300">
                            {
                                notifications.length &&  formatDate(notifications[0].createdAt)
                            }
                        </span>

                    </div>
                    <div className="flex justify-between mt-2">
                        {
                            notifications.length ? (
                                <>
                                    <span className="text-gray-300">{notifications[0].content}</span>
                                    <div className="h-6 min-w-[24px] p-1 flex justify-center items-center rounded-full bg-gray-500">
                                        <span>{notifications.length}</span>
                                    </div>
                                </>

                            )
                                : <div className="h-5">


                                </div>
                        }
                    </div>

                    <div className={`w-5 h-5 ${checkUserOnlineStatus(friendId) ? "bg-green-500" : "bg-red-400"} rounded-full -top-[10px]  absolute -right-[10px]`} />
                </Card>

            </Link>
        </li>
    )
}