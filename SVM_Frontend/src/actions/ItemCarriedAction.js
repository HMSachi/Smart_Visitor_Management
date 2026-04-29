import ItemCarriedService from "../services/ItemCarriedService";
import {
    GET_ALL_ITEMS_CARRIED_REQUEST,
    GET_ALL_ITEMS_CARRIED_SUCCESS,
    GET_ALL_ITEMS_CARRIED_FAILURE,
    ADD_ITEM_REQUEST,
    ADD_ITEM_SUCCESS,
    ADD_ITEM_FAILURE,
    UPDATE_ITEM_REQUEST,
    UPDATE_ITEM_SUCCESS,
    UPDATE_ITEM_FAILURE,
    UPDATE_ITEM_STATUS_REQUEST,
    UPDATE_ITEM_STATUS_SUCCESS,
    UPDATE_ITEM_STATUS_FAILURE
} from "../constants/ItemCarriedConstants";

export const GetAllItemsCarried = () => {
    return async (dispatch) => {
        dispatch({ type: GET_ALL_ITEMS_CARRIED_REQUEST });
        try {
            const response = await ItemCarriedService.GetAllItemsCarried();
            const payloadData = response.data?.ResultSet || response.data || [];
            dispatch({ type: GET_ALL_ITEMS_CARRIED_SUCCESS, payload: payloadData });
        } catch (error) {
            dispatch({ type: GET_ALL_ITEMS_CARRIED_FAILURE, payload: error.message });
        }
    };
};

export const AddItem = (itemData) => {
    return async (dispatch) => {
        dispatch({ type: ADD_ITEM_REQUEST });
        try {
            const response = await ItemCarriedService.AddItem(itemData);
            const isSuccess = response.data && (
                response.data.ResultSet ||
                response.data.Status === "Success" ||
                response.data.Status === "OK" ||
                response.data.Result === "Success!!" ||
                response.data.StatusCode === 200 ||
                response.status === 200
            );
            if (isSuccess) {
                dispatch({ type: ADD_ITEM_SUCCESS, payload: response.data });
                setTimeout(() => dispatch(GetAllItemsCarried()), 1500);
                return response.data;
            } else {
                throw new Error(response.data?.Message || "Failed to add item");
            }
        } catch (error) {
            if (error.message === "Network Error") {
                dispatch({ type: ADD_ITEM_SUCCESS });
                setTimeout(() => dispatch(GetAllItemsCarried()), 1500);
                return { Status: "Success" };
            } else {
                dispatch({ type: ADD_ITEM_FAILURE, payload: error.message });
                throw error;
            }
        }
    };
};

export const UpdateItem = (itemData) => {
    return async (dispatch) => {
        dispatch({ type: UPDATE_ITEM_REQUEST });
        try {
            const response = await ItemCarriedService.UpdateItem(itemData);
            const isSuccess = response.data && (
                response.data.ResultSet ||
                response.data.Status === "Success" ||
                response.data.Status === "OK" ||
                response.status === 200
            );
            if (isSuccess) {
                dispatch({ type: UPDATE_ITEM_SUCCESS, payload: response.data });
                setTimeout(() => dispatch(GetAllItemsCarried()), 1500);
                return response.data;
            } else {
                throw new Error(response.data?.Message || "Failed to update item");
            }
        } catch (error) {
            if (error.message === "Network Error") {
                dispatch({ type: UPDATE_ITEM_SUCCESS });
                setTimeout(() => dispatch(GetAllItemsCarried()), 1500);
                return { Status: "Success" };
            } else {
                dispatch({ type: UPDATE_ITEM_FAILURE, payload: error.message });
                throw error;
            }
        }
    };
};

export const UpdateItemStatus = (id, status) => {
    return async (dispatch) => {
        dispatch({ type: UPDATE_ITEM_STATUS_REQUEST });
        try {
            const response = await ItemCarriedService.UpdateItemStatus(id, status);
            const isSuccess = response.data && (
                response.data.ResultSet ||
                response.data.Status === "Success" ||
                response.data.Status === "OK" ||
                response.status === 200
            );
            if (isSuccess) {
                dispatch({ type: UPDATE_ITEM_STATUS_SUCCESS, payload: response.data });
                setTimeout(() => dispatch(GetAllItemsCarried()), 1500);
                return response.data;
            } else {
                throw new Error(response.data?.Message || "Failed to update item status");
            }
        } catch (error) {
            if (error.message === "Network Error") {
                dispatch({ type: UPDATE_ITEM_STATUS_SUCCESS });
                setTimeout(() => dispatch(GetAllItemsCarried()), 1500);
                return { Status: "Success" };
            } else {
                dispatch({ type: UPDATE_ITEM_STATUS_FAILURE, payload: error.message });
                throw error;
            }
        }
    };
};
