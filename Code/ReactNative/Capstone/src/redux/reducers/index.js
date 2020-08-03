import { combineReducers } from 'redux';
import homeReducer from './homeReducers'
import authReducer from './authReducers';
import loadingReducer from './loadingReducer';
import tokenReducer from './tokenReducer';

const rootReducer = combineReducers({
    home: homeReducer,
    auth: authReducer,
    loading: loadingReducer,
    token: tokenReducer,
})

export default rootReducer