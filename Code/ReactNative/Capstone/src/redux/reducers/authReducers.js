import {
    SAVE_USERINFO,
    CLEAR_USERINFO,
    SAVE_TOKEN,
    SAVE_TOKEN_IMAGE
} from '../actions/types'

const initialState = {
    userInfo: {},
    petInfo: [],
    token: '',
    tokenImage: ''
}

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case SAVE_USERINFO:
            {
                return {
                    ...state,
                    userInfo: action.userInfo
                }
            }
        case CLEAR_USERINFO:
            {
                return {
                    ...state,
                    userInfo: {},
                    token: ''
                }
            }
        case SAVE_TOKEN:
            {
                return {
                    ...state,
                    token: action.token
                }
            }
        case SAVE_TOKEN_IMAGE:
            {
                return {
                    ...state,
                    tokenImage: action.tokenImage
                }
            }
        default:
            return state
    }
}

export default authReducer