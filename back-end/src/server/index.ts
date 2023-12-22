import express from "express"
import socketio from "socket.io"
import http from "http"
import cors from "cors"
import { prisma } from "../services/prisma"
import { userRoutes } from "../routes/user"
import { PORT } from "../../env"
import { roomRoutes } from "../routes/room"
import { messageRoutes } from "../routes/messages"
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import swaggerOptions from "../swagger"
import { z } from "zod"
import { decodeToken } from "../utils/decodeToken"

type messageContentProps = {
    message: string;
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

const specs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use("/users", userRoutes)
app.use("/rooms", roomRoutes)
app.use("/messages", messageRoutes)

const ApiServer = http.createServer(app)
const SocketServer = new socketio.Server(ApiServer, {
    cors: {
        origin: "*"
    },

})


type UserOnlineProps = {
    userId: string,
    socketId: string
}

let usersOnline: UserOnlineProps[] = []

const serverFirstConnectionSchema = z.object({
    token: z.string().optional(),
})

SocketServer.on('connection', async (socket) => {
    const {token}  = serverFirstConnectionSchema.parse(socket.handshake.query)
    const userInformation = decodeToken(token)
    
    if(!userInformation){
        return socket.disconnect()
    }

    socket.on(`notificationVisualized`, (data:{roomId: string}) => {
        socket.emit(`notificationVisualized/room/${data.roomId}`, {roomId: data.roomId} )
    })

    const userIsAlreadyOnline =  usersOnline.some(user => user.userId === userInformation?.id)

    if(userIsAlreadyOnline === false){
        usersOnline.push({
            socketId: socket.id,
            userId: userInformation.id
        })
    }

    usersOnline = usersOnline.map(user => {
        if(user.userId === userInformation.id){
            return {
                socketId: socket.id,
                userId: user.userId
            }
        }
        return user
    })

    SocketServer.emit("usersOnline", usersOnline)


    const userRooms = await prisma.room.findMany({
        where:{
            users: {
                some: {
                    id: userInformation.id
                }
            }
        }
    })

    for(const room of userRooms) {
        socket.join(room.id);
    }

    socket.on("message", async (data: messageContentProps) => {
        const message = await prisma.message.create({
            data: {
                content: data.message as string,
                authorId: userInformation.id as string,
                roomId: data.roomId as string,
            },
            select: {
                author: {
                    select: {
                        username: true,
                        id: true
                    },
                },
                room: {
                    select: {
                        users: true
                    }
                },
                id: true,
                content: true,
                roomId: true,
                createdAt: true
            }
        })
        const messagesFormatted = {
            author: message.author,
            id: message.id,
            content: message.content,
            createdAt: message.createdAt,
        }

        SocketServer?.to(data.roomId).emit("received_message", messagesFormatted)
        SocketServer.to(data.roomId).emit(`notification/roomId/${data.roomId}`,messagesFormatted)

      

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

    socket.on("disconnect", () => {
        const onlineUsersWithoutOneUser =   usersOnline.filter(user => user.userId !== userInformation.id)
        usersOnline =   onlineUsersWithoutOneUser
        SocketServer.emit("usersOnline", usersOnline)
    });
})


ApiServer.listen(PORT, () => {
    console.log(`i running on port http://localhost/${PORT}`)
})