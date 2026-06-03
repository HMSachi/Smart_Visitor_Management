import axios from "axios";
import { BACKEND_BASE_URL } from "../index";

const getApiUrl = (endpoint) => {
  if (process.env.NODE_ENV === "development") {
    return `/api${endpoint}`;
  }
  return `${BACKEND_BASE_URL}${endpoint}`;
};

const unwrapData = (response) => response?.data?.ResultSet || response?.data;

const GenerateProfileToken = async (visitorId, pUid) => {
  const config = {
    method: "post",
    url: getApiUrl(
      `/VisitorProfileToken/GenerateProfileToken?VV_Visitor_id=${encodeURIComponent(visitorId)}&P_UID=${encodeURIComponent(pUid)}`,
    ),
    data: "",
  };
  return axios.request(config).then((response) => response);
};

const ValidateProfileToken = async (token) => {
  const config = {
    method: "get",
    url: getApiUrl(
      `/VisitorProfileToken/ValidateProfileToken?VVPT_Token=${encodeURIComponent(token)}`,
    ),
  };
  return axios.request(config).then((response) => response);
};

const ExpireProfileToken = async (visitorId, pUid) => {
  const config = {
    method: "post",
    url: getApiUrl(
      `/VisitorProfileToken/ExpireProfileToken?VV_Visitor_id=${encodeURIComponent(visitorId)}&P_UID=${encodeURIComponent(pUid)}`,
    ),
    data: "",
  };
  return axios.request(config).then((response) => response);
};

const GetAllProfileTokens = async (status) => {
  const statusQuery = status ? `?VVPT_Status=${encodeURIComponent(status)}` : "";
  const config = {
    method: "get",
    url: getApiUrl(`/VisitorProfileToken/GetAllProfileTokens${statusQuery}`),
  };
  return axios.request(config).then((response) => response);
};

const GetProfileTokenByVisitorId = async (visitorId) => {
  const config = {
    method: "get",
    url: getApiUrl(
      `/VisitorProfileToken/GetProfileTokenByVisitorId?VV_Visitor_id=${encodeURIComponent(visitorId)}`,
    ),
  };
  return axios.request(config).then((response) => response);
};

const extractToken = (response) => {
  const data = unwrapData(response);
  const first = Array.isArray(data) ? data[0] : data;

  return (
    first?.VVPT_Token ||
    first?.Token ||
    first?.token ||
    first?.ProfileToken ||
    first?.profileToken ||
    first?.ResultSet?.[0]?.VVPT_Token ||
    null
  );
};

const isValidationSuccess = (response) => {
  const data = unwrapData(response);
  const first = Array.isArray(data) ? data[0] : data;
  const status = (
    first?.VVPT_Status ||
    first?.Status ||
    first?.status ||
    response?.data?.Status ||
    ""
  )
    .toString()
    .trim()
    .toUpperCase();

  const result = (response?.data?.Result || response?.data?.Message || "")
    .toString()
    .trim()
    .toUpperCase();
  const isExplicitFailure =
    first?.IsValid === false ||
    first?.isValid === false ||
    response?.data?.IsValid === false ||
    response?.data?.isValid === false;

  return (
    response?.status === 200 &&
    !isExplicitFailure &&
    status !== "E" &&
    status !== "EXPIRED" &&
    status !== "INVALID" &&
    !result.includes("INVALID") &&
    !result.includes("EXPIRED")
  );
};

const VisitorProfileTokenService = {
  GenerateProfileToken,
  ValidateProfileToken,
  ExpireProfileToken,
  GetAllProfileTokens,
  GetProfileTokenByVisitorId,
  extractToken,
  isValidationSuccess,
};

export default VisitorProfileTokenService;
