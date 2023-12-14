import { FormEvent, useEffect, ChangeEvent, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Socket, io } from "socket.io-client"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useAuth } from "@/hooks/useAuth"
import { useParams  } from "react-router-dom"
import { string } from "zod"

type messageContentProps = {
  userId: string | undefined;
  message: string;
  userName: string | undefined;
  roomId: string

}

type paramsProps = {
  friendId: string
}

type connecRoomParams = {
  userId: string,
  friendId: string,
}


export function Home() {
  const params = useParams<paramsProps>()
  const [roomId, setRoomId] = useState<null | string>(null)
  const {friendId} = params
 
  const [socket, setSocket] = useState<Socket | undefined>(undefined)
  const [messages, setMessages] = useState<messageContentProps[]>([])
 
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

    const roomConnection: connecRoomParams = {
       friendId: friendId,
       userId: user?.id
    }
    socket?.emit('connectRoom',roomConnection);
  }

  socket?.on('roomCreated', ({roomId}: {roomId: string}) => {
    setRoomId(roomId)
  });


  useEffect(() => {
    socket?.on("received_message", (data: messageContentProps) => {

      const updateMessages = [...messages, data]
      const messagesByroom = updateMessages.filter(messages => {
          if(messages.roomId === roomId) return true
      })
    
      setMessages(messagesByroom)

      console.log(messagesByroom)

      return () => {
        socket.off("received_message")
      }
    })
  },[socket, params, roomId])

  useEffect(() => {
    connectSocket()
  }, []);

  useEffect(() => {
    scrollDown()
  }, [messages])



  useEffect(() => {
    connectRoom()
    setMessages([])
  },[roomId,params])

  return (


    <main className="bg-gray-900 p-4 flex flex-col">
      <ul className="flex flex-col gap-3 overflow-y-auto ">
        {
          messages.map(content => (
            <li key={content.userId} className={`flex ${content.userId !== user?.id && "justify-end"}`}>
              <div>
                <span className="text-gray-300 text-sm">
                  {content.userName}
                </span>
                <Card
                  key={content.userId}
                  className={`px-2 py-1 mt-1 flex justify-center rounded-lg items-center w-[max-content] ${content.userId !== user?.id ? "bg-primary text-gray-200" : "bg-secondary text-zinc-700"} `}
                >

                  <span >{content.message}</span>
                </Card>

              </div>

            </li>
          ))
        }
      </ul>
      <div ref={scrollDiv} />

      <form className="mt-auto  flex gap-2 pt-4" onSubmit={sendMessage}>
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