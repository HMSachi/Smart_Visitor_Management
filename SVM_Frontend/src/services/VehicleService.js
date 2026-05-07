import axios from "axios";
import { BACKEND_BASE_URL } from "../index";

const getApiUrl = (endpoint) => {
  if (process.env.NODE_ENV === "development") {
    return `/api${endpoint}`;
  }
  return `${BACKEND_BASE_URL}${endpoint}`;
};

const GetAllVehicles = async () => {
  let config = {
    method: "get",
    url: getApiUrl("/Vehicle/GetAllVehicles"),
  };
  return axios.request(config).then((response) => response);
};

const AddVehicle = async (vehicleData) => {
  let config = {
    method: "post",
    url: getApiUrl(
      `/Vehicle/AddVehicle?VV_Vehicle_Type=${encodeURIComponent(vehicleData.VV_Vehicle_Type)}&VVR_Request_id=${encodeURIComponent(vehicleData.VVR_Request_id)}&VV_Vehicle_Number=${encodeURIComponent(vehicleData.VV_Vehicle_Number)}`,
    ),
    data: "",
  };
  return axios.request(config).then((response) => response);
};

const UpdateVehicle = async (vehicleData) => {
  let config = {
    method: "post",
    url: getApiUrl(
      `/Vehicle/UpdateVehicle?VV_Vehicle_Number=${encodeURIComponent(vehicleData.VV_Vehicle_Number)}&VV_Vehicle_id=${encodeURIComponent(vehicleData.VV_Vehicle_id)}`,
    ),
    data: "",
  };
  return axios.request(config).then((response) => response);
};

const GetVehicleById = async (id) => {
  let config = {
    method: "get",
    url: getApiUrl(
      `/Vehicle/GetVehicleById?VV_Vehicle_id=${encodeURIComponent(id)}`,
    ),
  };
  return axios.request(config).then((response) => response);
};

const UpdateVehicleStatus = async (id, status) => {
  let config = {
    method: "post",
    url: getApiUrl(
      `/Vehicle/UpdateVehicleStatus?VV_Status=${encodeURIComponent(status)}&VV_Vehicle_id=${encodeURIComponent(id)}`,
    ),
    data: "",
  };
  return axios.request(config).then((response) => response);
};

const GetVehicleByNumber = async (number) => {
  let config = {
    method: "get",
    url: getApiUrl(
      `/Vehicle/GetVehicleByNumber?VV_Vehicle_Number=${encodeURIComponent(number)}`,
    ),
  };
  return axios.request(config).then((response) => response);
};

export default {
  GetAllVehicles,
  AddVehicle,
  UpdateVehicle,
  GetVehicleById,
  UpdateVehicleStatus,
  GetVehicleByNumber,
};
