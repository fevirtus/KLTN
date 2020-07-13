import {
    SAVE_USERINFO, 
    CLEAR_USERINFO,
    SAVE_TOKEN
} from '../constants/constants'
import _ from 'lodash'

const initialState = {
    userInfo: {},
    petInfo: [],
    token: ''
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
        case SAVE_TOKEN: {
            return {
                ...state,
                token: action.token
            }
        }
        default:
            return state
    }
}

export default authReducer