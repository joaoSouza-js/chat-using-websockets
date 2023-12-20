import * as z from "zod"
import bcrypt from "bcrypt";
import {  Response } from "express"
import { prisma } from "../services/prisma";
import jwt from "jsonwebtoken"
import { SECRET_TOKEN_KEY } from "../../env";
import { TOKEN_DTO } from "../DTO/TOKEN_DTO";
import { Request } from "../@types/express";


function createToken(data: TOKEN_DTO) {
    const secret = SECRET_TOKEN_KEY 
 
    const token = jwt.sign(
        data,
        secret,
        {
            expiresIn: "7d"
        }
    );
    
    return token;
}


export async function RegisterUser(request: Request, response: Response) {
    const responseBodySchema = z.object({
        email: z.string({ required_error: "Email é obrigatório" }).email("Email está inválido"),
        username: z.string({ required_error: "Nome de usuário é obrigatório" }),
        password: z.string({ required_error: "Senha é obrigatória" })
    })

    const userInformation = responseBodySchema.parse(request.body)

    const emailExist = await prisma.user.findUnique({
        where: {
            email: userInformation.email
        }
    })

    const usernameExist = await prisma.user.findUnique({
        where: {
            username: userInformation.username
        }
    })

    if (emailExist) {
        return response.status(401).send({
            message: "Email já existe"
        })
    }


    if (usernameExist) {
        return response.status(401).send({
            message: "O nome de usuário já está em uso"
        })
    }

    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const passwordCryptograph = bcrypt.hashSync(userInformation.password, salt)

    const userToCreate = {
        email: userInformation.email,
        username: userInformation.username,
        password: passwordCryptograph
    }

    const newUser = await prisma.user.create({
        data: userToCreate
    })

    const userInformationFiltered = {
        username: newUser.username,
        email: newUser.email,
        id: newUser.id
    }

    return response.status(201).json(userInformationFiltered)
}

async function LoginUser(request: Request, response: Response) {
    try {
        const responseBodySchema = z.object({
            email: z.string({ required_error: "Email é obrigatório" }).email("Email está inválido"),
            password: z.string({ required_error: "Senha é obrigatória" })
        })
    
    
        const userInformation = responseBodySchema.parse(request.body)
    
        const user = await prisma.user.findUnique({
            where: {
                email: userInformation.email
            }
        })
    
        if (!user) {
            return response.status(401).send({
                message: "Email não cadastrado."
            })
        }
    
        const passwordIsCorrect = bcrypt.compareSync(userInformation.password, user.password)
    
        if (!passwordIsCorrect) {
            return response.status(401).send({
                message: "Credenciais inválidas"
            })
        }
    
        const token = createToken({
            id: user.id,
            userName: user.username,
            email: user.email,
        })
    
        const userInformationFiltered = {
            username: user.username,
            email: user.email,
            id: user.id,
            token: token
        }
    
     
        
        response.setHeader('Authorization', `Bearer ${token}`);
        return response.status(200).json(userInformationFiltered)
        
    } catch (error) {
        response.status(500).send(error)
    }

}

async function SearchUsers(request: Request, response: Response) {
    
    const users = await prisma.user.findMany({
        select: {
            email: true,
            username: true,
            id: true

        }
    })
    return response.json(users)
}

export const userController = {
    RegisterUser,
    LoginUser,
    SearchUsers
}