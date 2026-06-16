import axios from "axios";
import { BACKEND_BASE_URL } from "../index";

const getApiUrl = (endpoint) => `${BACKEND_BASE_URL}${endpoint}`;

const AddVisitLog = async (passId, accessedAreas, expiryDate) => {
  let config = {
    method: "post",
    url: getApiUrl(
      `/VisitLog/AddVisitLog?VVL_Pass_id=${encodeURIComponent(passId)}&VVL_Accessed_Areas=${encodeURIComponent(accessedAreas)}&VVL_Expiry_Date=${encodeURIComponent(expiryDate)}`,
    ),
    data: "",
  };
  return axios.request(config).then((response) => response);
};

const UpdateVisitLog = async (visitId, passId, accessedAreas, checkOutTime) => {
  let config = {
    method: "post",
    url: getApiUrl(
      `/VisitLog/UpdateVisitLog?VVL_Visit_id=${encodeURIComponent(visitId)}&VVL_Pass_id=${encodeURIComponent(passId)}&VVL_Accessed_Areas=${encodeURIComponent(accessedAreas)}&VVL_Check_Out_Time=${encodeURIComponent(checkOutTime)}`,
    ),
    data: "",
  };
  return axios.request(config).then((response) => response);
};

const GetAllVisitLogs = async () => {
  let config = {
    method: "get",
    url: getApiUrl(`/VisitLog/GetAllVisitLogs`),
  };
  return axios.request(config).then((response) => response);
};

const GetVisitLogById = async (visitId) => {
  let config = {
    method: "get",
    url: getApiUrl(`/VisitLog/GetVisitLogById?VVL_Visit_id=${encodeURIComponent(visitId)}`),
  };
  return axios.request(config).then((response) => response);
};

const GetVisitorsInside = async () => {
  let config = {
    method: "get",
    url: getApiUrl(`/VisitLog/GetVisitorsInside`),
  };
  return axios.request(config).then((response) => response);
};

export default {
  AddVisitLog,
  UpdateVisitLog,
  GetAllVisitLogs,
  GetVisitLogById,
  GetVisitorsInside,
};
