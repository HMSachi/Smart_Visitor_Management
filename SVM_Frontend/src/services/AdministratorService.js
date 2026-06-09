import axios from "axios";
import { BACKEND_BASE_URL } from "../index";

const getApiUrl = (endpoint) => `${BACKEND_BASE_URL}${endpoint}`;

const getAdminMobileNumber = (adminData) =>
  adminData.VA_Mobile_Number ||
  adminData.VA_Phone ||
  adminData.VA_Mobile ||
  adminData.VA_Contact_Number ||
  "";

const buildAdminQuery = (adminData, includeId = false) => {
  const params = new URLSearchParams({
    VA_Name: adminData.VA_Name || "",
    VA_Role: adminData.VA_Role || "",
    VA_Email: adminData.VA_Email || "",
    VA_Password: adminData.VA_Password || "",
    VA_Mobile_Number: getAdminMobileNumber(adminData),
    VA_Phone: getAdminMobileNumber(adminData),
    VA_Department: adminData.VA_Department || "",
  });

  if (includeId) {
    params.set("VA_Admin_id", adminData.VA_Admin_id || "");
    params.set("VA_Status", adminData.VA_Status || "");
  }

  return params.toString();
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
      `/Administrator/AddAdministrator?${buildAdminQuery(adminData)}`,
    ),
    data: "",
  };
  return axios.request(config).then((response) => response);
};

const UpdateAdministrator = async (adminData) => {
  let config = {
    method: "post",
    url: getApiUrl(
      `/Administrator/UpdateAdministrator?${buildAdminQuery(adminData, true)}`,
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
