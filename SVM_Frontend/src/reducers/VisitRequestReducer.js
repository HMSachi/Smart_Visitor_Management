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

const initialState = {
    isLoading: false,
    visitRequests: [],       // general or all
    visitRequestsByCP: [],   // specifically for Contact Person context
    visitRequestsByVis: [],  // specifically for Visitor context
    error: null,
};

const visitRequestReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_VISIT_REQUESTS_REQUEST:
        case GET_VR_BY_CP_REQUEST:
        case GET_VR_BY_VISITOR_REQUEST:
        case GET_VR_BY_ID_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case GET_ALL_VISIT_REQUESTS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                visitRequests: action.payload,
                error: null,
            };
        case GET_VR_BY_CP_SUCCESS:
            return {
                ...state,
                isLoading: false,
                visitRequestsByCP: action.payload,
                error: null,
            };
        case GET_VR_BY_VISITOR_SUCCESS:
            return {
                ...state,
                isLoading: false,
                visitRequestsByVis: action.payload,
                error: null,
            };
        case GET_VR_BY_ID_SUCCESS:
            return {
                ...state,
                isLoading: false,
                // Replace visitRequests array securely so table fetches what CP searched for
                visitRequests: Array.isArray(action.payload) ? action.payload : [action.payload],
                error: null,
            };
        case GET_ALL_VISIT_REQUESTS_FAILURE:
        case GET_VR_BY_CP_FAILURE:
        case GET_VR_BY_VISITOR_FAILURE:
        case GET_VR_BY_ID_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case ADD_VISIT_REQUEST_REQUEST:
        case UPDATE_VISIT_REQUEST_REQUEST:
        case UPDATE_VR_STATUS_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case ADD_VISIT_REQUEST_SUCCESS:
        case UPDATE_VISIT_REQUEST_SUCCESS:
        case UPDATE_VR_STATUS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                error: null,
            };
        case ADD_VISIT_REQUEST_FAILURE:
        case UPDATE_VISIT_REQUEST_FAILURE:
        case UPDATE_VR_STATUS_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};

export default visitRequestReducer;
