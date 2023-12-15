import { FormEvent, useEffect, ChangeEvent, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Socket, io } from "socket.io-client"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useAuth } from "@/hooks/useAuth"
import { useParams  } from "react-router-dom"

import { api } from "@/services/axios"


type paramsProps = {
  friendId: string
}

type connectRoomParams = {
  userId: string,
  friendId: string,
}

type historyMessageProps = {
  id: string;
  content: string;
  createdAt: string;
  authorId: string;
  authorUsername: string
  roomId: string;
};


export function Home() {
  const [history, setHistory] = useState<historyMessageProps[]>([])
  const params = useParams<paramsProps>()
  const [roomId, setRoomId] = useState<null | string>(null)
  const {friendId} = params
 
  const [socket, setSocket] = useState<Socket | undefined>(undefined)
 
  const { user } = useAuth()
  const scrollDiv = useRef<HTMLDivElement | null>(null)

  const [messageText, setMessageText] = useState('')

  const disableSubmitButton = messageText.length < 1

  function getInputMessageText(event: ChangeEvent<HTMLInputElement>) {
    const content = event.target.value
    setMessageText(content)
  }

  function scrollDown() {
    scrollDiv.current?.scrollIntoView({ behavior: "smooth" })
  }

  async function fetchRoomHistory(roomId: string){
      const {data} = await api.get<historyMessageProps[]>(`/history/${roomId}`)
      setHistory(data)
  }


  function connectSocket() {
    const URL = "http://localhost:3333"
    const SocketConnection = io(URL, {
      
    });
    setSocket(SocketConnection)
  }


  function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    try {
      const messageContent = {
        userId: user?.id,
        message: messageText,
        userName: user?.username,
        roomId: roomId
      }
      socket?.emit("message", messageContent)
      setMessageText('')

    } catch (error) {
      window.alert("error")
    }

  }

  function connectRoom(){
    if(!friendId || !user?.id) return

    const roomConnection: connectRoomParams = {
       friendId: friendId,
       userId: user?.id
    }
    socket?.emit('connectRoom',roomConnection);
  }

  socket?.on('roomCreated', ({roomId}: {roomId: string}) => {
    setRoomId(roomId)
    fetchRoomHistory(roomId)
  });


  useEffect(() => {
    socket?.on("received_message", (data: historyMessageProps) => {
      setHistory(state => {
          const isDuplicateMessage = state.some(message => message.id === data.id)
          if(isDuplicateMessage) return state
          return [...state, data]
        
      })
      scrollDown()

      
    })

    return  () => {
      socket?.off("received_message")
    }
  },[socket])

  useEffect(() => {
    connectSocket()
  }, []);


  useEffect(() => {
    connectRoom()

  },[roomId,params])

  return (


    <main className="bg-gray-900   flex flex-col ">
      <section className="overflow-y-auto h-[90vh] pt-4">
        <ul className="flex flex-col gap-3   ">
          {
            history.map(content => (
              <li key={content.id} className={`flex ${content.authorId !== user?.id && "justify-end"} px-4`}>
                <div>
                  <span className="text-gray-300 text-sm">
                    {content.authorUsername}
                  </span>
                  <Card
                    
                    className={`px-2 py-1 mt-1 flex justify-center rounded-lg items-center w-[max-content] ${content.authorId !== user?.id ? "bg-primary text-gray-200" : "bg-secondary text-zinc-700"} `}
                  >

                    <span >{content.content}</span>
                  </Card>

                </div>

              </li>
            ))
          }
        </ul>
        <div ref={scrollDiv} />

      </section>

      <form className="mt-auto  flex gap-2 pt-4 h-[10vh] px-4" onSubmit={sendMessage}>
        <Input
          name="message"
          value={messageText}
          onChange={getInputMessageText}
          className="text-white"
          placeholder="Digite a sua menssagem"
        />
        <Button
          type="submit"
          disabled={disableSubmitButton}


        >
          click here
        </Button>


      </form>

    </main>



  )
}