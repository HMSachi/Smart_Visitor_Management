import axios from 'axios';

const AddContactPerson = async (name, department, email, phone) => {
    let config = {
        method: 'post',
        url: `https://visitormanagement.dockyardsoftware.com/ContactPerson/AddContactPerson?VCP_Name=${encodeURIComponent(name)}&VCP_Department=${encodeURIComponent(department)}&VCP_Email=${encodeURIComponent(email)}&VCP_Phone=${encodeURIComponent(phone)}`
    };
    return axios.request(config).then((response) => {
        return response;
    });
}

const UpdateContactPerson = async (id, name, department, email, phone) => {
    let config = {
        method: 'post',
        url: `https://visitormanagement.dockyardsoftware.com/ContactPerson/UpdateContactPerson?VCP_Contact_person_id=${encodeURIComponent(id)}&VCP_Name=${encodeURIComponent(name)}&VCP_Department=${encodeURIComponent(department)}&VCP_Email=${encodeURIComponent(email)}&VCP_Phone=${encodeURIComponent(phone)}`
    };
    return axios.request(config).then((response) => {
        return response;
    });
}

const GetAllContactPersons = async () => {
    let config = {
        method: 'get',
        url: 'https://visitormanagement.dockyardsoftware.com/ContactPerson/GetAllContactPersons'
    };
    return axios.request(config).then((response) => {
        return response;
    });
}

const GetContactPersonById = async (id) => {
    let config = {
        method: 'get',
        url: `https://visitormanagement.dockyardsoftware.com/ContactPerson/GetContactPersonById?VCP_Contact_person_id=${encodeURIComponent(id)}`
    };
    return axios.request(config).then((response) => {
        return response;
    });
}

const GetContactPersonByPhone = async (id, phone) => {
    let config = {
        method: 'get',
        url: `https://visitormanagement.dockyardsoftware.com/ContactPerson/GetContactPersonByPhone?VCP_Contact_person_id=${encodeURIComponent(id)}&VCP_Phone=${encodeURIComponent(phone)}`
    };
    return axios.request(config).then((response) => {
        return response;
    });
}

const contactPersonService = {
    AddContactPerson,
    UpdateContactPerson,
    GetAllContactPersons,
    GetContactPersonById,
    GetContactPersonByPhone
};

export default contactPersonService;
