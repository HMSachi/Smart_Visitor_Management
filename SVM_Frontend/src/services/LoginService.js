import axios from 'axios';

const GetLogin = async (email, password) => {
    const remoteUrl = 'https://visitormanagement.dockyardsoftware.com/Administrator/LoginAdministrator';
    const url = process.env.NODE_ENV === 'development' ? '/api/Administrator/LoginAdministrator' : remoteUrl;
    try {
        const response = await axios.get(url, {
            params: {
                VA_Email: email,
                VA_Password: password,
            },
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: 15000,
        });
        return response;
    } catch (err) {
        // If backend expects POST instead of GET, try POST as a fallback
        const status = err && err.response && err.response.status;
        if (!err.isNetwork && (status === 404 || status === 405 || status === 400)) {
            try {
                const postResp = await axios.post(url, null, {
                    params: {
                        VA_Email: email,
                        VA_Password: password,
                    },
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    timeout: 15000,
                });
                return postResp;
            } catch (postErr) {
                throw postErr;
            }
        }
        throw err;
    }
}

const loginService = {
    GetLogin
};

export default loginService;