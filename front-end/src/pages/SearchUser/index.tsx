import { Header } from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useChat } from "@/hooks/useChat"
import { AppError } from "@/services/appError"
import { ChangeEvent, useEffect, useState } from "react"
import { Search, Plus } from 'lucide-react';
import { Card } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Toaster     } from "@/components/ui/toaster"

type AddNewFriendProps = {
    friendId: string,
    userName: string
}

export function SearchUser() {
    const { usesAvailableForNewConnection, fetchUserAvailableForNewConnections, createNewRoom } = useChat()
    const [usernameLocalSearch, setUsernameLocalSearch] = useState("")
    const {toast} = useToast()
    const usesAvailableForNewConnectionFiltered = usesAvailableForNewConnection.filter(user => {
        return user.username.includes(usernameLocalSearch)
    })

    function handleChangeSearch(event: ChangeEvent<HTMLInputElement>) {
        setUsernameLocalSearch(event.target.value)
    }

    async function handleFetchUserAvailableForNewConnections() {
        try {
            fetchUserAvailableForNewConnections()
            setUsernameLocalSearch("")
        } catch (error) {
            const isAppError = error instanceof AppError
            const errorMessage = isAppError ? error.error : "Erro no servidor"
            toast({
                title: errorMessage,
                variant: "destructive"
            })
            setUsernameLocalSearch("")
        }
    }

    async function handleAddNewFriend({ friendId, userName }: AddNewFriendProps) {
        try {
            await createNewRoom(friendId)
            toast({
                title: `agora voce pode converar com ${userName}`,
                className: "bg-gray-900 text-gray-200 "
            })
          
        } catch (error) {
            const isAppError = error instanceof AppError
            const errorMessage = isAppError ? error.error : "Erro no servidor"
            window.alert(errorMessage)
        }
    }


    useEffect(() => {
        handleFetchUserAvailableForNewConnections()
    }, [])

    return (
        <div>
            <Header />
            <div className="max-w-[800px] px-2 mt-5 mx-auto pb-10">
                <form className="flex gap-3">
                    <Input
                        className="text-gray-300"
                        onChange={handleChangeSearch}
                        placeholder="Digite o nome de usuário"
                    />
                    <Button className="flex gap-1 items-center">
                        <Search color="white" size={16} />
                        <span >
                            pequisar
                        </span>
                    </Button>
                </form>

                <ul className="mt-4">

                    <li className="flex flex-col gap-4  ">
                        {
                            usesAvailableForNewConnectionFiltered.map(user => (
                                <Card
                                    key={user.id}
                                    className="px-2 bg-gray-900 text-gray-200 py-2 flex justify-between items-center"
                                >
                                    <div>
                                        <span>
                                            {user.username}
                                        </span>

                                    </div>
                                    <Button
                                        onClick={() => handleAddNewFriend({
                                            friendId: user.id,
                                            userName: user.username
                                        })}
                                        className="flex gap-1 items-center px-2 text-sm"
                                    >
                                        <Plus color="white" size={16} />
                                        Add
                                    </Button>
                                </Card>

                            ))
                        }
                    </li>
                </ul>

            </div>
            <Toaster /> 
        </div>
    )
}