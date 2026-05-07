import axios from "axios";
import { BACKEND_BASE_URL } from "../index";

const getApiUrl = (endpoint) => {
  if (process.env.NODE_ENV === "development") {
    return `/api${endpoint}`;
  }
  return `${BACKEND_BASE_URL}${endpoint}`;
};

const GetAllBlacklist = async () => {
  let config = {
    method: "get",
    url: getApiUrl("/Blacklist/GetAllBlacklist"),
  };
  return axios.request(config).then((response) => response);
};

const AddBlacklist = async (blacklistData) => {
  let config = {
    method: "post",
    url: getApiUrl(
      `/Blacklist/AddBlacklist?VB_Name=${encodeURIComponent(blacklistData.VB_Name || "")}&VB_Role=${encodeURIComponent(blacklistData.VB_Role || "")}&VB_Email=${encodeURIComponent(blacklistData.VB_Email || "")}&VB_Alert_Type=${encodeURIComponent(blacklistData.VB_Alert_Type || "")}&VB_Description=${encodeURIComponent(blacklistData.VB_Description || "")}&VB_Admin_id=${encodeURIComponent(blacklistData.VB_Admin_id || "")}&VB_Visitor_id=${encodeURIComponent(blacklistData.VB_Visitor_id || "")}`,
    ),
    data: "",
  };
  return axios.request(config).then((response) => response);
};

const GetBlacklistById = async (id) => {
  let config = {
    method: "get",
    url: getApiUrl(
      `/Blacklist/GetByIdBlacklist?VB_id=${encodeURIComponent(id)}`,
    ),
  };
  return axios.request(config).then((response) => response);
};

const UpdateBlacklist = async (blacklistData) => {
  let config = {
    method: "post",
    url: getApiUrl(
      `/Blacklist/UpdateBlacklist?VB_Name=${encodeURIComponent(blacklistData.VB_Name || "")}&VB_Role=${encodeURIComponent(blacklistData.VB_Role || "")}&VB_Email=${encodeURIComponent(blacklistData.VB_Email || "")}&VB_Alert_Type=${encodeURIComponent(blacklistData.VB_Alert_Type || "")}&VB_id=${encodeURIComponent(blacklistData.VB_id)}`,
    ),
    data: "",
  };
  return axios.request(config).then((response) => response);
};

const UpdateBlacklistStatus = async (id, status) => {
  let config = {
    method: "post",
    url: getApiUrl(
      `/Blacklist/ActivateBlacklsit?VB_id=${encodeURIComponent(id)}&VB_Status=${encodeURIComponent(status)}`,
    ),
    data: "",
  };
  return axios.request(config).then((response) => response);
};

export default {
  GetAllBlacklist,
  GetBlacklistById,
  AddBlacklist,
  UpdateBlacklist,
  UpdateBlacklistStatus,
};
