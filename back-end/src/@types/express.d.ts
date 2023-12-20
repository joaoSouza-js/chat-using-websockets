import { Request as ExpressRequest } from "express";
import { TOKEN_DTO } from "../DTO/TOKEN_DTO";

export interface Request extends ExpressRequest {
    userInformation?: TOKEN_DTO;
}