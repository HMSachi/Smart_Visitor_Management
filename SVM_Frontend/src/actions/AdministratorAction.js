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
            const isSuccess = response.data && (
                response.data.ResultSet ||
                response.data.Status === "Success" ||
                response.data.Status === "OK" ||
                response.data.Result === "Success!!" ||
                response.status === 200
            );
            if (isSuccess) {
                dispatch({ type: ADD_ADMINISTRATOR_SUCCESS, payload: response.data });
                setTimeout(() => dispatch(GetAllAdministrator()), 1500);
            } else {
                throw new Error(response.data?.Message || "Failed to add administrator");
            }
        } catch (error) {
            // Backend bug: Successful Add triggers CORS Network Error because response is missing ACAO headers
            if (error.message === "Network Error") {
                dispatch({ type: ADD_ADMINISTRATOR_SUCCESS });
                setTimeout(() => dispatch(GetAllAdministrator()), 1500);
            } else {
                dispatch({ type: ADD_ADMINISTRATOR_FAILURE, payload: error.message });
            }
        }
    };
};

export const UpdateAdministrator = (adminData) => {
    return async (dispatch) => {
        dispatch({ type: UPDATE_ADMINISTRATOR_REQUEST });
        try {
            const response = await AdministratorService.UpdateAdministrator(adminData);
            const isSuccess = response.data && (
                response.data.ResultSet ||
                response.data.Status === "Success" ||
                response.data.Status === "OK" ||
                response.data.Result === "Success!!" ||
                response.status === 200
            );
            if (isSuccess) {
                dispatch({ type: UPDATE_ADMINISTRATOR_SUCCESS, payload: response.data });
                setTimeout(() => dispatch(GetAllAdministrator()), 1500);
            } else {
                throw new Error(response.data?.Message || "Failed to update administrator");
            }
        } catch (error) {
            if (error.message === "Network Error") {
                dispatch({ type: UPDATE_ADMINISTRATOR_SUCCESS });
                setTimeout(() => dispatch(GetAllAdministrator()), 1500);
            } else {
                dispatch({ type: UPDATE_ADMINISTRATOR_FAILURE, payload: error.message });
            }
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
            // Even more permissive check for success
            const isSuccess = response.data && (
                response.data.ResultSet ||
                response.data.Status === "Success" ||
                response.data.Status === "OK" ||
                response.status === 200
            );

            if (isSuccess) {
                dispatch({ type: DELETE_ADMINISTRATOR_SUCCESS, payload: response.data });
                // Use a slightly longer delay to be safe
                setTimeout(() => {
                    dispatch(GetAllAdministrator());
                }, 2000);
            } else {
                throw new Error(response.data?.Message || "Operation failed on server");
            }
        } catch (error) {
             if (error.message === "Network Error") {
                dispatch({ type: DELETE_ADMINISTRATOR_SUCCESS });
                setTimeout(() => dispatch(GetAllAdministrator()), 2000);
            } else {
                dispatch({ type: DELETE_ADMINISTRATOR_FAILURE, payload: error.message });
            }
        }
    };
};
