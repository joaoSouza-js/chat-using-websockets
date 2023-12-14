import {  USER_LOCALSTORAGE_KEY } from "@/Storage";

const userKey = USER_LOCALSTORAGE_KEY;

export function SAVE_USER_IN_LOCAL_STORAGE(user: USER_DTO){
    const userInStringify= JSON.stringify(user);
    localStorage.setItem(userKey,userInStringify)
}

export function GET_USER_IN_LOCAL_STORAGE(){
    const userInStringify = localStorage.getItem(userKey)
    if(!userInStringify){
        return null
    }
    const user = JSON.parse(userInStringify) as USER_DTO;

    return user
}