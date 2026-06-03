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
} from "../constants/PlacesConstants";

const initialState = {
  places: [],
  selectedPlace: null,
  loading: false,
  error: null,
};

const PlacesReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_PLACES_REQUEST:
    case GET_PLACE_BY_ID_REQUEST:
    case ADD_PLACE_REQUEST:
    case UPDATE_PLACE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_ALL_PLACES_SUCCESS:
      return {
        ...state,
        loading: false,
        places: action.payload,
        error: null,
      };
    case GET_PLACE_BY_ID_SUCCESS:
      return {
        ...state,
        loading: false,
        selectedPlace: action.payload,
        error: null,
      };
    case ADD_PLACE_SUCCESS:
    case UPDATE_PLACE_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case GET_ALL_PLACES_FAILURE:
    case GET_PLACE_BY_ID_FAILURE:
    case ADD_PLACE_FAILURE:
    case UPDATE_PLACE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default PlacesReducer;
