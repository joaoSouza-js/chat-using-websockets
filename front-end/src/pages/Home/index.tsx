import { FormEvent, useEffect, ChangeEvent, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Socket, io } from "socket.io-client"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useAuth } from "@/hooks/useAuth"
import { useParams } from "react-router-dom"
import  dayjs from "dayjs"

import { api } from "@/services/axios"
import { useSocket } from "@/hooks/useSocket"


type paramsProps = {
  chatId: string
}

type messageProps = {
  author: USER_DTO,
  id: string,
  content: string;
  createdAt: string;
}

type roomInformationResponse = {
  friend: USER_DTO,
  messages: messageProps[]
  
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
  const [history, setHistory] = useState<messageProps[]>([])
  const [friend, setFriend] = useState<null | USER_DTO>(null)
  const params = useParams<paramsProps>()
  const [roomId, setRoomId] = useState<null | string>(null)
  const { chatId } = params
  const { socket } = useSocket()

  

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

  async function fetchRoomHistory() {
    const { data } = await api.get<roomInformationResponse>(`/rooms/${chatId}`)
    setHistory(data.messages)
    setFriend(data.friend)
  }

  function formatDate(Date: string | Date){
      const dateFormated = dayjs(Date).format("HH[:]mm")
      return dateFormated
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

  useEffect(() =>  {
    console.log("run this hook")
    fetchRoomHistory()
  },[params])

  

  return (


    <main className="bg-gray-900   flex flex-col ">
      <section className="overflow-y-auto  pt-6 h-[80vh]">
        <div className="text-center">
          <h1 className="text-gray-300 text-lg "> {friend?.username}</h1>

        </div>
        <ul className="flex flex-col gap-3 pt-2   ">
          {
            history.map(message => (
              <li key={message.id} className={`flex ${message.author.id !== user?.id && "justify-end"} px-4`}>
                <div>
                  <span className="text-gray-300 text-sm">
                    {message.author.username}
                  </span>
                  <Card

                    className={`px-2 py-1 mt-1 min-w-[100px] flex flex-col justify-center rounded-lg items-center w-[max-content] ${message.author.id !== user?.id ? "bg-primary text-gray-200" : "bg-secondary text-zinc-700"} `}
                  >

                    <span className="block self-start font-medium " >{message.content}</span>
                    <span className="block self-end text-xs" >{formatDate(message.createdAt)}</span>
                  </Card>

                </div>

              </li>
            ))
          }
        </ul>
        <div ref={scrollDiv} />

      </section>

      <form className=" flex gap-2 pt-4 h-[10vh] px-4 " onSubmit={sendMessage}>
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
          enviar
        </Button>


      </form>

    </main>



  )
}