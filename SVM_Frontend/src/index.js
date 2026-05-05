import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import axios from "axios";

export const BACKEND_BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  "https://visitormanagement.dockyardsoftware.com";

// In development we keep baseURL empty so relative `/api/*` requests go through CRA proxy.
if (process.env.NODE_ENV !== "development") {
  axios.defaults.baseURL = BACKEND_BASE_URL;
}

// Avoid forcing Content-Type for all requests (especially GET), because in hosted
// cross-origin calls it can trigger CORS preflight on endpoints that don't support OPTIONS.
delete axios.defaults.headers.common["Content-Type"];
axios.defaults.headers.common.Accept = "application/json";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
