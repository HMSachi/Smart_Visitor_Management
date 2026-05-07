import axios from "axios";
import { BACKEND_BASE_URL } from "../index";

const getApiUrl = (endpoint) => {
  if (process.env.NODE_ENV === "development") {
    return `/api${endpoint}`;
  }
  return `${BACKEND_BASE_URL}${endpoint}`;
};

const GetAllItemsCarried = async () => {
  let config = {
    method: "get",
    url: getApiUrl("/ItemCarried/GetAllItems"),
  };
  return axios.request(config).then((response) => response);
};

const AddItem = async (itemData) => {
  let config = {
    method: "post",
    url: getApiUrl(
      `/ItemCarried/AddItem?VVR_Request_id=${encodeURIComponent(itemData.VVR_Request_id)}&VIC_Item_Name=${encodeURIComponent(itemData.VIC_Item_Name)}&VIC_Quantity=${encodeURIComponent(itemData.VIC_Quantity)}&VIC_Designation=${encodeURIComponent(itemData.VIC_Designation)}`,
    ),
    data: "",
  };
  return axios.request(config).then((response) => response);
};

const UpdateItem = async (itemData) => {
  let config = {
    method: "post",
    url: getApiUrl(
      `/ItemCarried/UpdateItem?VIC_Item_id=${encodeURIComponent(itemData.VIC_Item_id)}&VIC_Item_Name=${encodeURIComponent(itemData.VIC_Item_Name)}&VIC_Quantity=${encodeURIComponent(itemData.VIC_Quantity)}&VIC_Designation=${encodeURIComponent(itemData.VIC_Designation)}`,
    ),
    data: "",
  };
  return axios.request(config).then((response) => response);
};

const UpdateItemStatus = async (id, status) => {
  let config = {
    method: "post",
    url: getApiUrl(
      `/ItemCarried/UpdateItemStatus?VIC_Item_id=${encodeURIComponent(id)}&VIC_Status=${encodeURIComponent(status)}`,
    ),
    data: "",
  };
  return axios.request(config).then((response) => response);
};

export default {
  GetAllItemsCarried,
  AddItem,
  UpdateItem,
  UpdateItemStatus,
};
