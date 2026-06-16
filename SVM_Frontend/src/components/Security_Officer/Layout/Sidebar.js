import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  ShieldCheck,
  QrCode,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ShieldAlert,
  Users,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Drawer, Box, IconButton } from "@mui/material";
import { toggleSidebar, setMobileMenu } from "../../../reducers/uiSlice";
import { LOGOUT } from "../../../constants/LoginConstants";

const menuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: ShieldCheck,
    path: "/Security_Officer/dashboard",
  },
  {
    id: "scanner",
    label: "Check-in / Check-out",
    icon: QrCode,
    path: "/Security_Officer/scanner",
  },
  {
    id: "active-visitors",
    label: "Active/Left Visitors",
    icon: Users,
    path: "/Security_Officer/active-visitors",
  },
  {
    id: "blacklist",
    label: "Block Visitor",
    icon: ShieldAlert,
    path: "/Security_Officer/blacklist-management",
  },
];

const SidebarItem = ({ icon: Icon, label, active, onClick, collapsed }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-300 mb-1 group relative text-left
      ${
        active
          ? "bg-primary/15 border border-primary/25 text-primary"
          : "hover:bg-[var(--color-surface-2)] border border-transparent text-[var(--color-text-dim)] hover:text-[var(--color-text-primary)]"
      }
      ${collapsed ? "justify-center px-2.5" : ""}`}
  >
    <div
      className={`shrink-0 transition-transform duration-300 ${!active && "group-hover:scale-110"}`}
    >
      <Icon size={19} strokeWidth={active ? 2.2 : 1.8} />
    </div>
    {!collapsed && (
      <span className="text-[13.5px] font-medium whitespace-nowrap overflow-hidden text-ellipsis">
        {label}
      </span>
    )}
    {active && !collapsed && (
      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
    )}
    {collapsed && (
      <div className="absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[var(--color-bg-elevated)] border border-[var(--color-border-medium)] rounded-lg text-[12px] font-semibold text-[var(--color-text-primary)] whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-50 shadow-xl transition-all duration-200 translate-x-1 group-hover:translate-x-0">
        {label}
      </div>
    )}
  </button>
);

const SidebarContent = ({
  isCollapsed,
  currentPath,
  onNavigate,
  onLogout,
  user,
}) => {
  const displayName =
    user?.ResultSet?.[0]?.VA_Name ||
    user?.ResultSet?.[0]?.VS_Name ||
    "Security Officer";
  const displayEmail =
    user?.ResultSet?.[0]?.VA_Email || user?.ResultSet?.[0]?.VS_Email || "";
  const initials =
    displayName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "SO";

  return (
    <Box
      className="h-full flex flex-col"
      style={{
        background: "var(--color-bg-paper)",
        borderRight: "none",
      }}
    >
      {/* Logo */}
      <div
        className={`flex items-center gap-3 px-4 py-5 border-none ${isCollapsed ? "justify-center" : ""}`}
      >
        <img
          src="/logo_mas.png"
          alt="MAS Logo"
          className="h-7 w-auto shrink-0 transition-all duration-300"
        />
        {!isCollapsed && (
          <div className="min-w-0 animate-fade-in">
            <p className="text-[var(--color-text-primary)] text-[13px] font-bold tracking-tight leading-tight">
              Security Portal
            </p>
            <p className="text-primary text-[11px] font-medium tracking-wide">
              MAS Holdings
            </p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto no-scrollbar">
        {!isCollapsed && (
          <p className="text-[10.5px] uppercase font-semibold text-[var(--color-text-dim)] tracking-widest px-3 mb-3">
            <br></br>
          </p>
        )}
        {menuItems.map((item) => (
          <SidebarItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            active={currentPath === item.path}
            onClick={() => onNavigate(item.path)}
            collapsed={isCollapsed}
          />
        ))}
      </nav>

      {/* User & Logout */}
      <div className="px-3 py-4 border-none">
        <button
          onClick={onLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border border-[var(--color-border-soft)] text-[var(--color-text-secondary)] hover:text-[var(--color-error)] hover:border-[var(--color-error)]/30 transition-all duration-300 mb-3 ${isCollapsed ? "justify-center" : ""}`}
          title="Sign Out"
        >
          <LogOut size={17} className="shrink-0" />
          {!isCollapsed && (
            <span className="text-[13px] font-medium">Sign Out</span>
          )}
        </button>
      </div>
    </Box>
  );
};

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.login.user);
  const isCollapsed = useSelector((state) => state.ui.isSidebarCollapsed);
  const isMobile = useSelector((state) => state.ui.isMobile);
  const isMobileMenuOpen = useSelector((state) => state.ui.isMobileMenuOpen);

  const handleNavigate = (path) => {
    navigate(path);
    if (isMobile) dispatch(setMobileMenu(false));
  };

  const handleLogout = () => {
    if (!window.confirm("Are you sure you want to sign out?")) return;
    try {
      localStorage.removeItem("user_session");
    } catch (err) {
      console.warn("localStorage access blocked:", err);
    }
    dispatch({ type: LOGOUT });
    navigate("/login");
  };

  const contentProps = {
    isCollapsed: false,
    currentPath: location.pathname,
    onNavigate: handleNavigate,
    onLogout: handleLogout,
    user,
  };

  if (isMobile) {
    return (
      <Drawer
        anchor="left"
        open={isMobileMenuOpen}
        onClose={() => dispatch(setMobileMenu(false))}
        PaperProps={{
          sx: { width: 280, border: "none", background: "transparent" },
        }}
      >
        <SidebarContent {...contentProps} />
      </Drawer>
    );
  }

  return (
    <aside
      className="flex-none relative h-screen transition-[width] duration-500 ease-in-out z-40"
      style={{ width: isCollapsed ? "72px" : "256px" }}
    >
      <SidebarContent {...contentProps} isCollapsed={isCollapsed} />
      <IconButton
        onClick={() => dispatch(toggleSidebar())}
        size="small"
        sx={{
          position: "absolute",
          right: 4,
          top: 76,
          width: 24,
          height: 24,
          background: "transparent",
          border: "none",
          color: "var(--color-primary)",
          "&:hover": { 
            background: "var(--color-primary-low)", 
            color: "var(--color-primary)"
          },
          transition: "all 0.2s ease",
          zIndex: 50,
        }}
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </IconButton>
    </aside>
  );
};

export default Sidebar;
