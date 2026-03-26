import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import { thunk } from "redux-thunk";
import loginReducer from "./reducers/LoginReducer";
import dashboardReducer from "./reducers/admin/dashboardSlice";

const composeEnhancers =
    typeof window !== "undefined" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        : compose;

 const reducer = combineReducers({
    login: loginReducer,
    dashboard: dashboardReducer,
});

const store = createStore(
    reducer,
    composeEnhancers(applyMiddleware(thunk))
);
export default store;
