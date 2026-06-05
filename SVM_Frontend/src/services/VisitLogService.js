import axios from "axios";
import { BACKEND_BASE_URL } from "../index";

const getApiUrl = (endpoint) => `${BACKEND_BASE_URL}${endpoint}`;

const AddVisitLog = async (passId, accessedAreas, expiryDate) => {
  let config = {
    method: "post",
    url: getApiUrl(
      `/VisitLog/AddVisitLog?VVL_Pass_id=${encodeURIComponent(passId)}&VVL_Accessed_Areas=${encodeURIComponent(accessedAreas)}&VVL_Expiry_Date=${encodeURIComponent(expiryDate)}`,
    ),
    data: "",
  };
  return axios.request(config).then((response) => response);
};

export default {
  AddVisitLog,
};
