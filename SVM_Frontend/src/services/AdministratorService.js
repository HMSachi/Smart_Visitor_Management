import axios from 'axios';

const GetAllAdministrator = async () => {
    let config = {
        method: 'get',
        url: 'https://visitormanagement.dockyardsoftware.com/Administrator/GetAllAdministrator'
    };
    return axios.request(config).then((response) => {
        return response;
    });
}

const AddAdministrator = async (adminData) => {
    let config = {
        method: 'post',
        url: `https://visitormanagement.dockyardsoftware.com/Administrator/AddAdministrator?VA_Name=${adminData.VA_Name}&VA_Role=${adminData.VA_Role}&VA_Email=${adminData.VA_Email}&VA_Password=${adminData.VA_Password}`
    };
    return axios.request(config).then((response) => response);
}

const UpdateAdministrator = async (adminData) => {
    let config = {
        method: 'post',
        url: `https://visitormanagement.dockyardsoftware.com/Administrator/UpdateAdministrator?VA_Name=${adminData.VA_Name}&VA_Role=${adminData.VA_Role}&VA_Email=${adminData.VA_Email}&VA_Password=${adminData.VA_Password}&VA_Admin_id=${adminData.VA_Admin_id}`
    };
    return axios.request(config).then((response) => response);
}

const GetAdministratorById = async (id) => {
    let config = {
        method: 'get',
        url: `https://visitormanagement.dockyardsoftware.com/Administrator/GetAdministratorById?VA_Admin_id=${id}`
    };
    return axios.request(config).then((response) => response);
}

const DeleteAdministrator = async (id, status) => {
    let config = {
        method: 'post',
        url: `https://visitormanagement.dockyardsoftware.com/Administrator/DeleteAdministrator?VA_Admin_id=${id}&VA_Status=${status}`
    };
    return axios.request(config).then((response) => response);
}

export default {
    GetAllAdministrator,
    AddAdministrator,
    UpdateAdministrator,
    GetAdministratorById,
    DeleteAdministrator
};
