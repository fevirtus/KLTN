import { combineReducers } from 'redux';
import homeReducer from './homeReducers'

const rootReducer = combineReducers({
    home: homeReducer,
})

export default rootReducer