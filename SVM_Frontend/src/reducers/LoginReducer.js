import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
} from "../constants/LoginConstants";

const persistedUser = localStorage.getItem('user_session');
const initialState = {
  isLoading: false,
  user: persistedUser ? JSON.parse(persistedUser) : null,
  error: null,
};

const loginReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST: 
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        isLoading: false,
        user: action.payload,
        error: null,
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        isLoading: false,
        user: null,
        error: action.payload,
      };
    case LOGOUT:
      return {
        ...state,
        isLoading: false,
        user: null,
        error: null,
      };
    default:
      return state;
  }
};

export default loginReducer;
