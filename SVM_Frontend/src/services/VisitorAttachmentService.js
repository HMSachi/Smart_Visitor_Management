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

export default {
  UploadAttachment,
  GetAttachmentsByVisitorId,
};
