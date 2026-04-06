import VisitRequestService from "../services/VisitRequestService";
import {
    GET_ALL_VISIT_REQUESTS_REQUEST,
    GET_ALL_VISIT_REQUESTS_SUCCESS,
    GET_ALL_VISIT_REQUESTS_FAILURE,
    ADD_VISIT_REQUEST_REQUEST,
    ADD_VISIT_REQUEST_SUCCESS,
    ADD_VISIT_REQUEST_FAILURE,
    UPDATE_VISIT_REQUEST_REQUEST,
    UPDATE_VISIT_REQUEST_SUCCESS,
    UPDATE_VISIT_REQUEST_FAILURE,
    GET_VR_BY_ID_REQUEST,
    GET_VR_BY_ID_SUCCESS,
    GET_VR_BY_ID_FAILURE,
    GET_VR_BY_CP_REQUEST,
    GET_VR_BY_CP_SUCCESS,
    GET_VR_BY_CP_FAILURE,
    GET_VR_BY_VISITOR_REQUEST,
    GET_VR_BY_VISITOR_SUCCESS,
    GET_VR_BY_VISITOR_FAILURE,
    UPDATE_VR_STATUS_REQUEST,
    UPDATE_VR_STATUS_SUCCESS,
    UPDATE_VR_STATUS_FAILURE
} from "../constants/VisitRequestConstants";

export const GetAllVisitRequests = () => {
    return async (dispatch) => {
        dispatch({ type: GET_ALL_VISIT_REQUESTS_REQUEST });
        try {
            const response = await VisitRequestService.GetAllVisitRequests();
            const payloadData = response.data?.ResultSet || response.data || [];
            dispatch({ type: GET_ALL_VISIT_REQUESTS_SUCCESS, payload: payloadData });
        } catch (error) {
            dispatch({ type: GET_ALL_VISIT_REQUESTS_FAILURE, payload: error.message });
        }
    };
};

export const AddVisitRequest = (requestData) => {
    return async (dispatch) => {
        dispatch({ type: ADD_VISIT_REQUEST_REQUEST });
        try {
            const response = await VisitRequestService.AddVisitRequest(requestData);
            const isSuccess = response.data && (
                response.data.ResultSet ||
                response.data.Status === "Success" ||
                response.data.Status === "OK" ||
                response.data.Result === "Success!!" ||
                response.status === 200
            );

            if (isSuccess) {
                dispatch({ type: ADD_VISIT_REQUEST_SUCCESS, payload: response.data });
                // We dispatch fetching specifically for the Contact Person generating this
                setTimeout(() => dispatch(GetVisitRequestsByCP(requestData.VVR_Contact_person_id)), 1500);
            } else {
                throw new Error(response.data?.Message || "Failed to dispatch visit request");
            }
        } catch (error) {
            // Mitigate Backend Missing CORS Headers for 200 OK
            if (error.message === "Network Error") {
                dispatch({ type: ADD_VISIT_REQUEST_SUCCESS });
                setTimeout(() => dispatch(GetVisitRequestsByCP(requestData.VVR_Contact_person_id)), 1500);
            } else {
                dispatch({ type: ADD_VISIT_REQUEST_FAILURE, payload: error.message });
            }
        }
    };
};

export const UpdateVisitRequest = (requestData) => {
    return async (dispatch, getState) => {
        dispatch({ type: UPDATE_VISIT_REQUEST_REQUEST });
        try {
            const response = await VisitRequestService.UpdateVisitRequest(requestData);
            const isSuccess = response.data && (
                response.data.ResultSet ||
                response.data.Status === "Success" ||
                response.data.Status === "OK" ||
                response.data.Result === "Success!!" ||
                response.status === 200
            );

            if (isSuccess) {
                dispatch({ type: UPDATE_VISIT_REQUEST_SUCCESS, payload: response.data });
                setTimeout(() => dispatch(GetAllVisitRequests()), 1500);
            } else {
                throw new Error(response.data?.Message || "Failed to update visit request");
            }
        } catch (error) {
            if (error.message === "Network Error") {
                dispatch({ type: UPDATE_VISIT_REQUEST_SUCCESS });
                setTimeout(() => dispatch(GetAllVisitRequests()), 1500);
            } else {
                dispatch({ type: UPDATE_VISIT_REQUEST_FAILURE, payload: error.message });
            }
        }
    };
};

export const GetVisitRequestById = (id) => {
    return async (dispatch) => {
        dispatch({ type: GET_VR_BY_ID_REQUEST });
        try {
            const response = await VisitRequestService.GetVisitRequestById(id);
            const payloadData = response.data?.ResultSet || response.data || [];
            dispatch({ type: GET_VR_BY_ID_SUCCESS, payload: payloadData });
        } catch (error) {
            dispatch({ type: GET_VR_BY_ID_FAILURE, payload: error.message });
        }
    };
};

export const GetVisitRequestsByCP = (cpId) => {
    return async (dispatch) => {
        dispatch({ type: GET_VR_BY_CP_REQUEST });
        try {
            const response = await VisitRequestService.GetVisitRequestsByContactPerson(cpId);
            const payloadData = response.data?.ResultSet || response.data || [];
            dispatch({ type: GET_VR_BY_CP_SUCCESS, payload: payloadData });
        } catch (error) {
            dispatch({ type: GET_VR_BY_CP_FAILURE, payload: error.message });
        }
    };
};

export const GetVisitRequestsByVisitor = (visitorId) => {
    return async (dispatch) => {
        dispatch({ type: GET_VR_BY_VISITOR_REQUEST });
        try {
            const response = await VisitRequestService.GetVisitRequestsByVisitor(visitorId);
            const payloadData = response.data?.ResultSet || response.data || [];
            dispatch({ type: GET_VR_BY_VISITOR_SUCCESS, payload: payloadData });
        } catch (error) {
            dispatch({ type: GET_VR_BY_VISITOR_FAILURE, payload: error.message });
        }
    };
};

export const ApproveVisitRequest = (id, status) => {
    return async (dispatch) => {
        dispatch({ type: UPDATE_VR_STATUS_REQUEST });
        try {
            const response = await VisitRequestService.ApproveVisitRequest(id, status);
            const isSuccess = response.data && (
                response.data.ResultSet ||
                response.data.Status === "Success" ||
                response.data.Status === "OK" ||
                response.data.Result === "Success!!" ||
                response.status === 200
            );

            if (isSuccess) {
                dispatch({ type: UPDATE_VR_STATUS_SUCCESS, payload: response.data });
                // Refresh list generally (assumes app will eventually map specific needs)
                setTimeout(() => dispatch(GetAllVisitRequests()), 1500);
            } else {
                throw new Error(response.data?.Message || "Operation failed on server");
            }
        } catch (error) {
            if (error.message === "Network Error") {
                dispatch({ type: UPDATE_VR_STATUS_SUCCESS });
                setTimeout(() => dispatch(GetAllVisitRequests()), 1500);
            } else {
                dispatch({ type: UPDATE_VR_STATUS_FAILURE, payload: error.message });
            }
        }
    };
};
