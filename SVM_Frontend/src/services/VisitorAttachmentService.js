import axios from "axios";
import { BACKEND_BASE_URL } from "../index";

const getApiUrl = (endpoint) => {
  if (process.env.NODE_ENV === "development") {
    return `/api${endpoint}`;
  }
  return `${BACKEND_BASE_URL}${endpoint}`;
};

/**
 * Upload a NIC / Passport attachment for a visitor.
 * @param {number|string} visitorId   - VV_Visitor_id
 * @param {string}        fileCategory - e.g. "nic" | "passport"
 * @param {string}        pUid         - logged-in user name / UID
 * @param {File}          file         - the file object to upload
 */
const UploadAttachment = async (visitorId, fileCategory, pUid, file) => {
  const formData = new FormData();
  formData.append("file", file);

  const url = getApiUrl(
    `/VisitorAttachment/UploadAttachment?VV_Visitor_id=${encodeURIComponent(
      visitorId
    )}&VAT_File_Category=${encodeURIComponent(
      fileCategory
    )}&P_UID=${encodeURIComponent(pUid)}`
  );

  const config = {
    method: "post",
    url,
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };

  return axios.request(config).then((response) => response);
};

/**
 * Upload an attachment for a sub-visitor.
 * @param {number|string} subVisitorId - VVG_id of the sub-visitor
 * @param {number|string} visitorId    - VV_Visitor_id of the main visitor
 * @param {string}        fileCategory - e.g. "NIC", "Passport", "Driving License"
 * @param {string}        pUid         - logged-in user name / UID
 * @param {File}          file         - the file object to upload
 */
const UploadSubVisitorAttachment = async (subVisitorId, visitorId, fileCategory, pUid, file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("VVG_id", subVisitorId);
  formData.append("VV_Visitor_id", visitorId);
  formData.append("VAT_File_Category", fileCategory);
  formData.append("P_UID", pUid);

  const config = {
    method: "post",
    url: getApiUrl("/VisitorAttachment/UploadAttachment"),
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };

  return axios.request(config).then((response) => response);
};

/**
 * Get all attachments for a visitor.
 * @param {number|string} visitorId - VV_Visitor_id
 */
const GetAttachmentsByVisitorId = async (visitorId) => {
  const config = {
    method: "get",
    url: getApiUrl(
      `/VisitorAttachment/GetAttachmentsByVisitorId?VV_Visitor_id=${encodeURIComponent(visitorId)}`
    ),
  };
  return axios.request(config).then((response) => response);
};

/**
 * Get all attachments for a sub-visitor (group member).
 * @param {number|string} groupId - VVG_id of the sub-visitor
 */
const GetAttachmentsByGroupId = async (groupId) => {
  const config = {
    method: "get",
    url: getApiUrl(
      `/VisitorAttachment/GetAttachmentsByGroupId?VVG_id=${encodeURIComponent(groupId)}`
    ),
  };
  return axios.request(config).then((response) => response);
};

/**
 * Download an attachment file by its VAT_Id.
 * @param {number|string} vatId    - VAT_Id of the attachment record
 * @param {string}        fileName - Suggested file name for the download
 */
const DownloadAttachment = async (vatId, fileName = "attachment") => {
  const config = {
    method: "get",
    url: getApiUrl(
      `/VisitorAttachment/DownloadAttachment?VAT_Id=${encodeURIComponent(vatId)}`
    ),
    responseType: "blob",
  };

  const response = await axios.request(config);

  // Derive file name from Content-Disposition header if available
  const disposition = response.headers?.["content-disposition"] || "";
  const match = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
  const resolvedName = match ? match[1].replace(/['"]/g, "") : fileName;

  // Trigger browser download
  const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = resolvedName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(blobUrl);

  return response;
};

/**
 * Get preview data for an attachment file by its VAT_Id.
 * @param {number|string} vatId    - VAT_Id of the attachment record
 */
const GetAttachmentPreviewData = async (vatId) => {
  const config = {
    method: "get",
    url: getApiUrl(
      `/VisitorAttachment/DownloadAttachment?VAT_Id=${encodeURIComponent(vatId)}`
    ),
    responseType: "blob",
  };

  const response = await axios.request(config);

  const contentType = response.headers?.["content-type"] || "application/octet-stream";
  const blobUrl = window.URL.createObjectURL(new Blob([response.data], { type: contentType }));
  
  const disposition = response.headers?.["content-disposition"] || "";
  const match = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
  const resolvedName = match ? match[1].replace(/['"]/g, "") : null;

  return { blobUrl, fileType: contentType, fileName: resolvedName };
};

export default {
  UploadAttachment,
  UploadSubVisitorAttachment,
  GetAttachmentsByVisitorId,
  GetAttachmentsByGroupId,
  DownloadAttachment,
  GetAttachmentPreviewData,
};
