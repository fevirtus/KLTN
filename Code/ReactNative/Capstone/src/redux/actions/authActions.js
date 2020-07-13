import {
    SAVE_USERINFO,
    CLEAR_USERINFO,
    SAVE_TOKEN
} from '../constants/constants'

export const saveUserInfo = (userInfo) => ({
    type: SAVE_USERINFO,
    userInfo
});

export const clearUserInfo = () => ({
    type: CLEAR_USERINFO
});

export const saveToken = (token) => ({
    type: SAVE_TOKEN,
    token
});