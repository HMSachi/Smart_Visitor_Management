import axios from "axios";
import { BACKEND_BASE_URL } from "../index";

const getApiUrl = (endpoint) => {
  if (process.env.NODE_ENV === "development") {
    return `/api${endpoint}`;
  }
  return `${BACKEND_BASE_URL}${endpoint}`;
};

const GetAllVisitGroup = async () => {
  let config = {
    method: "get",
    url: getApiUrl("/VisitGroup/GetAllVisitGroup"),
  };
  return axios.request(config).then((response) => response);
};

const GetVisitGroupById = async (id) => {
  let config = {
    method: "get",
    url: getApiUrl(
      `/VisitGroup/GetVisitGroupById/?VVG_id=${encodeURIComponent(id)}`,
    ),
  };
  return axios.request(config).then((response) => response);
};

const AddVisitGroup = async (groupData) => {
  let config = {
    method: "post",
    url: getApiUrl(
      `/VisitGroup/AddVisitGroup/?VVG_Visitor_Name=${encodeURIComponent(groupData.VVG_Visitor_Name)}&VVG_NIC_Passport_Number=${encodeURIComponent(groupData.VVG_NIC_Passport_Number)}&VVG_Designation=${encodeURIComponent(groupData.VVG_Designation)}&VVG_Status=${encodeURIComponent(groupData.VVG_Status || "A")}&VVR_Request_id=${encodeURIComponent(groupData.VVR_Request_id)}`,
    ),
    data: "",
  };
  return axios.request(config).then((response) => response);
};

const UpdateVisitGroup = async (groupData) => {
  let config = {
    method: "post",
    url: getApiUrl(
      `/VisitGroup/UpdateVisitGroup/?VVG_id=${encodeURIComponent(groupData.VVG_id)}&VVG_Visitor_Name=${encodeURIComponent(groupData.VVG_Visitor_Name)}&VVG_Designation=${encodeURIComponent(groupData.VVG_Designation)}&VVG_Status=${encodeURIComponent(groupData.VVG_Status || "A")}&VVR_Request_id=${encodeURIComponent(groupData.VVR_Request_id)}`,
    ),
    data: "",
  };
  return axios.request(config).then((response) => response);
};

const UpdateVisitGroupStatus = async (id, status) => {
  let config = {
    method: "post",
    url: getApiUrl(
      `/VisitGroup/GetActiveVisitGroup/?VVG_id=${encodeURIComponent(id)}&VVG_Status=${encodeURIComponent(status)}`,
    ),
    data: "",
  };
  return axios.request(config).then((response) => response);
};

export default {
  GetAllVisitGroup,
  GetVisitGroupById,
  AddVisitGroup,
  UpdateVisitGroup,
  UpdateVisitGroupStatus,
};
