import axios from "axios";
import { BACKEND_BASE_URL } from "../index";

const getApiUrl = (endpoint) => {
  if (process.env.NODE_ENV === "development") {
    return `/api${endpoint}`;
  }
  return `${BACKEND_BASE_URL}${endpoint}`;
};

// Contact Person Services
const GetAllContactPersons = async () => {
  return axios.get(getApiUrl("/ContactPerson/GetAllContactPersons"));
};

const GetActiveContactPersons = async () => {
  return axios.get(getApiUrl("/ContactPerson/GetActiveContactPersons"));
};

const SearchContactPersons = async (name) => {
  return axios.get(
    getApiUrl(
      `/ContactPerson/SearchContactPersons?VCP_Name=${encodeURIComponent(name)}`,
    ),
  );
};

const AddContactPerson = async (name, department, email, phone) => {
  return axios.post(
    getApiUrl(
      `/ContactPerson/AddContactPerson?VCP_Name=${encodeURIComponent(name)}&VCP_Department=${encodeURIComponent(department)}&VCP_Email=${encodeURIComponent(email)}&VCP_Phone=${encodeURIComponent(phone)}`,
    ),
  );
};

const UpdateContactPerson = async (id, name, department, email, phone) => {
  return axios.post(
    getApiUrl(
      `/ContactPerson/UpdateContactPerson?VCP_Contact_person_id=${encodeURIComponent(id)}&VCP_Name=${encodeURIComponent(name)}&VCP_Department=${encodeURIComponent(department)}&VCP_Email=${encodeURIComponent(email)}&VCP_Phone=${encodeURIComponent(phone)}`,
    ),
  );
};

const UpdateContactPersonStatus = async (id, status) => {
  return axios.post(
    getApiUrl(
      `/ContactPerson/UpdateContactPersonStatus?VCP_Contact_person_id=${encodeURIComponent(id)}&VCP_Status=${encodeURIComponent(status)}`,
    ),
  );
};

const GetContactPersonByPhone = async (id, phone) => {
  return axios.get(
    getApiUrl(
      `/ContactPerson/GetContactPersonByPhone?VCP_Contact_person_id=${encodeURIComponent(id)}&VCP_Phone=${encodeURIComponent(phone)}`,
    ),
  );
};

const GetContactPersonByEmail = async (email) => {
  return axios.get(
    getApiUrl(
      `/ContactPerson/GetContactPersonByEmail?VCP_Email=${encodeURIComponent(email)}`,
    ),
  );
};

// Administrator Services (Security Supports & Visitors)
const GetAllAdministrators = async () => {
  return axios.get(getApiUrl("/Administrator/GetAllAdministrator"));
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
