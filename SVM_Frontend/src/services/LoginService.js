import axios from 'axios';

 
const GetLogin = async (email, password) => {
    let config = {
        method: 'post',
        url: `https://visitormanagement.dockyardsoftware.com/Administrator/LoginAdministrator?VA_Email=${email}&VA_Password=${password}` 
    };
    return axios.request(config).then((response) =>{
        return response;
    });
}

const loginService = {
    GetLogin
};

export default loginService;