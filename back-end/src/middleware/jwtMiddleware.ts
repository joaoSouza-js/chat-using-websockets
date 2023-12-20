import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken"
import { SECRET_TOKEN_KEY } from "../../env";
import { TOKEN_DTO } from "../DTO/TOKEN_DTO";
import { Request } from "../@types/express";

export function JwtMiddleware(request: Request, response: Response, next: NextFunction){
    const tokenInHeader = request.headers.authorization?.split(" ")[1]


    if(!tokenInHeader){
        return response.status(401).send("Usuário não autorizado") 
    }

    try {
        const token = jwt.verify(tokenInHeader,SECRET_TOKEN_KEY) as TOKEN_DTO

        const tokenInformation = {
            id: token.id,
            userName: token.userName,
            email: token.id,
        } 
        request.userInformation = tokenInformation
        next()

    } catch (error) {
        return response.status(401).send("token expirado.") 
    }

}