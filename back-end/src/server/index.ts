import express from "express"
import socketio from "socket.io"
import http from "http"
import cors from "cors"
import * as z from "zod"
import bcrypt from "bcrypt";
import { prisma } from "../services/prisma"

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

const port = 3333

const ApiServer = http.createServer(app)
const SocketServer = new socketio.Server(ApiServer, {
    cors: {
        origin: "*"
    },

})


app.post("/signUp", async (request, response) => {

    const responseBodySchema = z.object({
        email: z.string({ required_error: "Email é obrigatório" }).email("Email está inválido"),
        username: z.string({ required_error: "Nome de usuário é obrigatório" }),
        password: z.string({ required_error: "Senha é obrigatória" })
    })

    const userInformation = responseBodySchema.parse(request.body)

    const emailExist = await prisma.user.findUnique({
        where: {
            email: userInformation.email
        }
    })

    const usernameExist = await prisma.user.findUnique({
        where: {
            username: userInformation.username
        }
    })

    if (emailExist) {
        return response.status(401).send({
            message: "Email já existe"
        })
    }


    if (usernameExist) {
        return response.status(401).send({
            message: "O nome de usuário já está em uso"
        })
    }

    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const passwordCryptograph = bcrypt.hashSync(userInformation.password, salt)

    const userToCreate = {
        email: userInformation.email,
        username: userInformation.username,
        password: passwordCryptograph
    }

    const newUser = await prisma.user.create({
        data: userToCreate
    })

    const userInformationFiltered = {
        username: newUser.username,
        email: newUser.email,
        id: newUser.id
    }

    return response.status(201).json(userInformationFiltered)

})

app.post("/signIn", async (request, response) => {
    const responseBodySchema = z.object({
        email: z.string({ required_error: "Email é obrigatório" }).email("Email está inválido"),
        password: z.string({ required_error: "Senha é obrigatória" })
    })



    const userInformation = responseBodySchema.parse(request.body)

    const user = await prisma.user.findUnique({
        where: {
            email: userInformation.email
        }
    })

    if (!user) {
        return response.status(401).send({
            message: "Email não cadastrado."
        })
    }

    const passwordIsCorrect = bcrypt.compareSync(userInformation.password, user.password)

    if (!passwordIsCorrect) {
        return response.status(401).send({
            message: "Credenciais inválidas"
        })
    }

    const userInformationFiltered = {
        username: user.username,
        email: user.email,
        id: user.id
    }

    return response.status(200).json(userInformationFiltered)



})

app.get("/user", async (request, response) => {
    const users = await prisma.user.findMany({
        select: {
            email: true,
            username: true,
            id: true

        }
    })
    return response.json(users)

})


const messagesRequestQuery = z.object({
    roomId: z.string().optional(),
})
app.get("/history/:roomId", async (request, response) => {
    const { roomId } = messagesRequestQuery.parse(request.params)

    if (!roomId) {
        return response.status(404).json("informe o  id da sala")
    }

    const messages = await prisma.message.findMany({
        where: {
            roomId: roomId,
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

    const messagesFormatted = messages.map(message => {
        return {
            id: message.id,
            content: message.content,
            createdAt: message.createdAt,
            authorUsername: message.author.username,
            authorId: message.author.id,
            roomId: message.roomId
        }
    })

    return response.json(messagesFormatted)


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


ApiServer.listen(port, () => {
    console.log(`i running on port http://localhost/${port}`)
})