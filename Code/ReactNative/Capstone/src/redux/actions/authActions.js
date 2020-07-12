import {
    SAVE_USERINFO,
    CLEAR_USERINFO,
    SET_CURRENT_USER
} from '../constants/constants'

export const saveUserInfo = (userInfo) => ({
    type: SAVE_USERINFO,
    userInfo
});

export const clearUserInfo = () => ({
    type: CLEAR_USERINFO
});

export const setCurrentUser = (decoded) => ({
    type: SET_CURRENT_USER,
    payload: decoded
});