import { ArrowLeft, Menu, X, Bell, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import React, { useState, useMemo, useEffect, useRef } from "react";
import { toggleMobileMenu } from "../../../reducers/uiSlice";
import ThemeToggleButton from "../../common/ThemeToggleButton";

const Header = ({ title }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isMobile = useSelector((state) => state.ui.isMobile);
  const isMobileMenuOpen = useSelector((state) => state.ui.isMobileMenuOpen);
  const user = useSelector((state) => state.login.user);
  const { visitRequestsByCP } = useSelector((state) => state.visitRequestsState || { visitRequestsByCP: [] });

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

  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef(null);
  
  const [readNotifications, setReadNotifications] = useState(() => {
    try {
      const stored = localStorage.getItem("read_notifications");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const notifications = useMemo(() => {
    if (!visitRequestsByCP || !Array.isArray(visitRequestsByCP)) return [];
    return visitRequestsByCP.filter(
      (req) => {
        const s = (req.VVR_Status || "").toString().trim().toUpperCase();
        return s === "A" || s === "APPROVED" || s === "ADMIN APPROVED";
      }
    ).map(req => ({
      id: req.VVR_Request_id,
      name: req.VV_Name || req.VVR_Visitor_Name || req.Visitor_Name || `Visitor ${req.VVR_Visitor_id || ''}`,
      purpose: req.VVR_Purpose || "Visitation",
      date: req.VVR_Visit_Date ? req.VVR_Visit_Date.split("T")[0] : "N/A"
    })).sort((a, b) => b.id - a.id); // newest first
  }, [visitRequestsByCP]);

  const unreadCount = notifications.filter((n) => !readNotifications.includes(String(n.id))).length;

  const handleNotificationClick = (id) => {
    if (!readNotifications.includes(String(id))) {
      const newRead = [...readNotifications, String(id)];
      setReadNotifications(newRead);
      localStorage.setItem("read_notifications", JSON.stringify(newRead));
    }
  };

  const markAllAsRead = () => {
    const allIds = notifications.map(n => String(n.id));
    const merged = Array.from(new Set([...readNotifications, ...allIds]));
    setReadNotifications(merged);
    localStorage.setItem("read_notifications", JSON.stringify(merged));
  };

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
          <h2 className="text-[var(--color-text-primary)] text-[13px] md:text-[15px] font-black uppercase tracking-tight truncate m-0">
            {title}
          </h2>
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        <ThemeToggleButton />

        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-1)] transition-colors relative"
            title="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-green-500 rounded-full ring-2 ring-[var(--color-bg-paper)] shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
            )}
          </button>

          {showNotifications && (
            <div className="fixed top-[68px] right-4 sm:right-6 w-80 md:w-96 bg-[var(--color-bg-paper)] border border-green-500/20 rounded-2xl shadow-[0_12px_40px_rgba(34,197,94,0.15)] z-50 flex flex-col overflow-hidden max-h-[calc(100vh-100px)]">
              <div className="p-3 md:p-4 border-b border-[var(--color-border-soft)] flex items-center justify-between bg-[var(--color-surface-1)] shrink-0">
                <h3 className="text-[13px] font-bold text-[var(--color-text-primary)] uppercase tracking-wider">Notifications</h3>
                {unreadCount > 0 && (
                  <button onClick={markAllAsRead} className="text-[10px] font-bold text-green-600 hover:text-green-500 tracking-widest uppercase transition-colors">
                    Mark all read
                  </button>
                )}
              </div>
              <div className="overflow-y-auto custom-scrollbar">
                {notifications.length > 0 ? (
                  notifications.map((notif) => {
                    const isUnread = !readNotifications.includes(String(notif.id));
                    return (
                      <div
                        key={notif.id}
                        onClick={() => handleNotificationClick(notif.id)}
                        className={`p-3 md:p-4 border-b border-[var(--color-border-soft)] last:border-b-0 cursor-pointer hover:bg-[var(--color-surface-1)] transition-colors ${isUnread ? 'bg-green-500/[0.04]' : ''}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${isUnread ? 'bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.6)]' : 'bg-transparent'}`}></div>
                          <div>
                            <p className="text-[12px] text-[var(--color-text-primary)] font-medium leading-tight mb-1">
                              Admin approved request <span className="font-bold text-green-600">#{notif.id}</span>
                            </p>
                            <p className="text-[11px] text-[var(--color-text-dim)] leading-snug">
                              <span className="font-semibold text-[var(--color-text-secondary)]">{notif.name}</span> • {notif.purpose}
                            </p>
                            <p className="text-[9px] text-[var(--color-text-dim)] mt-1.5 font-bold tracking-[0.1em] uppercase">
                              Visit Date: {notif.date}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-8 text-center text-[var(--color-text-dim)] text-[11px] font-medium tracking-wide flex flex-col items-center gap-2">
                    <Bell size={24} className="opacity-20" />
                    No new notifications
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

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
