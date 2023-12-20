import express from "express"
import { JwtMiddleware } from "../middleware/jwtMiddleware"
import { messageController } from "../controllers/messagesController"

export const messageRoutes = express.Router()

messageRoutes.use(JwtMiddleware)
messageRoutes.post('/', messageController.CreateMessage )
messageRoutes.get("/:roomId", messageController.GetRoomMessages)