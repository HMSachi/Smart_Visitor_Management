import React from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import AdminSidebar from "../components/Admin/Layout/Sidebar";

const Layout = ({ children }) => {
  const location = useLocation();
  const isMobile = useSelector((state) => state.ui.isMobile);

  const isAdminPath = location.pathname.startsWith("/admin");
  const isContactPath = location.pathname.startsWith("/contact_person");
  const isSecurityPath = location.pathname.startsWith("/Security_Officer");
  const isDashboardPath = isAdminPath || isContactPath || isSecurityPath;
  const isLoginPage = location.pathname === "/login" || location.pathname === "/";

  return (
    <Box
      className={`w-full flex bg-[var(--color-bg-default)] relative
        ${isDashboardPath ? "h-screen overflow-hidden flex-row" : "min-h-screen overflow-x-hidden flex-col"}`}
    >
      {/* Admin sidebar only — Contact & Security layouts handle their own sidebars */}
      {isAdminPath && !isLoginPage && <AdminSidebar />}

      <Box
        component="main"
        className={`flex-1 flex flex-col min-w-0 transition-all duration-500 ease-in-out overflow-x-hidden
          ${isDashboardPath ? "overflow-y-auto" : ""}
          ${isMobile && isDashboardPath ? "w-full" : ""}
          ${isAdminPath ? "admin-theme-root" : ""}
          ${isContactPath ? "contact-theme-root" : ""}
          ${isSecurityPath ? "security-theme-root" : ""}
          ${location.pathname.startsWith("/visitor") ? "visitor-theme-root" : ""}`}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
