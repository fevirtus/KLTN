import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import rootReducer from './src/redux/reducers';
import Nav from './src/navigation'
import { persistStore, persistReducer } from 'redux-persist'
import { createLogger } from 'redux-logger'
import { PersistGate } from 'redux-persist/integration/react'
import { Loading, Loader } from './src/components';
console.disableYellowBox = true;

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['token']
}

const persitedReducer = persistReducer(persistConfig, rootReducer)

const store = createStore(persitedReducer, applyMiddleware(createLogger()))

const persitedStore = persistStore(store)

const App = () => {
    console.log(store.getState())
    return (
        <Provider store={store}>
            <PersistGate persistor={persitedStore} loading={null}>
                <Nav />
                <Loader />
            </PersistGate>
        </Provider>
    )
};

export default App