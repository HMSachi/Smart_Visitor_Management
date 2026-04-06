import {
    LOGIN_REQUEST, 
    LOGIN_SUCCESS, 
    LOGIN_FAILURE
} from '../constants/LoginConstants';
import loginService from '../services/LoginService';

export const GetLogin = (email, password) => {
    return async (dispatch) => {
        dispatch({ type: LOGIN_REQUEST });
        try {
            const response = await loginService.GetLogin(email, password);
            if (response.data) {
                localStorage.setItem('user_session', JSON.stringify(response.data));
            }
            dispatch({ type: LOGIN_SUCCESS, payload: response.data });
        } catch (error) {
            dispatch({ type: LOGIN_FAILURE, payload: error.message });
        }
    };
};