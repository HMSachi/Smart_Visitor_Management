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
            const payload = (error.response && error.response.data) ? error.response.data : (error.message || 'Unknown error');

            // Detailed diagnostics for debugging login failures
            console.error('Login API Error:', {
                message: error.message,
                code: error.code,
                status: error.response ? error.response.status : null,
                statusText: error.response ? error.response.statusText : null,
                requestUrl: error.config ? error.config.url : null,
                method: error.config ? error.config.method : null,
                responseData: error.response ? error.response.data : null,
            });

            dispatch({ type: LOGIN_FAILURE, payload });
        }
    };
};