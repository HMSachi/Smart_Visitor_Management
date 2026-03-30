import axios from 'axios';

 
const GetLogin = async () => {

    let config = {
        method: 'get',
        url: 'login/login' 
};
return axios.requeest(config).then((response) =>{
    return response;
});
}
  
export default {
    GetLogin
};