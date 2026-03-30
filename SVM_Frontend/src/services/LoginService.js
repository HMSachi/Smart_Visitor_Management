import axios from 'axios';

 
const GetLogin = async () => {

    let config = {
        method: 'get',
        url: 'login/login' 
};
return axios.request(config).then((response) =>{
    return response;
});
}

const loginService = {
    GetLogin
};

export default loginService;