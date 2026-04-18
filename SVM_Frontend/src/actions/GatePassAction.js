import GatePassService from "../services/GatePassService";
import {
    GET_ALL_GATE_PASSES_REQUEST,
    GET_ALL_GATE_PASSES_SUCCESS,
    GET_ALL_GATE_PASSES_FAILURE,
    ADD_GATE_PASS_REQUEST,
    ADD_GATE_PASS_SUCCESS,
    ADD_GATE_PASS_FAILURE,
    UPDATE_GATE_PASS_REQUEST,
    UPDATE_GATE_PASS_SUCCESS,
    UPDATE_GATE_PASS_FAILURE,
    GET_GATE_PASS_BY_ID_REQUEST,
    GET_GATE_PASS_BY_ID_SUCCESS,
    GET_GATE_PASS_BY_ID_FAILURE,
    UPDATE_GP_STATUS_REQUEST,
    UPDATE_GP_STATUS_SUCCESS,
    UPDATE_GP_STATUS_FAILURE,
    GET_ACTIVE_GATE_PASSES_REQUEST,
    GET_ACTIVE_GATE_PASSES_SUCCESS,
    GET_ACTIVE_GATE_PASSES_FAILURE
} from "../constants/GatePassConstants";

export const GetAllGatePasses = () => {
    return async (dispatch) => {
        dispatch({ type: GET_ALL_GATE_PASSES_REQUEST });
        try {
            const response = await GatePassService.GetAllGatePasses();
            const payloadData = response.data?.ResultSet || response.data || [];
            dispatch({ type: GET_ALL_GATE_PASSES_SUCCESS, payload: payloadData });
        } catch (error) {
            dispatch({ type: GET_ALL_GATE_PASSES_FAILURE, payload: error.message });
        }
    };
};

export const AddGatePass = (visitorId, requestId) => {
    return async (dispatch) => {
        dispatch({ type: ADD_GATE_PASS_REQUEST });
        try {
            const response = await GatePassService.AddGatePass(visitorId, requestId);
            const isSuccess = response.data && (
                response.data.ResultSet ||
                response.data.Status === "Success" ||
                response.data.Status === "OK" ||
                response.status === 200
            );

            if (isSuccess) {
                dispatch({ type: ADD_GATE_PASS_SUCCESS, payload: response.data });
                return response.data;
            } else {
                throw new Error(response.data?.Message || "Failed to generate gate pass");
            }
        } catch (error) {
            dispatch({ type: ADD_GATE_PASS_FAILURE, payload: error.message });
            throw error;
        }
    };
};

export const GetGatePassById = (id) => {
    return async (dispatch) => {
        dispatch({ type: GET_GATE_PASS_BY_ID_REQUEST });
        try {
            const response = await GatePassService.GetGatePassById(id);
            const payloadData = response.data?.ResultSet || response.data || [];
            dispatch({ type: GET_GATE_PASS_BY_ID_SUCCESS, payload: payloadData });
            return payloadData;
        } catch (error) {
            dispatch({ type: GET_GATE_PASS_BY_ID_FAILURE, payload: error.message });
            throw error;
        }
    };
};

export const UpdateGatePassStatus = (passId, status) => {
    return async (dispatch) => {
        dispatch({ type: UPDATE_GP_STATUS_REQUEST });
        try {
            const response = await GatePassService.UpdateGatePassStatus(passId, status);
            dispatch({ type: UPDATE_GP_STATUS_SUCCESS, payload: response.data });
        } catch (error) {
            dispatch({ type: UPDATE_GP_STATUS_FAILURE, payload: error.message });
        }
    };
};
