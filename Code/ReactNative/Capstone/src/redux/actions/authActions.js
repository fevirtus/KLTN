import {
    SAVE_USERINFO,
    CLEAR_USERINFO,
    NEW_PET
} from './types'

export const saveUserInfo = (userInfo) => ({
    type: SAVE_USERINFO,
    userInfo
});

export const clearUserInfo = () => ({
    type: CLEAR_USERINFO
});

/** actions for pet */
export const newPetInfo = (petInfo) => ({
    type: NEW_PET,
    petInfo
});