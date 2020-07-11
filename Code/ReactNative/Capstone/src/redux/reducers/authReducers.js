import {
    SAVE_USERINFO, 
    CLEAR_USERINFO,
    ACCEPT_LOGIN
} from '../constants/constants'

const initialState = {
    userInfo: {},
    isAcceptedLogin: false,
    petInfo: []
}

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case SAVE_USERINFO: {
            return {
                ...state,
                userInfo: action.userInfo
            }
        }
        case CLEAR_USERINFO: {
            return {
                ...state,
                userInfo: {}
            }
        }
        case ACCEPT_LOGIN: {
            return {
                ...state,
                isAcceptedLogin: !state.isAcceptedLogin
            }
        }
        default:
            return state
    }
}

export default authReducer