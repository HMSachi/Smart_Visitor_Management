import React from "react";
import { Shield, ArrowLeft, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toggleMobileMenu } from "../../../reducers/uiSlice";
import ThemeToggleButton from "../../common/ThemeToggleButton";

const Header = ({ title }) => {
  const formatTitle = (str) => {
    if (!str) return "";
    const cleanStr = str.replace(/_/g, " ");
    return cleanStr
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isMobile = useSelector((state) => state.ui.isMobile);
  const isMobileMenuOpen = useSelector((state) => state.ui.isMobileMenuOpen);
  const user = useSelector((state) => state.login.user);

  const displayName =
    user?.ResultSet?.[0]?.VA_Name ||
    user?.ResultSet?.[0]?.VS_Name ||
    "Security Officer";
  const initials =
    displayName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "SO";

  return (
    <header
      className="sticky top-0 z-40 flex items-center justify-between px-4 sm:px-6"
      style={{
        height: "64px",
        background: "var(--color-bg-paper)",
        borderBottom: "1px solid var(--color-border-soft)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      {/* Left: Back / Hamburger + Title */}
      <div className="flex items-center gap-3 min-w-0">
        {isMobile ? (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => navigate(-1)}
              className="w-9 h-9 flex items-center justify-center rounded-xl text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors group shrink-0"
              style={{
                background: "transparent",
                border: "none",
              }}
              title="Go Back"
            >
              <ArrowLeft
                size={17}
                className="group-hover:-translate-x-0.5 transition-transform"
              />
            </button>
            <button
              onClick={() => dispatch(toggleMobileMenu())}
              className="w-9 h-9 flex items-center justify-center rounded-xl text-primary shrink-0"
              style={{
                background: "var(--color-primary-low)",
                border: "1px solid rgba(200,16,46,0.2)",
              }}
            >
              {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        ) : (
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors group shrink-0"
            style={{
              background: "transparent",
              border: "none",
            }}
            title="Go Back"
          >
            <ArrowLeft
              size={17}
              className="group-hover:-translate-x-0.5 transition-transform"
            />
          </button>
        )}
        {title && (
          <div className="flex items-center gap-3 ml-2 border-l border-[var(--color-border-soft)] pl-4">
            <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-primary rounded-full shadow-[0_0_15px_var(--color-primary)] animate-pulse hidden sm:block"></div>
            <span className="text-[var(--color-text-primary)] text-[14px] sm:text-[15px] font-semibold tracking-wide truncate">
              {formatTitle(title)}
            </span>
          </div>
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        <ThemeToggleButton />

        <div className="hidden sm:block w-px h-5 bg-[var(--color-border-soft)]" />

        <div className="flex items-center gap-1.5">
          <div className="hidden md:block text-right">
            <p className="text-[var(--color-text-primary)] text-[13px] font-semibold leading-tight">
              {displayName}
            </p>
            <p className="text-[var(--color-text-dim)] text-[11px] leading-tight truncate">
              {user?.ResultSet?.[0]?.VA_Email ||
                user?.ResultSet?.[0]?.VS_Email ||
                "Security Officer"}
            </p>
          </div>
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[12px] font-bold shrink-0"
            style={{
              background:
                "linear-gradient(135deg, var(--color-primary), #8B0C1F)",
            }}
          >
            {initials}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
