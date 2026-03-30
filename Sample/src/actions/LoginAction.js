import {
    ATTENDANCE_REQUEST, 
    ATTENDANCE_SUCCESS, 
    ATTENDANCE_FAILURE
} from '../constants/LoginConstants';
import loginService from '../services/LoginService';

export const GetLogin = () => {
    return async (dispatch) => {
        dispatch({ type: ATTENDANCE_REQUEST });
        try {
            const response = await loginService.GetLogin();
            dispatch({ type: ATTENDANCE_SUCCESS, payload: response.data });
        } catch (error) {
            dispatch({ type: ATTENDANCE_FAILURE, payload: error.message });
        }
    };
};