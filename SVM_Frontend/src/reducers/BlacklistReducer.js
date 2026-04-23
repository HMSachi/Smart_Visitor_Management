import {
    GET_ALL_BLACKLIST_REQUEST,
    GET_ALL_BLACKLIST_SUCCESS,
    GET_ALL_BLACKLIST_FAILURE,
    GET_BLACKLIST_BY_ID_REQUEST,
    GET_BLACKLIST_BY_ID_SUCCESS,
    GET_BLACKLIST_BY_ID_FAILURE,
    ADD_BLACKLIST_REQUEST,
    ADD_BLACKLIST_SUCCESS,
    ADD_BLACKLIST_FAILURE,
    UPDATE_BLACKLIST_REQUEST,
    UPDATE_BLACKLIST_SUCCESS,
    UPDATE_BLACKLIST_FAILURE,
    UPDATE_BLACKLIST_STATUS_REQUEST,
    UPDATE_BLACKLIST_STATUS_SUCCESS,
    UPDATE_BLACKLIST_STATUS_FAILURE
} from "../constants/BlacklistConstants";

const initialState = {
    blacklists: [],
    blacklist: null,
    isLoading: false,
    error: null,
};

const BlacklistReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_BLACKLIST_REQUEST:
        case GET_BLACKLIST_BY_ID_REQUEST:
        case ADD_BLACKLIST_REQUEST:
        case UPDATE_BLACKLIST_REQUEST:
        case UPDATE_BLACKLIST_STATUS_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };

        case GET_ALL_BLACKLIST_SUCCESS:
            return {
                ...state,
                isLoading: false,
                blacklists: action.payload,
            };

        case GET_BLACKLIST_BY_ID_SUCCESS:
            return {
                ...state,
                isLoading: false,
                blacklist: action.payload,
            };

        case ADD_BLACKLIST_SUCCESS:
        case UPDATE_BLACKLIST_SUCCESS:
        case UPDATE_BLACKLIST_STATUS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                error: null,
            };

        case GET_ALL_BLACKLIST_FAILURE:
        case GET_BLACKLIST_BY_ID_FAILURE:
        case ADD_BLACKLIST_FAILURE:
        case UPDATE_BLACKLIST_FAILURE:
        case UPDATE_BLACKLIST_STATUS_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };

        default:
            return state;
    }
};

export default BlacklistReducer;
