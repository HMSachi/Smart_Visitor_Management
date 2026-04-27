import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import axios from "axios";

const BACKEND_BASE_URL = 'https://visitormanagement.dockyardsoftware.com';
// In development we keep baseURL empty so relative `/api/*` requests go through CRA proxy.
if (process.env.NODE_ENV !== 'development') {
  axios.defaults.baseURL = BACKEND_BASE_URL;
}
axios.defaults.headers.common['Content-Type'] = 'application/json';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
