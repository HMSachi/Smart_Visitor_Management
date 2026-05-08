import PlacesService from "../services/PlacesService";
import {
  GET_ALL_PLACES_REQUEST,
  GET_ALL_PLACES_SUCCESS,
  GET_ALL_PLACES_FAILURE,
  GET_PLACE_BY_ID_REQUEST,
  GET_PLACE_BY_ID_SUCCESS,
  GET_PLACE_BY_ID_FAILURE,
  ADD_PLACE_REQUEST,
  ADD_PLACE_SUCCESS,
  ADD_PLACE_FAILURE,
  UPDATE_PLACE_REQUEST,
  UPDATE_PLACE_SUCCESS,
  UPDATE_PLACE_FAILURE,
  UPDATE_PLACE_STATUS_REQUEST,
  UPDATE_PLACE_STATUS_SUCCESS,
  UPDATE_PLACE_STATUS_FAILURE,
} from "../constants/PlacesConstants";

export const GetAllPlaces = (status = null) => {
  return async (dispatch) => {
    dispatch({ type: GET_ALL_PLACES_REQUEST });
    try {
      const response = await PlacesService.GetAllPlaces(status);
      const payloadData = response.data?.ResultSet || response.data || [];
      dispatch({ type: GET_ALL_PLACES_SUCCESS, payload: payloadData });
    } catch (error) {
      dispatch({ type: GET_ALL_PLACES_FAILURE, payload: error.message });
    }
  };
};

export const GetPlaceById = (id) => {
  return async (dispatch) => {
    dispatch({ type: GET_PLACE_BY_ID_REQUEST });
    try {
      const response = await PlacesService.GetPlaceById(id);
      const payloadData = response.data?.ResultSet || response.data || {};
      dispatch({ type: GET_PLACE_BY_ID_SUCCESS, payload: payloadData });
      return payloadData;
    } catch (error) {
      dispatch({ type: GET_PLACE_BY_ID_FAILURE, payload: error.message });
      throw error;
    }
  };
};

export const AddPlace = (placeData) => {
  return async (dispatch) => {
    dispatch({ type: ADD_PLACE_REQUEST });
    try {
      const response = await PlacesService.AddPlace(placeData);
      const isSuccess =
        response.data &&
        (response.data.ResultSet ||
          response.data.Status === "Success" ||
          response.data.ResultCode === "1000" ||
          response.data.Status === "OK" ||
          response.status === 200);

      if (isSuccess) {
        dispatch({ type: ADD_PLACE_SUCCESS, payload: response.data });
        setTimeout(() => dispatch(GetAllPlaces()), 1500);
        return response.data;
      } else {
        throw new Error(response.data?.ResultMessage || "Failed to add place");
      }
    } catch (error) {
      if (error.message === "Network Error") {
        dispatch({ type: ADD_PLACE_SUCCESS });
        setTimeout(() => dispatch(GetAllPlaces()), 1500);
        return { Status: "Success" };
      } else {
        dispatch({ type: ADD_PLACE_FAILURE, payload: error.message });
        throw error;
      }
    }
  };
};

export const UpdatePlace = (placeData) => {
  return async (dispatch) => {
    dispatch({ type: UPDATE_PLACE_REQUEST });
    try {
      const response = await PlacesService.UpdatePlace(placeData);
      const isSuccess =
        response.data &&
        (response.data.ResultSet ||
          response.data.Status === "Success" ||
          response.data.ResultCode === "1000" ||
          response.data.Status === "OK" ||
          response.status === 200);

      if (isSuccess) {
        dispatch({ type: UPDATE_PLACE_SUCCESS, payload: response.data });
        setTimeout(() => dispatch(GetAllPlaces()), 1500);
        return response.data;
      } else {
        throw new Error(response.data?.ResultMessage || "Failed to update place");
      }
    } catch (error) {
      if (error.message === "Network Error") {
        dispatch({ type: UPDATE_PLACE_SUCCESS });
        setTimeout(() => dispatch(GetAllPlaces()), 1500);
        return { Status: "Success" };
      } else {
        dispatch({ type: UPDATE_PLACE_FAILURE, payload: error.message });
        throw error;
      }
    }
  };
};

export const UpdatePlaceStatus = (id, status, uid) => {
  return async (dispatch) => {
    dispatch({ type: UPDATE_PLACE_STATUS_REQUEST });
    try {
      const response = await PlacesService.UpdatePlaceStatus(id, status, uid);
      const isSuccess =
        response.data &&
        (response.data.ResultSet ||
          response.data.Status === "Success" ||
          response.data.ResultCode === "1000" ||
          response.data.Status === "OK" ||
          response.status === 200);

      if (isSuccess) {
        dispatch({ type: UPDATE_PLACE_STATUS_SUCCESS, payload: response.data });
        setTimeout(() => dispatch(GetAllPlaces()), 1500);
        return response.data;
      } else {
        throw new Error(response.data?.ResultMessage || "Failed to update place status");
      }
    } catch (error) {
      if (error.message === "Network Error") {
        dispatch({ type: UPDATE_PLACE_STATUS_SUCCESS });
        setTimeout(() => dispatch(GetAllPlaces()), 1500);
        return { Status: "Success" };
      } else {
        dispatch({ type: UPDATE_PLACE_STATUS_FAILURE, payload: error.message });
        throw error;
      }
    }
  };
};
