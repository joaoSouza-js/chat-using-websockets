import * as z from "zod"
import { Response } from "express";

import { prisma } from "../services/prisma"
import { Request } from "../@types/express";

const createMessageRequestBody =  z.object({
    roomId: z.string().uuid(),
    message: z.string()
})

const getRoomMessagesRequestParams =  z.object({
    roomId: z.string().uuid(),

})

async function CreateMessage(request: Request, response: Response) {
    try {
        const userId = request.userInformation?.id

        const {roomId,message} = createMessageRequestBody.parse(request.body)
        
        const newMessage = await prisma.message.create({
            data: {
                content: message,
                authorId: userId as string,
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

        const messagesFormatted = {
            id: newMessage.id,
            content: newMessage.content,
            createdAt: newMessage.createdAt,
            authorUsername: newMessage.author.username ,
            authorId: newMessage.author.id,
            roomId: newMessage.roomId
        }

        return response.status(201).json(messagesFormatted)

    } catch (error) {
        return response.status(404).json({ error: error})
    }
}

async function GetRoomMessages(request: Request, response: Response) {
    try {
        const {roomId} = getRoomMessagesRequestParams.parse(request.params)
        const messages = await prisma.message.findMany({
            where: {
                roomId: roomId
            },
            select: {
                id: true,
                content: true,
                roomId: true,
                createdAt: true,
                author: {
                    select: {
                        email: true,
                        id: true,
                        username: true
                    }
                }
            }
        })

        return response.json(messages)
        
    } catch (error) {
        return response.status(404).json({ error: error})

    }
}

export const messageController = {
    CreateMessage,
    GetRoomMessages,
}