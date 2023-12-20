import {  AUTH_TOKEN_LOCALSTORAGE_KEY } from "@/Storage";

const authTokensKey = AUTH_TOKEN_LOCALSTORAGE_KEY;


export function SAVE_AUTH_TOKENS_IN_LOCAL_STORAGE(tokens:AUTH_TOKENS_DTO){
    const authTokensInStringify = JSON.stringify(tokens)
    localStorage.setItem(authTokensKey,authTokensInStringify)
}

export function GET_AUTH_TOKENS_IN_LOCAL_STORAGE(){
    const authTokensInStringify = localStorage.getItem(authTokensKey)
    if(!authTokensInStringify)return null

    const authTokens  = JSON.parse(authTokensInStringify) as AUTH_TOKENS_DTO
    return authTokens
}

export function DELETE_AUTH_TOKENS_IN_LOCAL_STORAGE(){
    localStorage.removeItem(authTokensKey)
}

