import axios from "axios";
import { BACKEND_BASE_URL } from "../index";

const getApiUrl = (endpoint) => `${BACKEND_BASE_URL}${endpoint}`;

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

/**
 * Log a scan entry/exit for tracking check-in/checkout
 * @param {string} passId - Gate pass ID
 * @param {string} scanType - "CHECK_IN" or "CHECK_OUT"
 * @param {string} remarks - Optional remarks about visitor behavior
 * @returns {Promise} - Response from API
 */
const LogScanEntry = async (passId, scanType, remarks = "") => {
  let config = {
    method: "post",
    url: getApiUrl("/GatePass/LogScanEntry"),
    data: {
      VGP_Pass_id: passId,
      scan_type: scanType, // CHECK_IN or CHECK_OUT
      scan_timestamp: new Date().toISOString(),
      remarks: remarks,
    },
  };
  return axios.request(config).then((response) => response);
};

/**
 * Get scan count for a pass on today's date
 * @param {string} passId - Gate pass ID
 * @returns {Promise} - Response with scan count and scan history
 */
const GetTodayScanCount = async (passId) => {
  let config = {
    method: "get",
    url: getApiUrl(`/GatePass/GetTodayScanCount?VGP_Pass_id=${encodeURIComponent(passId)}`),
  };
  return axios.request(config).then((response) => response);
};

/**
 * Get scan history for a pass
 * @param {string} passId - Gate pass ID
 * @returns {Promise} - Response with scan history
 */
const GetScanHistory = async (passId) => {
  let config = {
    method: "get",
    url: getApiUrl(`/GatePass/GetScanHistory?VGP_Pass_id=${encodeURIComponent(passId)}`),
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
  LogScanEntry,
  GetTodayScanCount,
  GetScanHistory,
};
