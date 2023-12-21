import express from "express"
import { roomController } from "../../controllers/roomController";
import { JwtMiddleware } from "../../middleware/jwtMiddleware";

export const roomRoutes  = express.Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * tags:
 *   name: Rooms
 *   description: API operations related to rooms
 */

/**
 * @swagger
 * /rooms/{roomId}:
 *   get:
 *     summary: Get room details by ID
 *     tags: [Rooms]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         description: ID of the room
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 friend:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     username:
 *                       type: string
 *                 messages:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       content:
 *                         type: string
 *                       createdAt:
 *                         type: string
 */

/**
 * @swagger
 * /rooms:
 *   get:
 *     summary: Get all user chats
 *     tags: [Rooms]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   chatId:
 *                     type: string
 *                   friend:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       email:
 *                         type: string
 *                       username:
 *                         type: string
 */

/**
 * @swagger
 * /rooms:
 *   post:
 *     summary: Create a new room
 *     tags: [Rooms]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               friendId:
 *                 type: string
 *             required:
 *               - friendId
 *     responses:
 *       201:
 *         description: Room successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 roomId:
 *                   type: string
 *       200:
 *         description: Room already exists, returns existing room ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 roomId:
 *                   type: string
 *       401:
 *         description: Unauthorized access
 *       400:
 *         description: Bad request or error creating room
 */

/**
 * @swagger
 * /rooms/chats/available:
 *   get:
 *     summary: Get available rooms for the user
 *     tags: [Rooms]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   email:
 *                     type: string
 *                   username:
 *                     type: string
 */



roomRoutes.use(JwtMiddleware)

roomRoutes.get("/:roomId", roomController.GetRoom)
roomRoutes.get("/", roomController.FindUserChats)
roomRoutes.post("/", roomController.CreateRoom)
roomRoutes.get("/chats/available", roomController.AvailableRoom)

