import {
    SAVE_USERINFO,
    CLEAR_USERINFO,
    NEW_PET
} from '../actions/types'

const initialState = {
    userInfo: {},
    petInfo: [],
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
        case NEW_PET:
            {
                return {
                    ...state,
                    petInfo: action.petInfo
                }
            }
        default:
            return state;
    }
}

export default authReducer