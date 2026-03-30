import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk"; 
import { composeWithDevTools } from "redux-devtools-extension";
import loginReducer from "./reducers/LoginReducer";


 const reducer = combineReducers({
    login: loginReducer,
});

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(thunk))
);
export default store;
