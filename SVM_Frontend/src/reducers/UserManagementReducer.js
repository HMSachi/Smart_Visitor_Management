import {
    USER_MANAGEMENT_FETCH_REQUEST,
    USER_MANAGEMENT_FETCH_SUCCESS,
    USER_MANAGEMENT_FETCH_FAILURE,
    USER_MANAGEMENT_ADMINS_FETCH_REQUEST,
    USER_MANAGEMENT_ADMINS_FETCH_SUCCESS,
    USER_MANAGEMENT_ADMINS_FETCH_FAILURE,
    USER_MANAGEMENT_ADD_REQUEST,
    USER_MANAGEMENT_ADD_SUCCESS,
    USER_MANAGEMENT_ADD_FAILURE,
    USER_MANAGEMENT_UPDATE_REQUEST,
    USER_MANAGEMENT_UPDATE_SUCCESS,
    USER_MANAGEMENT_UPDATE_FAILURE,
    USER_MANAGEMENT_STATUS_UPDATE_REQUEST,
    USER_MANAGEMENT_STATUS_UPDATE_SUCCESS,
    USER_MANAGEMENT_STATUS_UPDATE_FAILURE,
    USER_MANAGEMENT_VALIDATE_FIELD_REQUEST,
    USER_MANAGEMENT_VALIDATE_FIELD_SUCCESS,
    USER_MANAGEMENT_VALIDATE_FIELD_FAILURE,
    USER_MANAGEMENT_CLEAR_ERRORS,
} from "../constants/UserManagementConstants";

const initialState = {
    contactPersons: [],
    administrators: [],
    isLoading: false,
    error: null,
    success: false,
    validation: {
        phoneError: '',
        emailError: '',
        isValidating: false,
    }
};

const userManagementReducer = (state = initialState, action) => {
    switch (action.type) {
        case USER_MANAGEMENT_FETCH_REQUEST:
        case USER_MANAGEMENT_ADMINS_FETCH_REQUEST:
        case USER_MANAGEMENT_ADD_REQUEST:
        case USER_MANAGEMENT_UPDATE_REQUEST:
        case USER_MANAGEMENT_STATUS_UPDATE_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
                success: false
            };

        case USER_MANAGEMENT_FETCH_SUCCESS:
            return {
                ...state,
                isLoading: false,
                contactPersons: action.payload
            };

        case USER_MANAGEMENT_ADMINS_FETCH_SUCCESS:
            return {
                ...state,
                isLoading: false,
                administrators: action.payload
            };

        case USER_MANAGEMENT_ADD_SUCCESS:
        case USER_MANAGEMENT_UPDATE_SUCCESS:
        case USER_MANAGEMENT_STATUS_UPDATE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                success: true
            };

        case USER_MANAGEMENT_FETCH_FAILURE:
        case USER_MANAGEMENT_ADMINS_FETCH_FAILURE:
        case USER_MANAGEMENT_ADD_FAILURE:
        case USER_MANAGEMENT_UPDATE_FAILURE:
        case USER_MANAGEMENT_STATUS_UPDATE_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
                success: false
            };

        case USER_MANAGEMENT_VALIDATE_FIELD_REQUEST:
            return {
                ...state,
                validation: {
                    ...state.validation,
                    isValidating: true
                }
            };

        case USER_MANAGEMENT_VALIDATE_FIELD_SUCCESS:
            return {
                ...state,
                validation: {
                    ...state.validation,
                    isValidating: false,
                    [`${action.field}Error`]: action.error
                }
            };

        case USER_MANAGEMENT_VALIDATE_FIELD_FAILURE:
            return {
                ...state,
                validation: {
                    ...state.validation,
                    isValidating: false,
                    error: action.payload
                }
            };

        case USER_MANAGEMENT_CLEAR_ERRORS:
            return {
                ...state,
                error: null,
                validation: {
                    ...state.validation,
                    phoneError: '',
                    emailError: ''
                }
            };

        default:
            return state;
    }
};

export default userManagementReducer;
