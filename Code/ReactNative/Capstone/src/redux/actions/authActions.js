import {
    SAVE_USERINFO,
    CLEAR_USERINFO,
    SAVE_TOKEN,
    SAVE_TOKEN_IMAGE
} from './types'

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

// Save auth token to upload image
export const saveTokenImage = (tokenImage) => ({
    type: SAVE_TOKEN_IMAGE,
    tokenImage
});