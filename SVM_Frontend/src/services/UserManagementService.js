import axios from 'axios';

const BASE_URL = 'https://visitormanagement.dockyardsoftware.com';

// Contact Person Services
const GetAllContactPersons = async () => {
    return axios.get(`${BASE_URL}/ContactPerson/GetAllContactPersons`);
};

const GetActiveContactPersons = async () => {
    return axios.get(`${BASE_URL}/ContactPerson/GetActiveContactPersons`);
};

const SearchContactPersons = async (name) => {
    return axios.get(`${BASE_URL}/ContactPerson/SearchContactPersons?VCP_Name=${encodeURIComponent(name)}`);
};

const AddContactPerson = async (name, department, email, phone) => {
    return axios.post(`${BASE_URL}/ContactPerson/AddContactPerson?VCP_Name=${encodeURIComponent(name)}&VCP_Department=${encodeURIComponent(department)}&VCP_Email=${encodeURIComponent(email)}&VCP_Phone=${encodeURIComponent(phone)}`);
};

const UpdateContactPerson = async (id, name, department, email, phone) => {
    return axios.post(`${BASE_URL}/ContactPerson/UpdateContactPerson?VCP_Contact_person_id=${encodeURIComponent(id)}&VCP_Name=${encodeURIComponent(name)}&VCP_Department=${encodeURIComponent(department)}&VCP_Email=${encodeURIComponent(email)}&VCP_Phone=${encodeURIComponent(phone)}`);
};

const UpdateContactPersonStatus = async (id, status) => {
    return axios.post(`${BASE_URL}/ContactPerson/UpdateContactPersonStatus?VCP_Contact_person_id=${encodeURIComponent(id)}&VCP_Status=${encodeURIComponent(status)}`);
};

const GetContactPersonByPhone = async (id, phone) => {
    return axios.get(`${BASE_URL}/ContactPerson/GetContactPersonByPhone?VCP_Contact_person_id=${encodeURIComponent(id)}&VCP_Phone=${encodeURIComponent(phone)}`);
};

const GetContactPersonByEmail = async (email) => {
    return axios.get(`${BASE_URL}/ContactPerson/GetContactPersonByEmail?VCP_Email=${encodeURIComponent(email)}`);
};

// Administrator Services (Security Officers & Visitors)
const GetAllAdministrators = async () => {
    return axios.get(`${BASE_URL}/Administrator/GetAllAdministrator`);
};

const UserManagementService = {
    GetAllContactPersons,
    GetActiveContactPersons,
    SearchContactPersons,
    AddContactPerson,
    UpdateContactPerson,
    UpdateContactPersonStatus,
    GetContactPersonByPhone,
    GetContactPersonByEmail,
    GetAllAdministrators,
};

export default UserManagementService;
