import { SAVE_TOKEN, CLEAR_TOKEN } from "../actions/types";


const initialState = {
    token: null
}

const tokenReducer = (state = initialState, action) => {
    switch (action.type) {
        case SAVE_TOKEN:
            return {
                token: action.token
            }
        case CLEAR_TOKEN:
            return {
                token: null
            }
        default:
            return state;
    }
}

export default tokenReducer