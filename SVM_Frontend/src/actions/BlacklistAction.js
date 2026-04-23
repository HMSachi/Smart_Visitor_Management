import BlacklistService from "../services/BlacklistService";
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

export const GetAllBlacklist = () => {
    return async (dispatch) => {
        dispatch({ type: GET_ALL_BLACKLIST_REQUEST });
        try {
            const response = await BlacklistService.GetAllBlacklist();
            const payloadData = response.data?.ResultSet || response.data || [];
            dispatch({ type: GET_ALL_BLACKLIST_SUCCESS, payload: payloadData });
        } catch (error) {
            dispatch({ type: GET_ALL_BLACKLIST_FAILURE, payload: error.message });
        }
    };
};

export const GetBlacklistById = (id) => {
    return async (dispatch) => {
        dispatch({ type: GET_BLACKLIST_BY_ID_REQUEST });
        try {
            const response = await BlacklistService.GetBlacklistById(id);
            const payloadData = response.data?.ResultSet || response.data || [];
            dispatch({ type: GET_BLACKLIST_BY_ID_SUCCESS, payload: payloadData });
        } catch (error) {
            dispatch({ type: GET_BLACKLIST_BY_ID_FAILURE, payload: error.message });
        }
    };
};

export const AddBlacklist = (blacklistData) => {
    return async (dispatch) => {
        dispatch({ type: ADD_BLACKLIST_REQUEST });
        try {
            const response = await BlacklistService.AddBlacklist(blacklistData);
            const isSuccess = response.data && (
                response.data.ResultSet ||
                response.data.Status === "Success" ||
                response.data.Status === "OK" ||
                response.status === 200
            );
            if (isSuccess) {
                dispatch({ type: ADD_BLACKLIST_SUCCESS, payload: response.data });
                setTimeout(() => dispatch(GetAllBlacklist()), 1500);
                return response.data;
            } else {
                throw new Error(response.data?.Message || "Failed to add to blacklist");
            }
        } catch (error) {
            if (error.message === "Network Error") {
                dispatch({ type: ADD_BLACKLIST_SUCCESS });
                setTimeout(() => dispatch(GetAllBlacklist()), 1500);
                return { Status: "Success" };
            } else {
                dispatch({ type: ADD_BLACKLIST_FAILURE, payload: error.message });
                throw error;
            }
        }
    };
};

export const UpdateBlacklist = (blacklistData) => {
    return async (dispatch) => {
        dispatch({ type: UPDATE_BLACKLIST_REQUEST });
        try {
            const response = await BlacklistService.UpdateBlacklist(blacklistData);
            const isSuccess = response.data && (
                response.data.ResultSet ||
                response.data.Status === "Success" ||
                response.data.Status === "OK" ||
                response.status === 200
            );
            if (isSuccess) {
                dispatch({ type: UPDATE_BLACKLIST_SUCCESS, payload: response.data });
                setTimeout(() => dispatch(GetAllBlacklist()), 1500);
                return response.data;
            } else {
                throw new Error(response.data?.Message || "Failed to update blacklist");
            }
        } catch (error) {
            if (error.message === "Network Error") {
                dispatch({ type: UPDATE_BLACKLIST_SUCCESS });
                setTimeout(() => dispatch(GetAllBlacklist()), 1500);
                return { Status: "Success" };
            } else {
                dispatch({ type: UPDATE_BLACKLIST_FAILURE, payload: error.message });
                throw error;
            }
        }
    };
};

export const UpdateBlacklistStatus = (id, status) => {
    return async (dispatch) => {
        dispatch({ type: UPDATE_BLACKLIST_STATUS_REQUEST });
        try {
            const response = await BlacklistService.UpdateBlacklistStatus(id, status);
            const isSuccess = response.data && (
                response.data.ResultSet ||
                response.data.Status === "Success" ||
                response.data.Status === "OK" ||
                response.status === 200
            );
            if (isSuccess) {
                dispatch({ type: UPDATE_BLACKLIST_STATUS_SUCCESS, payload: response.data });
                setTimeout(() => dispatch(GetAllBlacklist()), 1500);
                return response.data;
            } else {
                throw new Error(response.data?.Message || "Failed to update blacklist status");
            }
        } catch (error) {
            if (error.message === "Network Error") {
                dispatch({ type: UPDATE_BLACKLIST_STATUS_SUCCESS });
                setTimeout(() => dispatch(GetAllBlacklist()), 1500);
                return { Status: "Success" };
            } else {
                dispatch({ type: UPDATE_BLACKLIST_STATUS_FAILURE, payload: error.message });
                throw error;
            }
        }
    };
};
