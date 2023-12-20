import * as z from "zod"
import { Response } from "express";

import { prisma } from "../services/prisma"
import { Request } from "../@types/express";

const messagesRequestQuery = z.object({
    roomId: z.string().optional(),
})

const createRoomParams = z.object({
    friendId: z.string().uuid()
})

async function GetRoom(request: Request, response: Response) {
    try {
        const { roomId } = messagesRequestQuery.parse(request.params)

        const userId = request.userInformation?.id

        if (!roomId) {
            return response.status(404).json("informe o  id da sala")
        }

        const room = await prisma.room.findUnique({
            where: {
                id: roomId
            },
            select: {
                messages: {
                    select: {
                        author: {
                            select: {
                                email: true,
                                id: true,
                                username: true,

                            }
                        },
                        content: true,
                        createdAt: true
                    }
                },
                users: true
            }
        })

        if (!room) return response.status(404).json("sala não encontrada")

        const friend = room.users.find(user => user.id !== userId)
        const friendFormatted = {
            id: friend?.id,
            email: friend?.email,
            username: friend?.username
        }

        const roomFiltered = {
            friend: friendFormatted,
            messages: room.messages
        }

        return response.json(roomFiltered)

    } catch (error) {
        return response.status(400).json({ error: error })

    }


}

async function FindUserChats(request: Request, response: Response) {
    const userId = request.userInformation?.id
    if (!userId) return response.status(401).send("Não autorizado")

    const userChats = await prisma.room.findMany({
        where: {
            users: {
                some: {
                    id: userId
                }
            }
        },
        select: {
            users: true,
            id: true
        }
    })

    const chats = userChats.map(userChat => {
        const friend = userChat.users.find(user => user.id !== userId)
        const friendFormatted = {
            id: friend?.id,
            email: friend?.email,
            username: friend?.username
        }
        return {
            chatId: userChat.id,
            friend: friendFormatted
        }
    })

    return response.json(chats)
}

async function CreateRoom(request: Request, response: Response) {
    try {
        const userId = request.userInformation?.id
        if (!userId) return response.status(401).send("Não autorizado")

        const { friendId } = createRoomParams.parse(request.body)

        const existingRoom = await prisma.room.findFirst({
            where: {
                AND: [
                    { users: { some: { id: userId } } },
                    { users: { some: { id: friendId } } },
                ],
            },
        });

        if (existingRoom) return response.status(200).json({
            roomId: existingRoom.id
        })

        const roomCreated = await prisma.room.create({
            data: {
                users: {
                    connect: [{ id: userId }, { id: friendId }]
                }
            }
        })
        return response.status(201).json({
            roomId: roomCreated.id
        })

    } catch (error) {
        return response.status(400).json({ error: error })
    }


}
async function AvailableRoom(request: Request, response: Response) {
    const userId = request.userInformation?.id

    const rooms = await prisma.room.findMany({
        where: {
            users: {
                some: {
                    id: userId
                }
            }
        },
        select: {
            users: true
        }
    })

    const friendsId = rooms.flatMap(room => {
        return room.users.filter(user => user.id !== userId).map(user => user.id)
    });

    const userAvailable = await prisma.user.findMany({
        where: {
            id: {
                notIn: friendsId
            }
        },
        select: {
            email: true,
            id: true,
            username: true
        }
    })


    return response.json(userAvailable)



}

export const roomController = {
    GetRoom,
    FindUserChats,
    CreateRoom,
    AvailableRoom,
}