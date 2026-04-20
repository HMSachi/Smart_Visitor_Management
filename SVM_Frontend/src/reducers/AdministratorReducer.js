import {
    GET_ALL_ADMINISTRATOR_REQUEST,
    GET_ALL_ADMINISTRATOR_SUCCESS,
    GET_ALL_ADMINISTRATOR_FAILURE,
    ADD_ADMINISTRATOR_REQUEST,
    ADD_ADMINISTRATOR_SUCCESS,
    ADD_ADMINISTRATOR_FAILURE,
    UPDATE_ADMINISTRATOR_REQUEST,
    UPDATE_ADMINISTRATOR_SUCCESS,
    UPDATE_ADMINISTRATOR_FAILURE,
    GET_ADMINISTRATOR_BY_ID_REQUEST,
    GET_ADMINISTRATOR_BY_ID_SUCCESS,
    GET_ADMINISTRATOR_BY_ID_FAILURE,
    DELETE_ADMINISTRATOR_REQUEST,
    DELETE_ADMINISTRATOR_SUCCESS,
    DELETE_ADMINISTRATOR_FAILURE
} from "../constants/AdministratorConstants";

const initialState = {
    isLoading: false,
    administrators: [],
    error: null,
};

const administratorReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_ADMINISTRATOR_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case GET_ALL_ADMINISTRATOR_SUCCESS:
            return {
                ...state,
                isLoading: false,
                administrators: action.payload,
                error: null,
            };
        case GET_ALL_ADMINISTRATOR_FAILURE:
            return {
                ...state,
                isLoading: false,
                administrators: [],
                error: action.payload,
            };
        case ADD_ADMINISTRATOR_REQUEST:
        case UPDATE_ADMINISTRATOR_REQUEST:
        case GET_ADMINISTRATOR_BY_ID_REQUEST:
        case DELETE_ADMINISTRATOR_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case ADD_ADMINISTRATOR_SUCCESS:
        case UPDATE_ADMINISTRATOR_SUCCESS:
        case DELETE_ADMINISTRATOR_SUCCESS:
            return {
                ...state,
                isLoading: false,
                error: null,
            };
        case GET_ADMINISTRATOR_BY_ID_SUCCESS:
            return {
                ...state,
                isLoading: false,
                administrators: action.payload, // Replace list with searched admin
                error: null,
            };
        case ADD_ADMINISTRATOR_FAILURE:
        case UPDATE_ADMINISTRATOR_FAILURE:
        case GET_ADMINISTRATOR_BY_ID_FAILURE:
        case DELETE_ADMINISTRATOR_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};

export default administratorReducer;
