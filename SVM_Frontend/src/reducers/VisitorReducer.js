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

const initialState = {
    visitors: [],
    visitor: null,
    visitorsByCP: [],
    isLoading: false,
    error: null,
};

const VisitorReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_VISITORS_REQUEST:
        case ADD_VISITOR_REQUEST:
        case GET_VISITOR_BY_ID_REQUEST:
        case ACTIVATE_VISITOR_REQUEST:
        case GET_VISITORS_BY_CP_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };

        case GET_ALL_VISITORS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                visitors: action.payload,
            };

        case GET_VISITORS_BY_CP_SUCCESS:
            return {
                ...state,
                isLoading: false,
                visitorsByCP: action.payload,
            };

        case GET_VISITOR_BY_ID_SUCCESS:
            return {
                ...state,
                isLoading: false,
                visitor: action.payload,
            };

        case ADD_VISITOR_SUCCESS:
        case ACTIVATE_VISITOR_SUCCESS:
            return {
                ...state,
                isLoading: false,
                error: null,
            };

        case GET_ALL_VISITORS_FAILURE:
        case ADD_VISITOR_FAILURE:
        case GET_VISITOR_BY_ID_FAILURE:
        case ACTIVATE_VISITOR_FAILURE:
        case GET_VISITORS_BY_CP_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };

        default:
            return state;
    }
};

export default VisitorReducer;
