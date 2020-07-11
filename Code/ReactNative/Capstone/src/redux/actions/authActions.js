import { SAVE_USERINFO, CLEAR_USERINFO, ACCEPT_LOGIN } from '../constants/constants'

export const saveUserInfo = (userInfo) => ({
    type: SAVE_USERINFO,
    userInfo
});

export const clearUserInfo = () => ({
    type: CLEAR_USERINFO
});

export const acceptLogin = () => ({
    type: ACCEPT_LOGIN
});