import { api } from "@/services/axios"
import { ReactNode, createContext, useState } from "react"


type SignInResponse = {
    username: string;
    email: string;
    id: string;

}

type SignUpResponse = {
    username: string;
    email: string;
    id: string;

}

type signInProps = {
    email: string
    password: string
}

type signUpProps = {
    email: string,
    username: string,
    password: string
}

type AuthContextProps = {
    user: USER_DTO | null,
    signIn: ({ }: signInProps) => Promise<void>
    signUp: ({ }: signUpProps) => Promise<void>
}

interface AuthContextProviderProps {
    children: ReactNode
}

export const AuthContext = createContext({} as AuthContextProps)

export function AuthContextProvider({ children }: AuthContextProviderProps) {
    const [user, setUser] = useState<USER_DTO | null>(null)

    async function signIn(userCredentials: signInProps) {
        try {
            const { data: userInformation } = await api.post<SignInResponse>('/signIn', {
                email: userCredentials.email,
                password: userCredentials.password
            })

            setUser({
                email: userInformation.email,
                id: userInformation.id,
                username: userInformation.username
            })

        } catch (error) {
            throw error
        }

    }

    async function signUp(userCredentials: signUpProps) {
        try {
            const { data: userInformation } = await api.post<SignUpResponse>('/signUp', {
                email: userCredentials.email,
                username: userCredentials.username,
                password: userCredentials.password
            })

            await signIn({
                email: userInformation.email,
                password: userCredentials.password
            })

        } catch (error) {
            throw error
        }

    }

    return (
        <AuthContext.Provider
            value={{
                user,
                signIn,
                signUp,
            }}
        >
            {
                children
            }
        </AuthContext.Provider>
    )
}
