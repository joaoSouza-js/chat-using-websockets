import express from "express"
import { roomController } from "../controllers/roomController";
import { JwtMiddleware } from "../middleware/jwtMiddleware";

export const roomRoutes  = express.Router();

roomRoutes.use(JwtMiddleware)

roomRoutes.get("/:roomId", roomController.GetRoom)
roomRoutes.get("/", roomController.FindUserChats)
roomRoutes.post("/", roomController.CreateRoom)
roomRoutes.get("/chats/available", roomController.AvailableRoom)

