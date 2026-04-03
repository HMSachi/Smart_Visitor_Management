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
import AdministratorService from "../services/AdministratorService";

export const GetAllAdministrator = () => {
    return async (dispatch) => {
        dispatch({ type: GET_ALL_ADMINISTRATOR_REQUEST });
        try {
            const response = await AdministratorService.GetAllAdministrator();
            const payloadData = response.data?.ResultSet || response.data || [];
            dispatch({ type: GET_ALL_ADMINISTRATOR_SUCCESS, payload: payloadData });
        } catch (error) {
            dispatch({ type: GET_ALL_ADMINISTRATOR_FAILURE, payload: error.message });
        }
    };
};

export const AddAdministrator = (adminData) => {
    return async (dispatch) => {
        dispatch({ type: ADD_ADMINISTRATOR_REQUEST });
        try {
            const response = await AdministratorService.AddAdministrator(adminData);
            dispatch({ type: ADD_ADMINISTRATOR_SUCCESS, payload: response.data });
            dispatch(GetAllAdministrator()); // Re-fetch list
        } catch (error) {
            dispatch({ type: ADD_ADMINISTRATOR_FAILURE, payload: error.message });
        }
    };
};

export const UpdateAdministrator = (adminData) => {
    return async (dispatch) => {
        dispatch({ type: UPDATE_ADMINISTRATOR_REQUEST });
        try {
            const response = await AdministratorService.UpdateAdministrator(adminData);
            dispatch({ type: UPDATE_ADMINISTRATOR_SUCCESS, payload: response.data });
            dispatch(GetAllAdministrator()); // Re-fetch list
        } catch (error) {
            dispatch({ type: UPDATE_ADMINISTRATOR_FAILURE, payload: error.message });
        }
    };
};

export const GetAdministratorById = (id) => {
    return async (dispatch) => {
        dispatch({ type: GET_ADMINISTRATOR_BY_ID_REQUEST });
        try {
            const response = await AdministratorService.GetAdministratorById(id);
            const payloadData = response.data?.ResultSet || response.data || [];
            dispatch({ type: GET_ADMINISTRATOR_BY_ID_SUCCESS, payload: payloadData });
        } catch (error) {
            dispatch({ type: GET_ADMINISTRATOR_BY_ID_FAILURE, payload: error.message });
        }
    };
};

export const DeleteAdministrator = (id, status) => {
    return async (dispatch) => {
        dispatch({ type: DELETE_ADMINISTRATOR_REQUEST });
        try {
            const response = await AdministratorService.DeleteAdministrator(id, status);
            dispatch({ type: DELETE_ADMINISTRATOR_SUCCESS, payload: response.data });
            dispatch(GetAllAdministrator()); // Re-fetch list to reflect changes
        } catch (error) {
            dispatch({ type: DELETE_ADMINISTRATOR_FAILURE, payload: error.message });
        }
    };
};
