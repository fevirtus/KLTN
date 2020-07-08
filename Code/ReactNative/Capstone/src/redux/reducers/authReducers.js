import {
    SAVE_USERINFO, CLEAR_USERINFO
} from '../constants/constants'

const initialState = {
    userInfo: {}
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
        default:
            return state
    }
}

export default authReducer