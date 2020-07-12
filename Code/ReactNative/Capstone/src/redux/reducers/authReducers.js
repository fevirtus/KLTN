import {
    SAVE_USERINFO, 
    CLEAR_USERINFO,
    SET_CURRENT_USER
} from '../constants/constants'
import _ from 'lodash'

const initialState = {
    userInfo: {},
    petInfo: [],
    isAuthenticated: false
}

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case SAVE_USERINFO: {
            return {
                ...state,
                userInfo: action.userInfo
            }
        }
        // case SET_CURRENT_USER: {
        //     return {
        //         ...state,
        //         isisAuthenticated: !_.isEmpty(action.payload),
        //         userInfo: action.payload
        //     }
        // }
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