import axios from "axios"
import { AppError } from "./appError";
import { GET_AUTH_TOKENS_IN_LOCAL_STORAGE } from "@/Storage/authTokens";

export const api = axios.create({
    baseURL: "http://localhost:3333"
})

api.interceptors.request.use((response) => {
    const authToken  = GET_AUTH_TOKENS_IN_LOCAL_STORAGE()
    if(!authToken) return response

    response.headers.Authorization = `Bearer ${authToken.token}`

    return response
})

api.interceptors.response.use((response) => response , (error) => {
    if(axios.isAxiosError(error)  && error.response && error.response.data){
        return Promise.reject(new AppError(error.response.data.message,error.response.status))
    }
    return Promise.reject(error)
});