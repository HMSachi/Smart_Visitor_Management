import axios from "axios";
import { BACKEND_BASE_URL } from "../index";

const getApiUrl = (endpoint) => `${BACKEND_BASE_URL}${endpoint}`;

const unwrapResult = (response) => response?.data?.ResultSet || response?.data;

const stripHtml = (value) =>
  String(value || "")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const getNotificationErrorMessage = (error) => {
  const status = error?.response?.status;
  const responseText = stripHtml(error?.response?.data);

  if (
    status === 500 &&
    responseText.includes("DirectoryNotFoundException")
  ) {
    return (
      "The SMS/email request reached the server, but the backend failed because its exception log folder is missing. " +
      "Please create the backend Exceptionlogs folder or fix the backend log path."
    );
  }

  if (status) {
    return `The SMS/email server returned HTTP ${status}. ${responseText || "Please check the backend logs."}`;
  }

  return error?.message || "Failed to send SMS/email to the visitor.";
};

const GenerateProfileToken = async (
  visitorId,
  pUid = "Admin",
  { gatePassId, requestId } = {},
) => {
  const params = new URLSearchParams({
    VV_Visitor_id: String(visitorId),
    P_UID: String(pUid),
  });

  if (gatePassId) {
    params.set("VGP_Pass_id", String(gatePassId));
  }

  if (requestId) {
    params.set("VVR_Request_id", String(requestId));
  }

  const config = {
    method: "post",
    url: getApiUrl(
      `/VisitorProfileToken/GenerateProfileToken?${params.toString()}`,
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

const ExpireProfileToken = async (visitorId, pUid = "Admin") => {
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

const GenerateVisitorSmsAndEmailToken = async (
  visitorId,
  pUid = "Admin",
  { gatePassId, requestId } = {},
) => {
  if (!visitorId) {
    throw new Error(
      "Visitor ID is required to generate the visitor SMS/email token.",
    );
  }

  const response = await GenerateProfileToken(visitorId, pUid, {
    gatePassId,
    requestId,
  });
  return unwrapResult(response);
};

export default {
  GenerateProfileToken,
  ValidateProfileToken,
  ExpireProfileToken,
  GetAllProfileTokens,
  GetProfileTokenByVisitorId,
  GenerateVisitorSmsAndEmailToken,
  getNotificationErrorMessage,
};
