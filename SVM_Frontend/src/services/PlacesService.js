import axios from "axios";
import { BACKEND_BASE_URL } from "../index";

const getApiUrl = (endpoint) => {
  if (process.env.NODE_ENV === "development") {
    return `/api${endpoint}`;
  }
  return `${BACKEND_BASE_URL}${endpoint}`;
};

const GetAllPlaces = async (status = null) => {
  let url = "/AdminItemList/GetAllAdminItemsList";
  if (status) {
    url += `?VAIL_Status=${encodeURIComponent(status)}`;
  }
  let config = {
    method: "get",
    url: getApiUrl(url),
  };
  return axios.request(config).then((response) => response);
};

const GetPlaceById = async (id) => {
  let config = {
    method: "get",
    url: getApiUrl(`/AdminItemList/GetByItemID?VAIL_Item_List_ID=${encodeURIComponent(id)}`),
  };
  return axios.request(config).then((response) => response);
};

const AddPlace = async (placeData) => {
  let config = {
    method: "post",
    url: getApiUrl(
      `/AdminItemList/AddAdminItemList?VA_Admin_id=${encodeURIComponent(
        placeData.VA_Admin_id
      )}&VAIL_Item_Name=${encodeURIComponent(
        placeData.VAIL_Item_Name
      )}&P_UID=${encodeURIComponent(placeData.P_UID)}`
    ),
    data: "",
  };
  return axios.request(config).then((response) => response);
};

const UpdatePlace = async (placeData) => {
  let config = {
    method: "post",
    url: getApiUrl(
      `/AdminItemList/UpdateItemNameByItemId?VAIL_Item_List_ID=${encodeURIComponent(
        placeData.VAIL_Item_List_ID
      )}&VAIL_Item_Name=${encodeURIComponent(
        placeData.VAIL_Item_Name
      )}&P_UID=${encodeURIComponent(placeData.P_UID)}`
    ),
    data: "",
  };
  return axios.request(config).then((response) => response);
};

const UpdatePlaceStatus = async (id, status, uid) => {
  let config = {
    method: "post",
    url: getApiUrl(
      `/AdminItemList/UpdateStatusByItemID?VAIL_Item_List_ID=${encodeURIComponent(
        id
      )}&VAIL_Status=${encodeURIComponent(status)}&P_UID=${encodeURIComponent(
        uid
      )}`
    ),
    data: "",
  };
  return axios.request(config).then((response) => response);
};

export default {
  GetAllPlaces,
  GetPlaceById,
  AddPlace,
  UpdatePlace,
  UpdatePlaceStatus,
};
