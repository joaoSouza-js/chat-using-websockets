import express from "express"
import { userController } from "../controllers/userController";
import { JwtMiddleware } from "../middleware/jwtMiddleware";

export const userRoutes = express.Router()

userRoutes.get("/",JwtMiddleware, userController.SearchUsers)
userRoutes.post("/signUp", userController.RegisterUser)
userRoutes.post("/signIn", userController.LoginUser)


