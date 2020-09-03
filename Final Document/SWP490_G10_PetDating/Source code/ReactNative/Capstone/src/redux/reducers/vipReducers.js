import { SAVE_VIP } from "../actions/types";


const initialState = {
    vip: 0,
    status: 'IN_ACTIVE',
    remainTime: ''
}

const vipReducer = (state = initialState, action) => {
    switch (action.type) {
        case SAVE_VIP:
            return {
                ...state,
                ...action.vip
            }
        default:
            return state;
    }
}

export default vipReducer