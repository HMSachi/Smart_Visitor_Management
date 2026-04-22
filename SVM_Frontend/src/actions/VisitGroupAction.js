import {
    GET_ALL_VISIT_GROUP_REQUEST,
    GET_ALL_VISIT_GROUP_SUCCESS,
    GET_ALL_VISIT_GROUP_FAILURE,
    GET_VISIT_GROUP_BY_ID_REQUEST,
    GET_VISIT_GROUP_BY_ID_SUCCESS,
    GET_VISIT_GROUP_BY_ID_FAILURE,
    ADD_VISIT_GROUP_REQUEST,
    ADD_VISIT_GROUP_SUCCESS,
    ADD_VISIT_GROUP_FAILURE,
    UPDATE_VISIT_GROUP_REQUEST,
    UPDATE_VISIT_GROUP_SUCCESS,
    UPDATE_VISIT_GROUP_FAILURE,
    UPDATE_VISIT_GROUP_STATUS_REQUEST,
    UPDATE_VISIT_GROUP_STATUS_SUCCESS,
    UPDATE_VISIT_GROUP_STATUS_FAILURE
} from '../constants/VisitGroupConstants';
import VisitGroupService from '../services/VisitGroupService';

export const GetAllVisitGroup = () => async (dispatch) => {
    try {
        dispatch({ type: GET_ALL_VISIT_GROUP_REQUEST });
        const response = await VisitGroupService.GetAllVisitGroup();
        dispatch({
            type: GET_ALL_VISIT_GROUP_SUCCESS,
            payload: response.data
        });
    } catch (error) {
        dispatch({
            type: GET_ALL_VISIT_GROUP_FAILURE,
            payload: error.message
        });
    }
};

export const GetVisitGroupById = (id) => async (dispatch) => {
    try {
        dispatch({ type: GET_VISIT_GROUP_BY_ID_REQUEST });
        const response = await VisitGroupService.GetVisitGroupById(id);
        dispatch({
            type: GET_VISIT_GROUP_BY_ID_SUCCESS,
            payload: response.data
        });
    } catch (error) {
        dispatch({
            type: GET_VISIT_GROUP_BY_ID_FAILURE,
            payload: error.message
        });
    }
};

export const AddVisitGroup = (groupData) => async (dispatch) => {
    try {
        dispatch({ type: ADD_VISIT_GROUP_REQUEST });
        const response = await VisitGroupService.AddVisitGroup(groupData);
        dispatch({
            type: ADD_VISIT_GROUP_SUCCESS,
            payload: response.data
        });
        return response.data;
    } catch (error) {
        dispatch({
            type: ADD_VISIT_GROUP_FAILURE,
            payload: error.message
        });
        throw error;
    }
};

export const UpdateVisitGroup = (groupData) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_VISIT_GROUP_REQUEST });
        const response = await VisitGroupService.UpdateVisitGroup(groupData);
        dispatch({
            type: UPDATE_VISIT_GROUP_SUCCESS,
            payload: response.data
        });
        return response.data;
    } catch (error) {
        dispatch({
            type: UPDATE_VISIT_GROUP_FAILURE,
            payload: error.message
        });
        throw error;
    }
};

export const UpdateVisitGroupStatus = (id, status) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_VISIT_GROUP_STATUS_REQUEST });
        const response = await VisitGroupService.UpdateVisitGroupStatus(id, status);
        dispatch({
            type: UPDATE_VISIT_GROUP_STATUS_SUCCESS,
            payload: response.data
        });
    } catch (error) {
        dispatch({
            type: UPDATE_VISIT_GROUP_STATUS_FAILURE,
            payload: error.message
        });
    }
};
