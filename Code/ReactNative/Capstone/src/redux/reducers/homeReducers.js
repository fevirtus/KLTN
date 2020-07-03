import {
    HIDE_SWIPER
} from '../constants/constants'

const initialState = {
    isHideSwiper: false
}

const homeReducer = (state = initialState, action) => {
    switch (action.type) {
        case HIDE_SWIPER:
            return {
                ...state,
                isHideSwiper: !state.isHideSwiper
            }
        default:
            return state;
    }
}

export default homeReducer