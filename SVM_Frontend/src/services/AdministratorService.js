import axios from "axios";
import { BACKEND_BASE_URL } from "../index";

const getApiUrl = (endpoint) => {
  if (process.env.NODE_ENV === "development") {
    return `/api${endpoint}`;
  }
  return `${BACKEND_BASE_URL}${endpoint}`;
};

const GetAllAdministrator = async () => {
  let config = {
    method: "get",
    url: getApiUrl("/Administrator/GetAllAdministrator"),
  };
  return axios.request(config).then((response) => response);
};

const AddAdministrator = async (adminData) => {
  let config = {
    method: "post",
    url: getApiUrl(
      `/Administrator/AddAdministrator?VA_Name=${encodeURIComponent(adminData.VA_Name)}&VA_Role=${encodeURIComponent(adminData.VA_Role)}&VA_Email=${encodeURIComponent(adminData.VA_Email)}&VA_Password=${encodeURIComponent(adminData.VA_Password)}`,
    ),
    data: "",
  };
  return axios.request(config).then((response) => response);
};

const UpdateAdministrator = async (adminData) => {
  let config = {
    method: "post",
    url: getApiUrl(
      `/Administrator/UpdateAdministrator?VA_Name=${encodeURIComponent(adminData.VA_Name)}&VA_Role=${encodeURIComponent(adminData.VA_Role)}&VA_Email=${encodeURIComponent(adminData.VA_Email)}&VA_Password=${encodeURIComponent(adminData.VA_Password)}&VA_Admin_id=${encodeURIComponent(adminData.VA_Admin_id)}&VA_Status=${encodeURIComponent(adminData.VA_Status || "")}`,
    ),
    data: "",
  };
  return axios.request(config).then((response) => response);
};

const GetAdministratorById = async (id) => {
  let config = {
    method: "get",
    url: getApiUrl(
      `/Administrator/GetAdministratorById?VA_Admin_id=${encodeURIComponent(id)}`,
    ),
  };
  return axios.request(config).then((response) => response);
};

const DeleteAdministrator = async (id, status) => {
  let config = {
    method: "post",
    url: getApiUrl(
      `/Administrator/DeleteAdministrator?VA_Admin_id=${encodeURIComponent(id)}&VA_Status=${encodeURIComponent(status)}`,
    ),
    data: "",
  };
  return axios.request(config).then((response) => response);
};

export default {
  GetAllAdministrator,
  AddAdministrator,
  UpdateAdministrator,
  GetAdministratorById,
  DeleteAdministrator,
};
