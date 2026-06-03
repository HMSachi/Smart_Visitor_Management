import axios from "axios";
import { BACKEND_BASE_URL } from "../index";

const LOGIN_PATH = "/Administrator/LoginAdministrator";

const getApiUrl = (endpoint) => {
  if (process.env.NODE_ENV === "development") {
    return `/api${endpoint}`;
  }
  return `${BACKEND_BASE_URL}${endpoint}`;
};

const GetLogin = async (email, password) => {
  const url = getApiUrl(LOGIN_PATH);
  const params = {
    VA_Email: email,
    VA_Password: password,
  };

  try {
    // Try POST first (matches backend login semantics in most hosted environments).
    const response = await axios.post(url, null, {
      params,
      headers: {
        Accept: "application/json",
      },
      timeout: 15000,
    });
    return response;
  } catch (postError) {
    // Backward-compatible fallback for older backend routes that still expect GET.
    try {
      const getResp = await axios.get(url, {
        params,
        headers: {
          Accept: "application/json",
        },
        timeout: 15000,
      });
      return getResp;
    } catch (getError) {
      // Return the original POST error if both fail and GET gave no richer response.
      if (!getError.response && postError.response) {
        throw postError;
      }
      throw getError;
    }
  }
};

const loginService = {
  GetLogin,
};

export default loginService;
