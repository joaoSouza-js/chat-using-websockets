import { GET_AUTH_TOKENS_IN_LOCAL_STORAGE, SAVE_AUTH_TOKENS_IN_LOCAL_STORAGE, DELETE_AUTH_TOKENS_IN_LOCAL_STORAGE } from "@/Storage/authTokens";
import { GET_USER_IN_LOCAL_STORAGE, SAVE_USER_IN_LOCAL_STORAGE, DELETE_USER_IN_LOCAL_STORAGE } from "@/Storage/user";
import { api } from "@/services/axios"
import { ReactNode, createContext, useEffect, useState } from "react"


type SignInResponse = {
    username: string;
    email: string;
    id: string;
    token: string
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
    logOut: () => void,
    signIn: ({ }: signInProps) => Promise<void>
    signUp: ({ }: signUpProps) => Promise<void>
}

interface AuthContextProviderProps {
    children: ReactNode
}

export const AuthContext = createContext({} as AuthContextProps)

export function AuthContextProvider({ children }: AuthContextProviderProps) {
    const [user, setUser] = useState<USER_DTO | null>(null)
    function saveUserInLocalStorage(userInformation: USER_DTO) {
        SAVE_USER_IN_LOCAL_STORAGE({
            email: userInformation.email,
            id: userInformation.id,
            username: userInformation.username
        })
    }

    function saveTokenInApiHeaders(token: string) {
        api.defaults.headers.common.Authorization = `Bearer ${token}`
    }

    function saveAuthTokensInLocalStorage(authTokens: AUTH_TOKENS_DTO) {
        SAVE_AUTH_TOKENS_IN_LOCAL_STORAGE(authTokens)
        saveTokenInApiHeaders(authTokens.token)
    }

    function logOut() {
        setUser(null)
        DELETE_USER_IN_LOCAL_STORAGE()
        DELETE_AUTH_TOKENS_IN_LOCAL_STORAGE()
    }

    async function signIn(userCredentials: signInProps) {
        try {
            const { data: userInformation } = await api.post<SignInResponse>('/users/signIn', {
                email: userCredentials.email,
                password: userCredentials.password
            })

            setUser({
                email: userInformation.email,
                id: userInformation.id,
                username: userInformation.username
            })

            saveUserInLocalStorage(userInformation)
            saveAuthTokensInLocalStorage({ token: userInformation.token })

        } catch (error) {
            throw error
        }

    }

    function fetchUserInLocalStorage() {
        const userInLocalStorage = GET_USER_IN_LOCAL_STORAGE()
        setUser(userInLocalStorage)
    }

    function fetchAuthTokensInLocalStorage() {
        const authTokensInLocalStorage = GET_AUTH_TOKENS_IN_LOCAL_STORAGE()
        if (!authTokensInLocalStorage?.token) return

        saveTokenInApiHeaders(authTokensInLocalStorage.token)
    }

    async function signUp(userCredentials: signUpProps) {
        try {
            const { data: userInformation } = await api.post<SignUpResponse>('/users/signUp', {
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

    useEffect(() => {
        fetchUserInLocalStorage()
        fetchAuthTokensInLocalStorage()
    }, [])

    return (
        <AuthContext.Provider
            value={{
                user,
                signIn,
                logOut,
                signUp,
            }}
        >
            {
                children
            }
        </AuthContext.Provider>
    )
}
