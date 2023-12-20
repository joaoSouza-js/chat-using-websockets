
import { api } from "@/services/axios"
import { ReactNode, createContext, useState } from "react"


type ChatPreview = {
    chatId: string;
    friend: USER_DTO;
};

type ChatContextProps = {
    chatsPreview: ChatPreview[],
    fetchUserChatPreview: () => Promise<void>,
    createNewRoom: (friendId: string) => Promise<void>,
    usesAvailableForNewConnection: USER_DTO[],
    fetchUserAvailableForNewConnections: () => Promise<void>
}

interface ChatContextProviderProps {
    children: ReactNode,
}

export const ChatContext = createContext({} as ChatContextProps)

export function ChatContextProvider({ children }: ChatContextProviderProps) {
    const [chatsPreview, setChatsPreview] = useState<ChatPreview[]>([])
    const [usesAvailableForNewConnection, setUsesAvailableForNewConnection] = useState<USER_DTO[]>([])


    async function fetchUserChatPreview() {
        try {
            const { data } = await api<ChatPreview[]>('/rooms')
            setChatsPreview(data)
        } catch (error) {
            throw error
        }
    }

    async function createNewRoom(friendId: string) {
        await api.post('/rooms', {
            friendId,
        })
        const usesAvailableForNewConnectionWithoutOneConnection = usesAvailableForNewConnection.filter(user =>{
            if(user.id !== friendId) return true
        })

        setUsesAvailableForNewConnection(usesAvailableForNewConnectionWithoutOneConnection)
    }

    async function fetchUserAvailableForNewConnections() {
        try {

            const  response  =  await api<USER_DTO[]>("rooms/chats/available")
            setUsesAvailableForNewConnection(response.data)
        }
        catch(error) {
            throw error
        }
    }

    return (
        <ChatContext.Provider
            value={{
                createNewRoom,
                chatsPreview,
                fetchUserChatPreview,
                fetchUserAvailableForNewConnections,
                usesAvailableForNewConnection
            }}
        >
            {
                children
            }
        </ChatContext.Provider>
    )
}
