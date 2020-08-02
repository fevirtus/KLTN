import { combineReducers } from 'redux';
import homeReducer from './homeReducers'
import authReducer from './authReducers';
import loadingReducer from './loadingReducer';

const rootReducer = combineReducers({
    home: homeReducer,
    auth: authReducer,
    loading: loadingReducer
})

export default rootReducer