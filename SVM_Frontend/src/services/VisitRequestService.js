import axios from "axios";
import { BACKEND_BASE_URL } from "../index";

const getApiUrl = (endpoint) => {
  if (process.env.NODE_ENV === "development") {
    return `/api${endpoint}`;
  }
  return `${BACKEND_BASE_URL}${endpoint}`;
};

const GetAllVisitRequests = async () => {
  let config = {
    method: "get",
    url: getApiUrl("/VisitRequest/GetAllVisitRequests"),
  };
  return axios.request(config).then((response) => response);
};

const AddVisitRequest = async (requestData) => {
  let url = getApiUrl(
    `/VisitRequest/AddVisitRequest?VVR_Visitor_id=${encodeURIComponent(requestData.VVR_Visitor_id)}&VVR_Contact_person_id=${encodeURIComponent(requestData.VVR_Contact_person_id)}&VVR_Visit_Date=${encodeURIComponent(requestData.VVR_Visit_Date)}&VVR_Places_to_Visit=${encodeURIComponent(requestData.VVR_Places_to_Visit)}&VVR_Purpose=${encodeURIComponent(requestData.VVR_Purpose)}`,
  );

  if (requestData.VVR_Status) {
    url += `&VVR_Status=${encodeURIComponent(requestData.VVR_Status)}`;
  }

  let config = {
    method: "post",
    url: url,
    data: "",
  };
  return axios.request(config).then((response) => response);
};

const UpdateVisitRequest = async (requestData) => {
  let url = getApiUrl(
    `/VisitRequest/UpdateVisitRequest?VVR_Visit_Date=${encodeURIComponent(requestData.VVR_Visit_Date)}&VVR_Places_to_Visit=${encodeURIComponent(requestData.VVR_Places_to_Visit)}&VVR_Purpose=${encodeURIComponent(requestData.VVR_Purpose)}&VVR_Request_id=${encodeURIComponent(requestData.VVR_Request_id)}`,
  );

  if (requestData.VVR_Status) {
    url += `&VVR_Status=${encodeURIComponent(requestData.VVR_Status)}`;
  }

  let config = {
    method: "post",
    url: url,
    data: "",
  };
  return axios.request(config).then((response) => response);
};

const GetVisitRequestById = async (id) => {
  let config = {
    method: "get",
    url: getApiUrl(
      `/VisitRequest/GetVisitRequestById?VVR_Request_id=${encodeURIComponent(id)}`,
    ),
  };
  return axios.request(config).then((response) => response);
};

const GetVisitRequestsByContactPerson = async (cpId) => {
  let config = {
    method: "get",
    url: getApiUrl(
      `/VisitRequest/GetVisitRequestsByContactPerson?VVR_Contact_person_id=${encodeURIComponent(cpId)}`,
    ),
  };
  return axios.request(config).then((response) => response);
};

const GetVisitRequestsByVisitor = async (visitorId) => {
  let config = {
    method: "get",
    url: getApiUrl(
      `/VisitRequest/GetVisitRequestsByVisitor?VVR_Visitor_id=${encodeURIComponent(visitorId)}`,
    ),
  };
  return axios.request(config).then((response) => response);
};

const ApproveVisitRequest = async (id, status) => {
  let config = {
    method: "post",
    url: getApiUrl(
      `/VisitRequest/ApproveVisitRequest?VVR_Request_id=${encodeURIComponent(id)}&VVR_Status=${encodeURIComponent(status)}`,
    ),
    data: "",
  };
  return axios.request(config).then((response) => response);
};

export default {
  GetAllVisitRequests,
  AddVisitRequest,
  UpdateVisitRequest,
  GetVisitRequestById,
  GetVisitRequestsByContactPerson,
  GetVisitRequestsByVisitor,
  ApproveVisitRequest,
};
