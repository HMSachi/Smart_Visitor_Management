import {
    GET_ALL_VEHICLES_REQUEST,
    GET_ALL_VEHICLES_SUCCESS,
    GET_ALL_VEHICLES_FAILURE,
    ADD_VEHICLE_REQUEST,
    ADD_VEHICLE_SUCCESS,
    ADD_VEHICLE_FAILURE,
    UPDATE_VEHICLE_REQUEST,
    UPDATE_VEHICLE_SUCCESS,
    UPDATE_VEHICLE_FAILURE,
    GET_VEHICLE_BY_ID_REQUEST,
    GET_VEHICLE_BY_ID_SUCCESS,
    GET_VEHICLE_BY_ID_FAILURE,
    UPDATE_VEHICLE_STATUS_REQUEST,
    UPDATE_VEHICLE_STATUS_SUCCESS,
    UPDATE_VEHICLE_STATUS_FAILURE,
    GET_VEHICLE_BY_NUMBER_REQUEST,
    GET_VEHICLE_BY_NUMBER_SUCCESS,
    GET_VEHICLE_BY_NUMBER_FAILURE
} from "../constants/VehicleConstants";
import VehicleService from "../services/VehicleService";

export const GetAllVehicles = () => {
    return async (dispatch) => {
        dispatch({ type: GET_ALL_VEHICLES_REQUEST });
        try {
            const response = await VehicleService.GetAllVehicles();
            const payloadData = response.data?.ResultSet || response.data || [];
            dispatch({ type: GET_ALL_VEHICLES_SUCCESS, payload: payloadData });
        } catch (error) {
            dispatch({ type: GET_ALL_VEHICLES_FAILURE, payload: error.message });
        }
    };
};

export const AddVehicle = (vehicleData) => {
    return async (dispatch) => {
        dispatch({ type: ADD_VEHICLE_REQUEST });
        try {
            const response = await VehicleService.AddVehicle(vehicleData);
            const isSuccess = response.data && (
                response.data.ResultSet ||
                response.data.Status === "Success" ||
                response.data.Status === "OK" ||
                response.status === 200
            );
            if (isSuccess) {
                dispatch({ type: ADD_VEHICLE_SUCCESS, payload: response.data });
                setTimeout(() => dispatch(GetAllVehicles()), 1500);
                return response.data;
            } else {
                throw new Error(response.data?.Message || "Failed to add vehicle");
            }
        } catch (error) {
            if (error.message === "Network Error") {
                dispatch({ type: ADD_VEHICLE_SUCCESS });
                setTimeout(() => dispatch(GetAllVehicles()), 1500);
                return { Status: "Success" };
            } else {
                dispatch({ type: ADD_VEHICLE_FAILURE, payload: error.message });
                throw error;
            }
        }
    };
};

export const UpdateVehicle = (vehicleData) => {
    return async (dispatch) => {
        dispatch({ type: UPDATE_VEHICLE_REQUEST });
        try {
            const response = await VehicleService.UpdateVehicle(vehicleData);
            const isSuccess = response.data && (
                response.data.ResultSet ||
                response.data.Status === "Success" ||
                response.data.Status === "OK" ||
                response.status === 200
            );
            if (isSuccess) {
                dispatch({ type: UPDATE_VEHICLE_SUCCESS, payload: response.data });
                setTimeout(() => dispatch(GetAllVehicles()), 1500);
                return response.data;
            } else {
                throw new Error(response.data?.Message || "Failed to update vehicle");
            }
        } catch (error) {
            if (error.message === "Network Error") {
                dispatch({ type: UPDATE_VEHICLE_SUCCESS });
                setTimeout(() => dispatch(GetAllVehicles()), 1500);
                return { Status: "Success" };
            } else {
                dispatch({ type: UPDATE_VEHICLE_FAILURE, payload: error.message });
                throw error;
            }
        }
    };
};

export const GetVehicleById = (id) => {
    return async (dispatch) => {
        dispatch({ type: GET_VEHICLE_BY_ID_REQUEST });
        try {
            const response = await VehicleService.GetVehicleById(id);
            const payloadData = response.data?.ResultSet || response.data || [];
            dispatch({ type: GET_VEHICLE_BY_ID_SUCCESS, payload: payloadData });
        } catch (error) {
            dispatch({ type: GET_VEHICLE_BY_ID_FAILURE, payload: error.message });
        }
    };
};

export const UpdateVehicleStatus = (id, status) => {
    return async (dispatch) => {
        dispatch({ type: UPDATE_VEHICLE_STATUS_REQUEST });
        try {
            const response = await VehicleService.UpdateVehicleStatus(id, status);
            const isSuccess = response.data && (
                response.data.ResultSet ||
                response.data.Status === "Success" ||
                response.data.Status === "OK" ||
                response.status === 200
            );
            if (isSuccess) {
                dispatch({ type: UPDATE_VEHICLE_STATUS_SUCCESS, payload: response.data });
                setTimeout(() => dispatch(GetAllVehicles()), 1500);
                return response.data;
            } else {
                throw new Error(response.data?.Message || "Failed to update vehicle status");
            }
        } catch (error) {
            if (error.message === "Network Error") {
                dispatch({ type: UPDATE_VEHICLE_STATUS_SUCCESS });
                setTimeout(() => dispatch(GetAllVehicles()), 1500);
                return { Status: "Success" };
            } else {
                dispatch({ type: UPDATE_VEHICLE_STATUS_FAILURE, payload: error.message });
                throw error;
            }
        }
    };
};

export const GetVehicleByNumber = (number) => {
    return async (dispatch) => {
        dispatch({ type: GET_VEHICLE_BY_NUMBER_REQUEST });
        try {
            const response = await VehicleService.GetVehicleByNumber(number);
            const payloadData = response.data?.ResultSet || response.data || [];
            dispatch({ type: GET_VEHICLE_BY_NUMBER_SUCCESS, payload: payloadData });
        } catch (error) {
            dispatch({ type: GET_VEHICLE_BY_NUMBER_FAILURE, payload: error.message });
        }
    };
};
