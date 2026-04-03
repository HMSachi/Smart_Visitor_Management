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

const UpdateContactPersonStatus = async (id, status) => {
    let config = {
        method: 'post',
        url: `https://visitormanagement.dockyardsoftware.com/ContactPerson/UpdateContactPersonStatus?VCP_Contact_person_id=${encodeURIComponent(id)}&VCP_Status=${encodeURIComponent(status)}`
    };
    return axios.request(config).then((response) => {
        return response;
    });
}

const GetContactPersonByEmail = async (email) => {
    let config = {
        method: 'get',
        url: `https://visitormanagement.dockyardsoftware.com/ContactPerson/GetContactPersonByEmail?VCP_Email=${encodeURIComponent(email)}`
    };
    return axios.request(config).then((response) => {
        return response;
    });
}

const GetActiveContactPersons = async () => {
    let config = {
        method: 'get',
        url: 'https://visitormanagement.dockyardsoftware.com/ContactPerson/GetActiveContactPersons'
    };
    return axios.request(config).then((response) => {
        return response;
    });
}

const SearchContactPersons = async (name) => {
    let config = {
        method: 'get',
        url: `https://visitormanagement.dockyardsoftware.com/ContactPerson/SearchContactPersons?VCP_Name=${encodeURIComponent(name)}`
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
    GetContactPersonByPhone,
    UpdateContactPersonStatus,
    GetContactPersonByEmail,
    GetActiveContactPersons,
    SearchContactPersons
};

export default contactPersonService;
