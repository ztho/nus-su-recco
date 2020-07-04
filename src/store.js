import { createStore, applyMiddleware, compose } from "redux"; 
import thunk from "redux-thunk";
import rootReducer from "./reducers"; //will auto call index.js
import throttle from 'lodash.throttle'

//const initialState = {}; 

const middleware = [thunk]; 

export const loadState = () => {
    try { 
        const serializedState = localStorage.getItem("state");
        if (serializedState === null) return undefined 
        return JSON.parse(serializedState)
    } catch (err) {
    console.log(err)
    return undefined
    }
}

export const saveState = (state) => {
    try {
        const serializedState = JSON.stringify(state)
        localStorage.setItem("state", serializedState)
    } catch {
        //ignore write errors
    }
}

const persistedState = loadState(); 

const store = createStore(rootReducer, persistedState, compose(
    applyMiddleware(...middleware),
    //window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() : f => f
    )
); 

store.subscribe(throttle(() => {
    saveState(store.getState())
}, 1000))

export default store; 