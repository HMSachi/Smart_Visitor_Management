import axios from 'axios';

const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || 'https://visitormanagement.dockyardsoftware.com';
const LOGIN_PATH = '/Administrator/LoginAdministrator';

const getLoginUrl = () => {
    // Local dev uses CRA proxy (`/api`), hosted uses configured API base URL.
    if (process.env.NODE_ENV === 'development') {
        return `/api${LOGIN_PATH}`;
    }
    return `${API_BASE_URL}${LOGIN_PATH}`;
};

const GetLogin = async (email, password) => {
    const url = getLoginUrl();
    const params = {
        VA_Email: email,
        VA_Password: password,
    };

    try {
        // Try POST first (matches backend login semantics in most hosted environments).
        const response = await axios.post(url, null, {
            params,
            headers: {
                Accept: 'application/json',
            },
            timeout: 15000,
        });
        return response;
    } catch (postError) {
        // Backward-compatible fallback for older backend routes that still expect GET.
        try {
            const getResp = await axios.get(url, {
                params,
                headers: {
                    Accept: 'application/json',
                },
                timeout: 15000,
            });
            return getResp;
        } catch (getError) {
            // Return the original POST error if both fail and GET gave no richer response.
            if (!getError.response && postError.response) {
                throw postError;
            }
            throw getError;
        }
    }
}

const loginService = {
    GetLogin
};

export default loginService;
