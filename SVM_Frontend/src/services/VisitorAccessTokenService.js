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

/**
 * Generate an access token after admin approves a visit request.
 * POST /VisitorAccessToken/GenerateToken?VVR_Request_id=...&VV_Visitor_id=...&P_UID=...
 *
 * @param {string|number} requestId  - The visit request ID (VVR_Request_id)
 * @param {string|number} visitorId  - The visitor ID (VV_Visitor_id)
 * @param {string}        pUid       - The user performing the action (default "Admin")
 * @returns {Promise} Axios response
 */
const GenerateToken = async (requestId, visitorId, pUid = "Admin") => {
  const config = {
    method: "post",
    url: getApiUrl(
      `/VisitorAccessToken/GenerateToken?VVR_Request_id=${encodeURIComponent(requestId)}&VV_Visitor_id=${encodeURIComponent(visitorId)}&P_UID=${encodeURIComponent(pUid)}`,
    ),
    data: "",
  };
  return axios.request(config).then((response) => response);
};

/**
 * Expire an access token after visitor checkout.
 * POST /VisitorAccessToken/ExpireToken?VVR_Request_id=...&P_UID=...
 *
 * @param {string|number} requestId - The visit request ID (VVR_Request_id)
 * @param {string}        pUid      - The user performing the action (default "System")
 * @returns {Promise} Axios response
 */
const ExpireToken = async (requestId, pUid = "System") => {
  const config = {
    method: "post",
    url: getApiUrl(
      `/VisitorAccessToken/ExpireToken?VVR_Request_id=${encodeURIComponent(requestId)}&P_UID=${encodeURIComponent(pUid)}`,
    ),
    data: "",
  };
  return axios.request(config).then((response) => response);
};

/**
 * Get all access tokens, optionally filtered by status.
 * GET /VisitorAccessToken/GetAllTokens
 * GET /VisitorAccessToken/GetAllTokens?VVAT_Status=A   (Active)
 * GET /VisitorAccessToken/GetAllTokens?VVAT_Status=E   (Expired)
 *
 * @param {string} [status] - Optional. "A" for active, "E" for expired, omit for all.
 * @returns {Promise} Axios response
 */
const GetAllTokens = async (status) => {
  const statusQuery = status ? `?VVAT_Status=${encodeURIComponent(status)}` : "";
  const config = {
    method: "get",
    url: getApiUrl(`/VisitorAccessToken/GetAllTokens${statusQuery}`),
  };
  return axios.request(config).then((response) => response);
};

/**
 * Get access token by visit request ID.
 * GET /VisitorAccessToken/GetTokenByRequestId?VVR_Request_id=...
 *
 * @param {string|number} requestId - The visit request ID
 * @returns {Promise} Axios response
 */
const GetTokenByRequestId = async (requestId) => {
  const config = {
    method: "get",
    url: getApiUrl(
      `/VisitorAccessToken/GetTokenByRequestId?VVR_Request_id=${encodeURIComponent(requestId)}`,
    ),
  };
  return axios.request(config).then((response) => response);
};

/**
 * Get access token by visitor ID.
 * GET /VisitorAccessToken/GetTokenByVisitorId?VV_Visitor_id=...
 *
 * @param {string|number} visitorId - The visitor ID
 * @returns {Promise} Axios response
 */
const GetTokenByVisitorId = async (visitorId) => {
  const config = {
    method: "get",
    url: getApiUrl(
      `/VisitorAccessToken/GetTokenByVisitorId?VV_Visitor_id=${encodeURIComponent(visitorId)}`,
    ),
  };
  return axios.request(config).then((response) => response);
};

const GenerateVisitorSmsAndEmailAccessToken = async (requestId, visitorId, pUid = "Admin") => {
  if (!requestId || !visitorId) {
    throw new Error(
      "Request ID and Visitor ID are required to generate the visitor access token.",
    );
  }

  // Backend resolves registered main visitor phone/email from VV_Visitor_id and maps to VVR_Request_id
  const response = await GenerateToken(requestId, visitorId, pUid);
  return unwrapResult(response);
};

export default {
  GenerateToken,
  ExpireToken,
  GetAllTokens,
  GetTokenByRequestId,
  GetTokenByVisitorId,
  GenerateVisitorSmsAndEmailAccessToken,
  getNotificationErrorMessage,
};
