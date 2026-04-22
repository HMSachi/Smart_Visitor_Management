import {
    GET_ALL_VISIT_GROUP_REQUEST,
    GET_ALL_VISIT_GROUP_SUCCESS,
    GET_ALL_VISIT_GROUP_FAILURE,
    GET_VISIT_GROUP_BY_ID_REQUEST,
    GET_VISIT_GROUP_BY_ID_SUCCESS,
    GET_VISIT_GROUP_BY_ID_FAILURE,
    ADD_VISIT_GROUP_REQUEST,
    ADD_VISIT_GROUP_SUCCESS,
    ADD_VISIT_GROUP_FAILURE,
    UPDATE_VISIT_GROUP_REQUEST,
    UPDATE_VISIT_GROUP_SUCCESS,
    UPDATE_VISIT_GROUP_FAILURE,
    UPDATE_VISIT_GROUP_STATUS_REQUEST,
    UPDATE_VISIT_GROUP_STATUS_SUCCESS,
    UPDATE_VISIT_GROUP_STATUS_FAILURE
} from '../constants/VisitGroupConstants';

const initialState = {
    visitGroups: [],
    visitGroup: null,
    loading: false,
    error: null,
    success: false
};

export const VisitGroupReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_VISIT_GROUP_REQUEST:
        case GET_VISIT_GROUP_BY_ID_REQUEST:
        case ADD_VISIT_GROUP_REQUEST:
        case UPDATE_VISIT_GROUP_REQUEST:
        case UPDATE_VISIT_GROUP_STATUS_REQUEST:
            return {
                ...state,
                loading: true,
                success: false
            };

        case GET_ALL_VISIT_GROUP_SUCCESS:
            return {
                ...state,
                loading: false,
                visitGroups: action.payload,
                error: null
            };

        case GET_VISIT_GROUP_BY_ID_SUCCESS:
            return {
                ...state,
                loading: false,
                visitGroup: action.payload,
                error: null
            };

        case ADD_VISIT_GROUP_SUCCESS:
        case UPDATE_VISIT_GROUP_SUCCESS:
        case UPDATE_VISIT_GROUP_STATUS_SUCCESS:
            return {
                ...state,
                loading: false,
                success: true,
                error: null
            };

        case GET_ALL_VISIT_GROUP_FAILURE:
        case GET_VISIT_GROUP_BY_ID_FAILURE:
        case ADD_VISIT_GROUP_FAILURE:
        case UPDATE_VISIT_GROUP_FAILURE:
        case UPDATE_VISIT_GROUP_STATUS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
                success: false
            };

        default:
            return state;
    }
};
