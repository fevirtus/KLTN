import {
    SAVE_USERINFO, 
    CLEAR_USERINFO,
    SET_CURRENT_USER
} from '../constants/constants'
import _ from 'lodash'

const initialState = {
    userInfo: {},
    petInfo: [],
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