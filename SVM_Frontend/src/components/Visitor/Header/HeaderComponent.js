import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Menu, X, Home, Plus, LogOut, User, ChevronRight } from "lucide-react";
import { Drawer, IconButton, Box } from "@mui/material";
import { toggleMobileMenu, setMobileMenu } from "../../../reducers/uiSlice";
import ThemeToggleButton from "../../common/ThemeToggleButton";
import { LOGOUT } from "../../../constants/LoginConstants";
import { useThemeMode } from "../../../theme/ThemeModeContext";

const HeaderComponent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isMobileMenuOpen = useSelector((state) => state.ui.isMobileMenuOpen);
  const { user } = useSelector((state) => state.login);
  const { themeMode } = useThemeMode();
  const isLight = themeMode === "light";

  const visitorProfile = user?.ResultSet?.[0] || {};
  const userEmail = visitorProfile.VA_Email || visitorProfile.VV_Email || "";
  const userName =
    visitorProfile.VV_Name ||
    visitorProfile.VA_Name ||
    visitorProfile.fullName ||
    visitorProfile.name ||
    "";
  const initials = userName
    ? userName
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .map((namePart) => namePart[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "??";

  const menuItems = [{ label: "Home", path: "/home", icon: Home }];

  const handleNavigate = (path) => {
    navigate(path);
    dispatch(setMobileMenu(false));
  };

  const handleLogout = () => {
    if (!window.confirm("Are you sure you want to sign out?")) return;
    localStorage.removeItem("user_session");
    dispatch({ type: LOGOUT });
    dispatch(setMobileMenu(false));
    navigate("/login");
  };

  const headerStyle = {
    height: "68px",
    background: isLight ? "rgba(255,255,255,0.9)" : "rgba(10,10,12,0.88)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderBottom: `1px solid ${isLight ? "var(--color-border-soft)" : "rgba(255,255,255,0.05)"}`,
    boxShadow: isLight
      ? "0 8px 28px rgba(17,24,39,0.08)"
      : "0 4px 24px rgba(0,0,0,0.4)",
  };

  return (
    <header
      className="fixed top-0 left-0 w-full z-[100] flex items-center"
      style={headerStyle}
    >
      <div className="px-5 sm:px-8 md:px-12 lg:px-16 w-full flex justify-between items-center">
        {/* Logo */}
        <Link to="/home" className="flex items-center gap-3 group">
          <img
            src="/logo_mas.png"
            alt="MAS Logo"
            className={`h-7 w-auto transition-all ${isLight ? "brightness-75" : "brightness-90"} group-hover:brightness-100`}
          />
          <div className="hidden sm:block w-px h-5 bg-[var(--color-border-soft)]" />
          <span className="hidden sm:block text-[var(--color-text-primary)] font-bold tracking-tight text-[15px]">
            Visitor <span className="text-primary">Portal</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-1)] transition-all"
            >
              <item.icon size={15} />
              {item.label}
            </Link>
          ))}

          <button
            onClick={() => navigate("/request-step-1")}
            className="flex items-center gap-2 ml-2 px-5 py-2.5 rounded-xl text-white text-[13px] font-semibold transition-all"
            style={{
              background:
                "linear-gradient(135deg, var(--color-primary), #A60D26)",
              boxShadow: "0 4px 14px rgba(200,16,46,0.3)",
            }}
          >
            <Plus size={15} />
            Request a Visit
          </button>

          <ThemeToggleButton />

          {userEmail && (
            <>
              <div className="w-px h-6 bg-[var(--color-border-soft)] mx-1" />
              <div className="flex items-center gap-2.5">
                <p className="text-[var(--color-text-primary)] text-[12px] font-semibold truncate max-w-[130px]">
                  {userName || userEmail}
                </p>
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[12px] font-bold"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--color-primary), #8B0C1F)",
                  }}
                >
                  {initials !== "??" ? initials : <User size={15} />}
                </div>
              </div>
            </>
          )}

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] text-[12.5px] font-medium transition-all hover:bg-[var(--color-surface-1)]"
            title="Sign Out"
          >
            <LogOut size={15} />
            <span className="hidden lg:inline">Sign Out</span>
          </button>
        </nav>

        {/* Mobile: Theme + Hamburger */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggleButton />
          <IconButton
            onClick={() => dispatch(toggleMobileMenu())}
            sx={{
              color: "var(--color-text-primary)",
              background: "var(--color-surface-1)",
              border: "1px solid var(--color-border-soft)",
              borderRadius: "10px",
              p: 1,
            }}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </IconButton>
        </div>
      </div>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={isMobileMenuOpen}
        onClose={() => dispatch(setMobileMenu(false))}
        PaperProps={{
          sx: {
            width: "82%",
            maxWidth: "300px",
            background: "var(--color-bg-paper)",
            borderLeft: "1px solid var(--color-border-soft)",
          },
        }}
      >
        <Box className="p-6 h-full flex flex-col">
          {/* Drawer header */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2">
              <img src="/logo_mas.png" alt="MAS" className="h-6 w-auto" />
              <span className="text-[var(--color-text-primary)] font-bold text-sm">
                Visitor Portal
              </span>
            </div>
            <IconButton
              onClick={() => dispatch(setMobileMenu(false))}
              sx={{
                color: "var(--color-text-primary)",
                background: "var(--color-surface-1)",
                borderRadius: "10px",
                p: 0.8,
              }}
            >
              <X size={18} />
            </IconButton>
          </div>

          {/* User info */}
          {userEmail && (
            <div
              className="mb-6 p-4 rounded-2xl"
              style={{
                background: "var(--color-surface-1)",
                border: "1px solid var(--color-border-soft)",
              }}
            >
              <p className="text-primary text-[10px] font-bold uppercase tracking-widest mb-0.5">
                Signed In As
              </p>
              <p className="text-[var(--color-text-primary)] text-sm font-semibold truncate">
                {userName || userEmail}
              </p>
            </div>
          )}

          {/* Nav items */}
          <div className="space-y-2 flex-1">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-[var(--color-text-primary)] text-[14px] font-medium transition-all"
                style={{
                  background: "var(--color-surface-1)",
                  border: "1px solid var(--color-border-soft)",
                }}
              >
                <item.icon size={18} className="text-primary" />
                {item.label}
                <ChevronRight
                  size={16}
                  className="ml-auto text-[var(--color-text-dim)]"
                />
              </button>
            ))}

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-[var(--color-text-secondary)] text-[14px] font-medium transition-all hover:bg-red-500/10"
              style={{ border: "1px solid var(--color-border-soft)" }}
            >
              <LogOut size={18} className="text-primary" />
              Sign Out
              <ChevronRight
                size={16}
                className="ml-auto text-[var(--color-text-dim)]"
              />
            </button>
          </div>

          {/* CTA */}
          <button
            onClick={() => handleNavigate("/request-step-1")}
            className="mt-6 w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-white text-[14px] font-bold transition-all active:scale-95"
            style={{
              background:
                "linear-gradient(135deg, var(--color-primary), #A60D26)",
              boxShadow: "0 4px 20px rgba(200,16,46,0.35)",
            }}
          >
            <Plus size={18} />
            Request a Visit
          </button>
        </Box>
      </Drawer>
    </header>
  );
};

export default HeaderComponent;
