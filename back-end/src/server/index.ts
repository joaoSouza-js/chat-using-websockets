import express from "express"
import socketio from "socket.io"
import http from "http"
import cors from "cors"
import { prisma } from "../services/prisma"
import { userRoutes } from "../routes/user"
import { PORT } from "../../env"
import { roomRoutes } from "../routes/room"
import { messageRoutes } from "../routes/messages"

type messageContentProps = {
    userId: string | undefined;
    message: string;
    userName: string | undefined;
    roomId: string
}

type roomProps = {
    userId: string,
    friendId: string,
}

const app = express()

app.use(express.json())

app.use(cors({
    origin: "*"
}))

app.use("/users", userRoutes)
app.use("/rooms", roomRoutes)
app.use("/messages", messageRoutes)


const ApiServer = http.createServer(app)
const SocketServer = new socketio.Server(ApiServer, {
    cors: {
        origin: "*"
    },

})

SocketServer.on('connection', socket => {

    socket.on("message", async (data: messageContentProps) => {
        const message = await prisma.message.create({
            data: {
                content: data.message as string,
                authorId: data.userId as string,
                roomId: data.roomId as string,
            },
            select: {
                author: {
                    select: {
                        username: true,
                        id: true
                    },
                },
                id: true,
                content: true,
                roomId: true,
                createdAt: true
            }
        })
        const messagesFormatted = {
            id: message.id,
            content: message.content,
            createdAt: message.createdAt,
            authorUsername: message.author.username ,
            authorId: message.author.id,
            roomId: message.roomId
        }
        SocketServer?.to(data.roomId).emit("received_message", messagesFormatted)
    })

    socket.on("connectRoom", async (room: roomProps) => {
        let roomId: string | undefined = undefined

        const existingRoom = await prisma.room.findFirst({
            where: {
                AND: [
                    { users: { some: { id: room.friendId } } },
                    { users: { some: { id: room.userId } } },
                ],
            },
        });

        roomId = existingRoom?.id

        if (!existingRoom) {
            const roomCreated = await prisma.room.create({
                data: {
                    users: {
                        connect: [{ id: room.userId }, { id: room.friendId }]
                    }
                }
            })

            roomId = roomCreated?.id
        }

        if (!roomId) return

        socket.join(roomId);
        SocketServer.to(roomId).emit('roomCreated', { roomId: roomId });
    })
})


ApiServer.listen(PORT, () => {
    console.log(`i running on port http://localhost/${PORT}`)
})