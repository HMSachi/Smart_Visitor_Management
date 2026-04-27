import { ArrowLeft, Menu, X, Bell, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toggleMobileMenu } from "../../../reducers/uiSlice";
import ThemeToggleButton from "../../common/ThemeToggleButton";

const Header = ({ title }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isMobile = useSelector((state) => state.ui.isMobile);
  const isMobileMenuOpen = useSelector((state) => state.ui.isMobileMenuOpen);
  const user = useSelector((state) => state.login.user);

  const getIdentity = () => {
    const currentUser = user?.ResultSet?.[0] || user?.data?.ResultSet?.[0];
    if (currentUser?.VCP_Name)
      return { name: currentUser.VCP_Name, email: currentUser.VCP_Email };
    if (currentUser?.VA_Name)
      return { name: currentUser.VA_Name, email: currentUser.VA_Email };
    const persisted = localStorage.getItem("user_session");
    if (persisted) {
      try {
        const s = JSON.parse(persisted);
        const u = s?.ResultSet?.[0] || s?.data?.ResultSet?.[0];
        return {
          name: u?.VCP_Name || u?.VA_Name || "",
          email: u?.VCP_Email || u?.VA_Email || "",
        };
      } catch (e) {
        return { name: "", email: "" };
      }
    }
    return { name: "", email: "" };
  };

  const { name, email } = getIdentity();
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "CP";

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
      {/* Left: Hamburger / Back + Title */}
      <div className="flex items-center gap-3 min-w-0">
        {isMobile ? (
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
        ) : (
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors group shrink-0"
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

        {title && (
          <h2 className="text-[var(--color-text-primary)] text-[14px] font-semibold truncate m-0 hidden sm:block">
            {title}
          </h2>
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        <ThemeToggleButton />

        <div className="hidden sm:block w-px h-5 bg-[var(--color-border-soft)]" />

        <div className="flex items-center gap-2.5">
          <div className="hidden md:block text-right">
            <p className="text-[var(--color-text-primary)] text-[13px] font-semibold leading-tight truncate max-w-[130px]">
              {name || "Contact Person"}
            </p>
            <p className="text-[var(--color-text-dim)] text-[11px] leading-tight truncate">
              {email || "Contact Person"}
            </p>
          </div>
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[13px] font-bold shrink-0"
            style={{
              background:
                "linear-gradient(135deg, var(--color-primary), #8B0C1F)",
            }}
          >
            {initials || <User size={16} />}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
