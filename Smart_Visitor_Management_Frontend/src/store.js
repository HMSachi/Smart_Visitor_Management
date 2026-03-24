import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import { thunk } from "redux-thunk";
import loginReducer from "./reducers/LoginReducer";

const composeEnhancers =
    typeof window !== "undefined" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        : compose;

 const reducer = combineReducers({
    login: loginReducer,
});

const store = createStore(
    reducer,
    composeEnhancers(applyMiddleware(thunk))
);
export default store;
