import { SAVE_TOKEN, CLEAR_TOKEN } from "./types"

export const saveToken = (token) => ({
    type: SAVE_TOKEN,
    token
})

export const clearToken = () => ({
    type: CLEAR_TOKEN
})