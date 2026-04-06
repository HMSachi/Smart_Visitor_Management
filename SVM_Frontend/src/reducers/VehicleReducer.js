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

const initialState = {
    isLoading: false,
    vehicles: [],
    vehicle: null,
    error: null,
    success: false,
};

const vehicleReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_VEHICLES_REQUEST:
        case ADD_VEHICLE_REQUEST:
        case UPDATE_VEHICLE_REQUEST:
        case GET_VEHICLE_BY_ID_REQUEST:
        case UPDATE_VEHICLE_STATUS_REQUEST:
        case GET_VEHICLE_BY_NUMBER_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
                success: false,
            };
        case GET_ALL_VEHICLES_SUCCESS:
            return {
                ...state,
                isLoading: false,
                vehicles: action.payload,
                error: null,
            };
        case ADD_VEHICLE_SUCCESS:
        case UPDATE_VEHICLE_SUCCESS:
        case UPDATE_VEHICLE_STATUS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                success: true,
                error: null,
            };
        case GET_VEHICLE_BY_ID_SUCCESS:
        case GET_VEHICLE_BY_NUMBER_SUCCESS:
            return {
                ...state,
                isLoading: false,
                vehicle: action.payload,
                error: null,
            };
        case GET_ALL_VEHICLES_FAILURE:
        case ADD_VEHICLE_FAILURE:
        case UPDATE_VEHICLE_FAILURE:
        case GET_VEHICLE_BY_ID_FAILURE:
        case UPDATE_VEHICLE_STATUS_FAILURE:
        case GET_VEHICLE_BY_NUMBER_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
                success: false,
            };
        default:
            return state;
    }
};

export default vehicleReducer;
