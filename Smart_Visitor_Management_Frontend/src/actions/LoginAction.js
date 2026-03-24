import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAILURE
} from '../constants/LoginConstants';
import loginService from '../services/LoginService';

export const fetchData = () => {
    return async (dispatch) => {
        dispatch({ type: LOGIN_REQUEST });
        try {
            const response = await loginService.GetLogin();
            dispatch({ type: LOGIN_SUCCESS, payload: response.data });
        } catch (error) {
            dispatch({ type: LOGIN_FAILURE, payload: error.message });
        }
    };
};

export const GetLogin = fetchData;