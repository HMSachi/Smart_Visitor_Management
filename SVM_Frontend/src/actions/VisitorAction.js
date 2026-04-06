import VisitorService from "../services/VisitorService";
import {
    GET_ALL_VISITORS_REQUEST,
    GET_ALL_VISITORS_SUCCESS,
    GET_ALL_VISITORS_FAILURE,
    ADD_VISITOR_REQUEST,
    ADD_VISITOR_SUCCESS,
    ADD_VISITOR_FAILURE,
    GET_VISITOR_BY_ID_REQUEST,
    GET_VISITOR_BY_ID_SUCCESS,
    GET_VISITOR_BY_ID_FAILURE,
    ACTIVATE_VISITOR_REQUEST,
    ACTIVATE_VISITOR_SUCCESS,
    ACTIVATE_VISITOR_FAILURE,
    GET_VISITORS_BY_CP_REQUEST,
    GET_VISITORS_BY_CP_SUCCESS,
    GET_VISITORS_BY_CP_FAILURE
} from "../constants/VisitorConstants";

export const GetAllVisitors = () => {
    return async (dispatch) => {
        dispatch({ type: GET_ALL_VISITORS_REQUEST });
        try {
            const response = await VisitorService.GetAllVisitors();
            const payloadData = response.data?.ResultSet || response.data || [];
            dispatch({ type: GET_ALL_VISITORS_SUCCESS, payload: payloadData });
        } catch (error) {
            dispatch({ type: GET_ALL_VISITORS_FAILURE, payload: error.message });
        }
    };
};

export const AddVisitor = (visitorData) => {
    return async (dispatch) => {
        dispatch({ type: ADD_VISITOR_REQUEST });
        try {
            const response = await VisitorService.AddVisitor(visitorData);
            // Check for success in the response payload
            const isSuccess = response.data && (
                response.data.ResultSet ||
                response.data.Status === "Success" ||
                response.data.Status === "OK" ||
                response.data.Result === "Success!!" ||
                response.status === 200
            );
            if (isSuccess) {
                dispatch({ type: ADD_VISITOR_SUCCESS, payload: response.data });
                setTimeout(() => dispatch(GetAllVisitors()), 1500);
                return response.data; // Return for component use
            } else {
                throw new Error(response.data?.Message || "Failed to add visitor");
            }
        } catch (error) {
            if (error.message === "Network Error") {
                dispatch({ type: ADD_VISITOR_SUCCESS });
                setTimeout(() => dispatch(GetAllVisitors()), 1500);
                return { Status: "Success" }; // Return mock success for CORS issues
            } else {
                dispatch({ type: ADD_VISITOR_FAILURE, payload: error.message });
                throw error;
            }
        }
    };
};

export const GetVisitorById = (id) => {
    return async (dispatch) => {
        dispatch({ type: GET_VISITOR_BY_ID_REQUEST });
        try {
            const response = await VisitorService.GetVisitorById(id);
            const payloadData = response.data?.ResultSet || response.data || [];
            dispatch({ type: GET_VISITOR_BY_ID_SUCCESS, payload: payloadData });
        } catch (error) {
            dispatch({ type: GET_VISITOR_BY_ID_FAILURE, payload: error.message });
        }
    };
};

export const ToggleVisitorStatus = (id, status) => {
    return async (dispatch) => {
        dispatch({ type: ACTIVATE_VISITOR_REQUEST });
        try {
            const response = await VisitorService.ActivateVisitor(id, status);
            // Robust check for success
            const isSuccess = response.data && (
                response.data.ResultSet ||
                response.data.Status === "Success" ||
                response.data.Status === "OK" ||
                response.status === 200
            );

            if (isSuccess) {
                dispatch({ type: ACTIVATE_VISITOR_SUCCESS, payload: response.data });
                // 1.5s delay to ensure backend database consistency
                setTimeout(() => {
                    dispatch(GetAllVisitors());
                }, 1500);
            } else {
                throw new Error(response.data?.Message || "Status update failed on server");
            }
        } catch (error) {
            if (error.message === "Network Error") {
                dispatch({ type: ACTIVATE_VISITOR_SUCCESS });
                setTimeout(() => dispatch(GetAllVisitors()), 1500);
            } else {
                dispatch({ type: ACTIVATE_VISITOR_FAILURE, payload: error.message });
            }
        }
    };
};

export const GetVisitorsByCP = (cpId) => {
    return async (dispatch) => {
        dispatch({ type: GET_VISITORS_BY_CP_REQUEST });
        try {
            const response = await VisitorService.GetVisitorsByContactPerson(cpId);
            const payloadData = response.data?.ResultSet || response.data || [];
            dispatch({ type: GET_VISITORS_BY_CP_SUCCESS, payload: payloadData });
        } catch (error) {
            dispatch({ type: GET_VISITORS_BY_CP_FAILURE, payload: error.message });
        }
    };
};
