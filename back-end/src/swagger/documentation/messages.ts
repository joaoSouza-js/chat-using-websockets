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
 *   name: Messages
 *   description: API operations related to messages
 */

/**
 * @swagger
 * /messages:
 *   post:
 *     summary: Create a new message
 *     tags: [Messages]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roomId:
 *                 type: string
 *               message:
 *                 type: string
 *             required:
 *               - roomId
 *               - message
 *     responses:
 *       201:
 *         description: Message successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 content:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                 authorUsername:
 *                   type: string
 *                 authorId:
 *                   type: string
 *                 roomId:
 *                   type: string
 *       404:
 *         description: Error creating message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

/**
 * @swagger
 * /messages/{roomId}:
 *   get:
 *     summary: Get all messages in a room
 *     tags: [Messages]
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
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   content:
 *                     type: string
 *                   roomId:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                   author:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       email:
 *                         type: string
 *                       username:
 *                         type: string
 *       404:
 *         description: Error retrieving messages
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

