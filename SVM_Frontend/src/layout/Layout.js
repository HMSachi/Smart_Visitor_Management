import React from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import Sidebar from "../components/Admin/Layout/Sidebar";

const Layout = ({ children }) => {
  const location = useLocation();
  const isMobile = useSelector((state) => state.ui.isMobile);

  // Paths that should show the Admin/Staff Sidebar
  const isDashboardPath =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/contact_person") ||
    location.pathname.startsWith("/Security_Officer");

  const isAdminPath = location.pathname.startsWith("/admin");
  const isLoginPage =
    location.pathname === "/login" || location.pathname === "/";

  return (
    <Box
      className={`${isDashboardPath ? "h-screen overflow-hidden flex-col md:flex-row" : "min-h-screen overflow-x-hidden flex-col"} w-full flex bg-background relative`}
    >
      {isAdminPath && !isLoginPage && <Sidebar />}

      <Box
        component="main"
        className={`flex-1 flex flex-col min-w-0 transition-all duration-500 ease-in-out overflow-x-hidden
                    ${isDashboardPath ? "overflow-y-auto" : ""}
                    ${!isDashboardPath && !isLoginPage ? "pt-2" : ""}
                    ${isMobile && isDashboardPath ? "w-full" : ""}
                    ${isAdminPath ? "admin-theme-root" : ""}
                    ${location.pathname.startsWith("/contact_person") ? "contact-theme-root" : ""}
                    ${location.pathname.startsWith("/visitor") ? "visitor-theme-root" : ""}`}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
