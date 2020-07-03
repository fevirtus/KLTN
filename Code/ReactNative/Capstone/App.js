import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from './src/redux/reducers';
import Nav from './src/navigation'

const store = createStore(rootReducer)

const App = () => {
    return (
        <Provider store={store}>
            <Nav /> 
        </Provider>
    )
};

export default App