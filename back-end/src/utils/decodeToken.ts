import jwt from "jsonwebtoken"
import { SECRET_TOKEN_KEY } from "../../env"
import { TOKEN_DTO } from "../DTO/TOKEN_DTO"

export function decodeToken(authToken: string| undefined){
    if(!authToken){
        return null
    }
    
    const token = jwt.verify(authToken,SECRET_TOKEN_KEY) as TOKEN_DTO | null

    if(!token) return null

    const tokenInformation = {
        id: token.id,
        userName: token.userName,
        email: token.id,
    } 

    return tokenInformation
}