import { combineReducers } from 'redux';
import homeReducer from './homeReducers'
import authReducer from './authReducers'

const rootReducer = combineReducers({
    home: homeReducer,
    auth: authReducer
})

export default rootReducer