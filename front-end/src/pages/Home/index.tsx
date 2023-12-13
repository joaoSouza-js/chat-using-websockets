import { FormEvent, useEffect, ChangeEvent, useState } from "react"
import { Button } from "@/components/ui/button"
import { Socket, io } from "socket.io-client"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

export function Home() {
    const [socket, setSocket] = useState<Socket | undefined>(undefined)
    const [messages, setMessages] = useState<string[]>([])
  
    const [messageContent, setMessageContent] = useState('')
  
    const disableSubmitButton = messageContent.length < 1
  
    function getInputMessageContent(event: ChangeEvent<HTMLInputElement>) {
      const content = event.target.value
      setMessageContent(content)
    }
  
  
  
    socket?.on("received_message", data => {
      const message: string = data
      const updateMessages = [...messages, message]
      setMessages(updateMessages)
    })
  
    function connectSocket() {
      const URL = "http://localhost:3333"
  
      const SocketConnection = io(URL, {
       
      });
  
      setSocket(SocketConnection)
    }
  
  
  
    function sendMessage(event: FormEvent<HTMLFormElement>) {
      event.preventDefault()
      try {
       
        socket?.emit("message", messageContent)
        setMessageContent('')
  
      } catch (error) {
        window.alert("error")
      }
  
    }
  
  
    console.log(messages)
  
  
  
    useEffect(() => {
      connectSocket()
    }, []);
  
    useEffect(() => {
  
  
    }, [socket])
    return (
      <div className="bg-foreground min-h-screen grid grid-cols-2">
        <div>
  
        </div>
  
        <main className="bg-gray-900 p-4 flex flex-col">
          <ul className="flex flex-col flex-1 gap-3">
            {
              messages.map(message => (
                <li className="">
                  <Card   key={message} className="px-2 py-1 flex justify-center items-center w-[max-content] "  >
  
                    <span >{message}</span>
                  </Card>
  
                </li>
              ))
            }
          </ul>
  
          <form className="mt-auto  flex gap-2" onSubmit={sendMessage}>
            <Input
              name="message"
              value={messageContent}
              onChange={getInputMessageContent}
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
  
  
      </div>
    )
  }