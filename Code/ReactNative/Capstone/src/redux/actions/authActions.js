import { SAVE_USERINFO } from '../constants/constants'
import { CLEAR_USERINFO } from '../constants/constants'

export const saveUserInfo = (userInfo) => ({
    type: SAVE_USERINFO,
    userInfo
});

export const clearUserInfo = () => ({
    type: CLEAR_USERINFO
});