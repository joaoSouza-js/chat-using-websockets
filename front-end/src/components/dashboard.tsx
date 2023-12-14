import { api } from "@/services/axios"
import { useEffect, useState } from "react"
import { Card } from "./ui/card"
import { Link, Outlet } from "react-router-dom"

export function DashboardMessages() {
    const [friends, SetFriends] = useState<USER_DTO[]>([])

    async function fetchFriends() {
        try {
            const { data } = await api.get<USER_DTO[]>("/user")
            SetFriends(data)
        } catch (error) {

        }
    }

    useEffect(() => { fetchFriends() }, [])

    return (

        <div className="bg-foreground min-h-screen grid grid-cols-2 ">
            <div className="p-4 overflow-auto">
                <ul className="flex flex-col gap-4 ">

                    {
                        friends.map(friend => (


                            <li 
                                key={friend.id}
                                title={`convesar com ${friend.username}`}
                            >
                                <Link to={`/home/messages/${friend.id}`}>
                                    <Card className="px-2 bg-gray-900 text-gray-200 py-2 ">
                                        <span>{friend.email}</span>
                                        <span className="block">
                                            {friend.username}
                                        </span>
                                    </Card>

                                </Link>
                            </li>


                        ))
                    }
                </ul>

            </div>
            <Outlet />
        </div>
    )
}