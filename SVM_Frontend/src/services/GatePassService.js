import axios from "axios";
import { BACKEND_BASE_URL } from "../index";

const getApiUrl = (endpoint) => {
  if (process.env.NODE_ENV === "development") {
    return `/api${endpoint}`;
  }
  return `${BACKEND_BASE_URL}${endpoint}`;
};

const GetAllGatePasses = async () => {
  let config = {
    method: "get",
    url: getApiUrl("/GatePass/GetAllGatePasses"),
  };
  return axios.request(config).then((response) => response);
};

const AddGatePass = async (visitorId, requestId) => {
  let config = {
    method: "post",
    url: getApiUrl(
      `/GatePass/AddGatePass?VGP_Visitor_id=${encodeURIComponent(visitorId)}&VGP_Request_id=${encodeURIComponent(requestId)}`,
    ),
    data: "",
  };
  return axios.request(config).then((response) => response);
};

const UpdateGatePass = async (passId, status, issueDate) => {
  let config = {
    method: "post",
    url: getApiUrl(
      `/GatePass/UpdateGatePass?VGP_Pass_id=${encodeURIComponent(passId)}&VGP_Status=${encodeURIComponent(status)}&VGP_Issue_Date=${encodeURIComponent(issueDate)}`,
    ),
    data: "",
  };
  return axios.request(config).then((response) => response);
};

const GetGatePassById = async (id) => {
  let config = {
    method: "get",
    url: getApiUrl(
      `/GatePass/GetGatePassById?VGP_Pass_id=${encodeURIComponent(id)}`,
    ),
  };
  return axios.request(config).then((response) => response);
};

const UpdateGatePassStatus = async (passId, status) => {
  let config = {
    method: "post",
    url: getApiUrl(
      `/GatePass/UpdateGatePassStatus?VGP_Pass_id=${encodeURIComponent(passId)}&VGP_Status=${encodeURIComponent(status)}`,
    ),
    data: "",
  };
  return axios.request(config).then((response) => response);
};

const GetActiveGatePasses = async () => {
  let config = {
    method: "get",
    url: getApiUrl("/GatePass/GetActiveGatePasses"),
  };
  return axios.request(config).then((response) => response);
};

export default {
  GetAllGatePasses,
  AddGatePass,
  UpdateGatePass,
  GetGatePassById,
  UpdateGatePassStatus,
  GetActiveGatePasses,
};
