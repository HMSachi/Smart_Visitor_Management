import { Bell, User, ArrowLeft, Menu, X, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toggleMobileMenu } from "../../../reducers/uiSlice";
import ThemeToggleButton from "../../common/ThemeToggleButton";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isMobile = useSelector((state) => state.ui.isMobile);
  const isMobileMenuOpen = useSelector((state) => state.ui.isMobileMenuOpen);
  const user = useSelector((state) => state.login.user);

  const displayName =
    user?.ResultSet?.[0]?.VA_Name ||
    user?.ResultSet?.[0]?.VCP_Name ||
    "Administrator";
  const displayEmail =
    user?.ResultSet?.[0]?.VA_Email || user?.ResultSet?.[0]?.VCP_Email || "";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

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
      {/* Left: Mobile hamburger / Back button */}
      <div className="flex items-center gap-3">
        {isMobile ? (
          <button
            onClick={() => dispatch(toggleMobileMenu())}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-primary"
            style={{
              background: "var(--color-primary-low)",
              border: "1px solid rgba(200,16,46,0.2)",
            }}
          >
            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        ) : (
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors group"
            style={{
              background: "var(--color-surface-1)",
              border: "1px solid var(--color-border-soft)",
            }}
            title="Go Back"
          >
            <ArrowLeft
              size={17}
              className="group-hover:-translate-x-0.5 transition-transform"
            />
          </button>
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Theme toggle */}
        <ThemeToggleButton />

        {/* Divider — hidden on xs */}
        <div className="hidden sm:block w-px h-6 bg-[var(--color-border-soft)]" />

        {/* User profile */}
        <button
          className="flex items-center gap-2.5 group cursor-default"
          title={displayName}
        >
          {/* Name (desktop) */}
          <div className="hidden md:block text-right">
            <p className="text-[var(--color-text-primary)] text-[13px] font-semibold leading-tight truncate max-w-[140px]">
              {displayName}
            </p>
            <p className="text-[var(--color-text-dim)] text-[11px] leading-tight truncate">
              {displayEmail || "Administrator"}
            </p>
          </div>

          {/* Avatar */}
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[13px] font-bold shrink-0 transition-transform group-hover:scale-105"
            style={{
              background:
                "linear-gradient(135deg, var(--color-primary), #8B0C1F)",
            }}
          >
            {initials || <User size={16} />}
          </div>
        </button>
      </div>
    </header>
  );
};

export default Header;
