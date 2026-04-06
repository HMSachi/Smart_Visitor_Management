import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import { thunk } from "redux-thunk";
import loginReducer from './reducers/LoginReducer';
import adminReducer from "./reducers/adminSlice";
import visitorReducer from "./reducers/visitorSlice";
import contactPersonReducer from './reducers/ContactPersonReducer';
import securityReducer from "./reducers/securitySlice";
import dashboardReducer from "./reducers/dashboardSlice";
import uiReducer from "./reducers/uiSlice";
import administratorReducer from "./reducers/AdministratorReducer";
import visitorManagementReducer from "./reducers/VisitorReducer";
import userManagementReducer from "./reducers/UserManagementReducer";
import visitRequestReducer from "./reducers/VisitRequestReducer";
import contactPersonPortalReducer from "./reducers/contactPersonSlice";
import vehicleReducer from "./reducers/VehicleReducer";

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
    dashboard: dashboardReducer,
    ui: uiReducer,
    administrator: administratorReducer,
    visitorManagement: visitorManagementReducer,
    userManagement: userManagementReducer,
    visitRequestsState: visitRequestReducer,
    contactPortal: contactPersonPortalReducer,
    vehicleState: vehicleReducer,
});

const store = createStore(
    reducer,
    composeEnhancers(applyMiddleware(thunk))
);

export default store;

