import React from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import AdminSidebar from "../components/Admin/Layout/Sidebar";
import ContactSidebar from "../components/Contact_Person/Layout/Sidebar";
import SecuritySidebar from "../components/Security_Officer/Layout/Sidebar";

const Layout = ({ children }) => {
  const location = useLocation();
  const isMobile = useSelector((state) => state.ui.isMobile);

  const isAdminPath = location.pathname.startsWith("/admin");
  const isContactPath = location.pathname.startsWith("/contact_person");
  const isSecurityPath = 
    location.pathname.startsWith("/Security_Officer") || 
    location.pathname.startsWith("/security-dashboard");
  
  const isDashboardPath = isAdminPath || isContactPath || isSecurityPath;
  const isLoginPage = location.pathname === "/login" || location.pathname === "/";

  // For dashboard paths on mobile, we want a clean single-column layout where the sidebar is a Drawer
  // For desktop, we want the sidebar next to the main content.
  
  return (
    <Box
      className={`w-full flex bg-[var(--color-bg-default)] relative
        ${isDashboardPath ? "h-screen overflow-hidden" : "min-h-screen"}
        ${isDashboardPath && !isMobile ? "flex-row" : "flex-col"}`}
    >
      {/* Centralized Sidebar Rendering */}
      {!isLoginPage && (
        <>
          {isAdminPath && <AdminSidebar />}
          {isContactPath && <ContactSidebar />}
          {isSecurityPath && <SecuritySidebar />}
        </>
      )}

      <Box
        component="main"
        className={`flex-1 flex flex-col min-w-0 transition-all duration-500 ease-in-out
          ${isDashboardPath ? "h-full overflow-y-auto overflow-x-hidden" : ""}
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
