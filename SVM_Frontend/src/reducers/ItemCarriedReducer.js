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

const initialState = {
    itemsCarried: [],
    isLoading: false,
    error: null,
};

const ItemCarriedReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_ITEMS_CARRIED_REQUEST:
        case ADD_ITEM_REQUEST:
        case UPDATE_ITEM_REQUEST:
        case UPDATE_ITEM_STATUS_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };

        case GET_ALL_ITEMS_CARRIED_SUCCESS:
            return {
                ...state,
                isLoading: false,
                itemsCarried: action.payload,
            };

        case ADD_ITEM_SUCCESS:
        case UPDATE_ITEM_SUCCESS:
        case UPDATE_ITEM_STATUS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                error: null,
            };

        case GET_ALL_ITEMS_CARRIED_FAILURE:
        case ADD_ITEM_FAILURE:
        case UPDATE_ITEM_FAILURE:
        case UPDATE_ITEM_STATUS_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };

        default:
            return state;
    }
};

export default ItemCarriedReducer;
