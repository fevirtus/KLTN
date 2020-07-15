import {
    SAVE_USERINFO,
    CLEAR_USERINFO,
    SAVE_TOKEN,
    NEW_PET
} from '../actions/types'

const initialState = {
    userInfo: {},
    petInfo: [],
    token: '',
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
        case NEW_PET:
            {
                return {
                    ...state,
                    petInfo: action.petInfo
                }
            }
        default:
            return state
    }
}

export default authReducer