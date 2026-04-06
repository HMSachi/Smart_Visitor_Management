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
    USER_MANAGEMENT_RESET_SUCCESS,
} from "../constants/UserManagementConstants";
import UserManagementService from "../services/UserManagementService";

export const FetchContactPersons = (params = {}) => {
    return async (dispatch) => {
        dispatch({ type: USER_MANAGEMENT_FETCH_REQUEST });
        try {
            let response;
            if (params.searchTerm) {
                response = await UserManagementService.SearchContactPersons(params.searchTerm);
            } else if (params.showActiveOnly) {
                response = await UserManagementService.GetActiveContactPersons();
            } else {
                response = await UserManagementService.GetAllContactPersons();
            }
            const payload = response.data?.ResultSet || [];
            dispatch({ type: USER_MANAGEMENT_FETCH_SUCCESS, payload });
        } catch (error) {
            dispatch({ type: USER_MANAGEMENT_FETCH_FAILURE, payload: error.message });
        }
    };
};

export const FetchAdministrators = () => {
    return async (dispatch) => {
        dispatch({ type: USER_MANAGEMENT_ADMINS_FETCH_REQUEST });
        try {
            const response = await UserManagementService.GetAllAdministrators();
            const payload = response.data?.ResultSet || response.data || [];
            dispatch({ type: USER_MANAGEMENT_ADMINS_FETCH_SUCCESS, payload });
        } catch (error) {
            dispatch({ type: USER_MANAGEMENT_ADMINS_FETCH_FAILURE, payload: error.message });
        }
    };
};

export const AddContactPerson = (name, department, email, phone) => {
    return async (dispatch) => {
        dispatch({ type: USER_MANAGEMENT_ADD_REQUEST });
        try {
            await UserManagementService.AddContactPerson(name, department, email, phone);
            dispatch({ type: USER_MANAGEMENT_ADD_SUCCESS });
        } catch (error) {
            if (error.message === "Network Error") {
                dispatch({ type: USER_MANAGEMENT_ADD_SUCCESS });
            } else {
                dispatch({ type: USER_MANAGEMENT_ADD_FAILURE, payload: error.message });
            }
        }
    };
};

export const UpdateContactPerson = (id, name, department, email, phone) => {
    return async (dispatch) => {
        dispatch({ type: USER_MANAGEMENT_UPDATE_REQUEST });
        try {
            await UserManagementService.UpdateContactPerson(id, name, department, email, phone);
            dispatch({ type: USER_MANAGEMENT_UPDATE_SUCCESS });
        } catch (error) {
            if (error.message === "Network Error") {
                dispatch({ type: USER_MANAGEMENT_UPDATE_SUCCESS });
            } else {
                dispatch({ type: USER_MANAGEMENT_UPDATE_FAILURE, payload: error.message });
            }
        }
    };
};

export const UpdateContactPersonStatus = (id, status) => {
    return async (dispatch) => {
        dispatch({ type: USER_MANAGEMENT_STATUS_UPDATE_REQUEST });
        try {
            await UserManagementService.UpdateContactPersonStatus(id, status);
            dispatch({ type: USER_MANAGEMENT_STATUS_UPDATE_SUCCESS });
            dispatch(FetchContactPersons());
        } catch (error) {
            if (error.message === "Network Error") {
                dispatch({ type: USER_MANAGEMENT_STATUS_UPDATE_SUCCESS });
                setTimeout(() => dispatch(FetchContactPersons()), 2500);
            } else {
                dispatch({ type: USER_MANAGEMENT_STATUS_UPDATE_FAILURE, payload: error.message });
            }
        }
    };
};

export const ValidateUniqueness = (field, value, id = '0') => {
    return async (dispatch) => {
        dispatch({ type: USER_MANAGEMENT_VALIDATE_FIELD_REQUEST, field });
        try {
            let response;
            let isDuplicate = false;
            let errorMessage = '';

            if (field === 'phone') {
                response = await UserManagementService.GetContactPersonByPhone(id, value);
                if (response.data && response.data.ResultSet && response.data.ResultSet.length > 0) {
                    isDuplicate = true;
                    errorMessage = 'This phone number is already registered.';
                }
            } else if (field === 'email') {
                response = await UserManagementService.GetContactPersonByEmail(value);
                if (response.data && response.data.ResultSet && response.data.ResultSet.length > 0) {
                    const existingPerson = response.data.ResultSet[0];
                    if (String(existingPerson.VCP_Contact_person_id) !== String(id)) {
                        isDuplicate = true;
                        errorMessage = 'This email is already registered.';
                    }
                }
            }

            dispatch({ 
                type: USER_MANAGEMENT_VALIDATE_FIELD_SUCCESS, 
                field, 
                isValid: !isDuplicate, 
                error: errorMessage 
            });
        } catch (error) {
            dispatch({ type: USER_MANAGEMENT_VALIDATE_FIELD_FAILURE, field, payload: error.message });
        }
    };
};

export const ClearUserManagementErrors = () => ({ type: USER_MANAGEMENT_CLEAR_ERRORS });
export const ResetUserManagementSuccess = () => ({ type: USER_MANAGEMENT_RESET_SUCCESS });
