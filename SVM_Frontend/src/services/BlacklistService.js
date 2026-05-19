import axios from "axios";
import { BACKEND_BASE_URL } from "../index";

const getApiUrl = (endpoint) => {
  if (process.env.NODE_ENV === "development") {
    return `/api${endpoint}`;
  }
  return `${BACKEND_BASE_URL}${endpoint}`;
};

const GetAllBlacklist = async (status = "") => {
  let url = getApiUrl("/Blacklist/GetAllBlacklist");
  if (status) {
    url += `?VB_Approval_Status=${encodeURIComponent(status)}`;
  }
  let config = {
    method: "get",
    url: url,
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

const AddBlacklistReport = async (data) => {
  let url = `/Blacklist/AddBlacklistReport?VB_Visitor_id=${encodeURIComponent(data.VB_Visitor_id || "")}&VB_Reporter_Name=${encodeURIComponent(data.VB_Reporter_Name || "")}&VB_Reporter_Role=${encodeURIComponent(data.VB_Reporter_Role || "")}&VB_Reporter_Email=${encodeURIComponent(data.VB_Reporter_Email || "")}&VB_Description=${encodeURIComponent(data.VB_Description || "")}&VB_Alert_Type=${encodeURIComponent(data.VB_Alert_Type || "")}&VB_Reported_By=${encodeURIComponent(data.VB_Reported_By || "")}&P_UID=${encodeURIComponent(data.P_UID || "")}`;
  
  if (data.VVG_id) {
    url += `&VVG_id=${encodeURIComponent(data.VVG_id)}`;
  }

  let config = {
    method: "post",
    url: getApiUrl(url),
    data: "",
  };
  return axios.request(config).then((response) => response);
};

const UpdateBlacklistReport = async (data) => {
  let config = {
    method: "post",
    url: getApiUrl(
      `/Blacklist/UpdateBlacklistReport?VB_id=${encodeURIComponent(data.VB_id)}&VB_Description=${encodeURIComponent(data.VB_Description || "")}&VB_Alert_Type=${encodeURIComponent(data.VB_Alert_Type || "")}&P_UID=${encodeURIComponent(data.P_UID || "")}`
    ),
    data: "",
  };
  return axios.request(config).then((response) => response);
};

const ApproveBlacklist = async (id, adminId, pUid) => {
  let config = {
    method: "post",
    url: getApiUrl(
      `/Blacklist/ApproveBlacklist?VB_id=${encodeURIComponent(id)}&VB_Admin_id=${encodeURIComponent(adminId)}&P_UID=${encodeURIComponent(pUid)}`
    ),
    data: "",
  };
  return axios.request(config).then((response) => response);
};

const RejectBlacklist = async (id, adminId, rejectReason, pUid) => {
  let config = {
    method: "post",
    url: getApiUrl(
      `/Blacklist/RejectBlacklist?VB_id=${encodeURIComponent(id)}&VB_Admin_id=${encodeURIComponent(adminId)}&VB_Reject_Reason=${encodeURIComponent(rejectReason)}&P_UID=${encodeURIComponent(pUid)}`
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
  AddBlacklistReport,
  UpdateBlacklistReport,
  ApproveBlacklist,
  RejectBlacklist,
};
