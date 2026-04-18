import {
    GET_ALL_GATE_PASSES_REQUEST,
    GET_ALL_GATE_PASSES_SUCCESS,
    GET_ALL_GATE_PASSES_FAILURE,
    ADD_GATE_PASS_REQUEST,
    ADD_GATE_PASS_SUCCESS,
    ADD_GATE_PASS_FAILURE,
    GET_GATE_PASS_BY_ID_REQUEST,
    GET_GATE_PASS_BY_ID_SUCCESS,
    GET_GATE_PASS_BY_ID_FAILURE,
    UPDATE_GP_STATUS_REQUEST,
    UPDATE_GP_STATUS_SUCCESS,
    UPDATE_GP_STATUS_FAILURE
} from "../constants/GatePassConstants";

const initialState = {
    isLoading: false,
    gatePasses: [],
    gatePass: null,
    error: null,
};

const gatePassReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_GATE_PASSES_REQUEST:
        case ADD_GATE_PASS_REQUEST:
        case GET_GATE_PASS_BY_ID_REQUEST:
        case UPDATE_GP_STATUS_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case GET_ALL_GATE_PASSES_SUCCESS:
            return {
                ...state,
                isLoading: false,
                gatePasses: action.payload,
                error: null,
            };
        case ADD_GATE_PASS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                error: null,
            };
        case GET_GATE_PASS_BY_ID_SUCCESS:
            return {
                ...state,
                isLoading: false,
                gatePass: action.payload,
                error: null,
            };
        case UPDATE_GP_STATUS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                error: null,
            };
        case GET_ALL_GATE_PASSES_FAILURE:
        case ADD_GATE_PASS_FAILURE:
        case GET_GATE_PASS_BY_ID_FAILURE:
        case UPDATE_GP_STATUS_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};

export default gatePassReducer;
