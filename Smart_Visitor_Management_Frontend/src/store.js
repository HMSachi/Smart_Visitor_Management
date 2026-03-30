import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import { thunk } from "redux-thunk";
import loginReducer from "./reducers/login/LoginReducer";
import adminReducer from "./reducers/admin/adminSlice";
import visitorReducer from "./reducers/visitor/visitorSlice";
import contactPersonReducer from "./reducers/contactPerson/contactPersonSlice";
import securityReducer from "./reducers/security/securitySlice";

const composeEnhancers =
    typeof window !== "undefined" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        : compose;

 const reducer = combineReducers({
    login: loginReducer,
    admin: adminReducer,
    visitor: visitorReducer,
    contactPerson: contactPersonReducer,
    security: securityReducer,
});

const store = createStore(
    reducer,
    composeEnhancers(applyMiddleware(thunk))
);

export default store;

