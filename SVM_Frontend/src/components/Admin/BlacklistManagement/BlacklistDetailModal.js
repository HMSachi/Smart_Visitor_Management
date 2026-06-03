import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import {
  X,
  Ban,
  User,
  Mail,
  Briefcase,
  AlertTriangle,
  Calendar,
  UserCheck,
  Shield,
  Phone,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useThemeMode } from "../../../theme/ThemeModeContext";

/* ──────────────────────────────────────────────
   Small helper – labelled field row
────────────────────────────────────────────── */
const Field = ({ icon: Icon, label, value, accent, isLight }) => (
  <div
    className={`flex items-start justify-between gap-4 py-2.5 border-b last:border-0 ${
      isLight ? "border-gray-200" : "border-white/[0.04]"
    }`}
  >
    <span
      className={`flex items-center gap-2 text-[11px] font-medium tracking-wide whitespace-nowrap ${
        isLight ? "text-gray-500" : "text-gray-300/70"
      }`}
    >
      <Icon size={12} className="text-primary/40 flex-shrink-0" />
      {label}
    </span>
    <span
      className={`text-[11px] font-medium tracking-wide text-right break-all ${
        accent ? "text-primary" : isLight ? "text-[#1A1A1A]" : "text-white/90"
      }`}
    >
      {value || "—"}
    </span>
  </div>
);

/* ──────────────────────────────────────────────
   Main modal
────────────────────────────────────────────── */
const BlacklistDetailModal = ({
  isOpen,
  onClose,
  person,
  onApprove,
  onReject,
  isSecurityPortal,
  isContactPortal,
}) => {
  const { themeMode } = useThemeMode();
  const isLight = themeMode === "light";
  const [visitorDetails, setVisitorDetails] = React.useState(null);
  const [blacklistDetails, setBlacklistDetails] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (isOpen && person?.VB_Visitor_id) {
      const fetchVisitor = async () => {
        setIsLoading(true);
        try {
          const { default: VisitorService } =
            await import("../../../services/VisitorService");
          const response = await VisitorService.GetVisitorById(
            person.VB_Visitor_id,
          );
          const data = response.data?.ResultSet || response.data;
          if (Array.isArray(data) && data.length > 0) {
            setVisitorDetails(data[0]);
          } else if (data && !Array.isArray(data)) {
            setVisitorDetails(data);
          }
        } catch (error) {
          console.error("Failed to fetch visitor details:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchVisitor();
    } else {
      setVisitorDetails(null);
    }
  }, [isOpen, person]);

  React.useEffect(() => {
    if (isOpen && person?.VB_Visitor_id) {
      const fetchBlacklistDetails = async () => {
        try {
          const { default: BlacklistService } =
            await import("../../../services/BlacklistService");
          const response = await BlacklistService.GetBlacklistByVisitorId(
            person.VB_Visitor_id,
          );
          const data = response.data?.ResultSet || response.data || [];
          const resolved = Array.isArray(data) ? data[0] : data;
          setBlacklistDetails(resolved || null);
        } catch (error) {
          console.error("Failed to fetch blacklist details:", error);
          setBlacklistDetails(null);
        }
      };
      fetchBlacklistDetails();
    } else {
      setBlacklistDetails(null);
    }
  }, [isOpen, person]);

  if (!person) return null;

  const displayName =
    visitorDetails?.VV_Name ||
    person.VB_Name ||
    (person.VB_Visitor_id ? `Visitor ID: ${person.VB_Visitor_id}` : "");
  const displayEmail = visitorDetails?.VV_Email || person.VB_Email || "—";
  const displayPhone =
    visitorDetails?.VV_Phone ||
    person.VB_Phone ||
    person.VB_Contact_Number ||
    person.VB_Mobile ||
    "—";
  const displayReason =
    blacklistDetails?.VB_Description || person.VB_Description || "—";
  const displayDate =
    blacklistDetails?.VB_Created_Date || person.VB_Created_Date || "";
  const approvalStatus =
    blacklistDetails?.VB_Approval_Status || person.VB_Approval_Status || "";
  const displayStatus = approvalStatus
    ? approvalStatus.charAt(0).toUpperCase() +
      approvalStatus.slice(1).toLowerCase()
    : person.VB_Status === "I"
      ? "Inactive"
      : "Active";

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ── Backdrop ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className={`fixed inset-0 backdrop-blur-sm z-[100] ${isLight ? "bg-transparent" : "bg-black/40"}`}
          />

          {/* ── Modal ── */}
          <div className="fixed inset-0 flex items-center justify-center p-4 z-[101] pointer-events-none">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className={`w-full max-w-xl backdrop-blur-2xl border rounded-[5px] pointer-events-auto overflow-hidden relative ${
                isLight
                  ? "bg-white border-gray-200 shadow-2xl"
                  : "bg-[#141416]/98 border-white/10 shadow-[0_24px_70px_rgba(0,0,0,0.75)]"
              }`}
            >
              {/* ambient glow */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-[70px] pointer-events-none" />

              {/* ── Header ── */}
              <div
                className={`px-4 py-3 border-b flex justify-between items-center relative z-10 ${
                  isLight ? "border-gray-200 bg-[#F8F9FA]" : "border-white/5"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-[5px] flex items-center justify-center bg-primary/10 border border-primary/15 text-primary shadow-inner">
                    <Ban size={14} />
                  </div>
                  <div>
                    <p
                      className={`text-[11px] font-medium tracking-wide mb-0.5 ${
                        isLight ? "text-gray-500" : "text-gray-300/70"
                      }`}
                    >
                      Blacklist management
                    </p>
                    <h2
                      className={`text-[13px] font-semibold tracking-wide ${
                        isLight ? "text-[#1A1A1A]" : "text-white"
                      }`}
                    >
                      Visitor details
                    </h2>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={onClose}
                    className={`w-7 h-7 rounded-[5px] flex items-center justify-center border border-transparent transition-all duration-300 ${
                      isLight
                        ? "text-gray-500 hover:text-[#1A1A1A] hover:bg-gray-100 hover:border-gray-200"
                        : "text-gray-300/80 hover:text-white hover:bg-white/5 hover:border-white/10"
                    }`}
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>

              {/* ── Scrollable Body ── */}
              <div
                className={`overflow-y-auto max-h-[60vh] px-4 py-4 space-y-4 relative z-10 scrollbar-thin scrollbar-track-transparent ${
                  isLight
                    ? "scrollbar-thumb-gray-300"
                    : "scrollbar-thumb-white/10"
                }`}
              >
                {/* ── Section: Visitor Information ── */}
                <section>
                  <div className="flex items-center gap-2 mb-2.5">
                    <div className="w-1 h-3 bg-primary rounded-[5px] shadow-[0_0_6px_var(--color-primary)]" />
                    <p className="text-primary text-[11px] font-bold tracking-wide">
                      Visitor information
                    </p>
                  </div>

                  <div
                    className={`rounded-[5px] px-4 py-1 shadow-inner border relative ${
                      isLight
                        ? "bg-white border-gray-200 shadow-gray-100/70"
                        : "bg-[var(--color-bg-paper)] border-white/[0.06]"
                    }`}
                  >
                    {isLoading && (
                      <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex justify-center items-center rounded-[5px] z-20">
                        <div className="w-4 h-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                      </div>
                    )}
                    <Field
                      icon={User}
                      label="Full name"
                      value={displayName}
                      isLight={isLight}
                    />
                    <Field
                      icon={Mail}
                      label="Email address"
                      value={displayEmail}
                      isLight={isLight}
                    />
                    <Field
                      icon={Phone}
                      label="Phone number"
                      value={displayPhone}
                      isLight={isLight}
                    />
                  </div>
                </section>

                {/* ── Section: Blacklist Details ── */}
                <section>
                  <div className="flex items-center gap-2 mb-2.5">
                    <div className="w-1 h-3 bg-primary rounded-[5px] shadow-[0_0_6px_var(--color-primary)]" />
                    <p className="text-primary text-[11px] font-bold tracking-wide">
                      Blacklist details
                    </p>
                  </div>

                  <div
                    className={`rounded-[5px] px-4 py-1 shadow-inner border ${
                      isLight
                        ? "bg-white border-gray-200 shadow-gray-100/70"
                        : "bg-[var(--color-bg-paper)] border-white/[0.06]"
                    }`}
                  >
                    {/* Reason block */}
                    <div
                      className={`py-2.5 border-b ${
                        isLight ? "border-gray-200" : "border-white/[0.04]"
                      }`}
                    >
                      <span
                        className={`flex items-center gap-2 text-[11px] font-medium tracking-wide mb-1.5 ${
                          isLight ? "text-gray-500" : "text-gray-300/70"
                        }`}
                      >
                        <AlertTriangle size={12} className="text-primary/40" />
                        Blacklist reason
                      </span>
                      <p
                        className={`text-[11px] font-medium tracking-wide leading-relaxed pl-5 ${
                          isLight ? "text-[#1A1A1A]" : "text-white/90"
                        }`}
                      >
                        {displayReason}
                      </p>
                    </div>

                    <Field
                      icon={Calendar}
                      label="Date added"
                      value={displayDate ? displayDate.split(" ")[0] : ""}
                      isLight={isLight}
                    />

                    <Field
                      icon={Shield}
                      label="Status"
                      value={displayStatus}
                      accent
                      isLight={isLight}
                    />
                  </div>
                </section>
              </div>

              {/* ── Footer ── */}
              <div
                className={`px-4 py-3 border-t flex justify-end items-center gap-2.5 relative z-10 ${
                  isLight
                    ? "border-gray-200 bg-[#F8F9FA]"
                    : "border-white/5 bg-black/20"
                }`}
              >
                {!isSecurityPortal &&
                  !isContactPortal &&
                  person.VB_Approval_Status === "Pending" && (
                    <>
                      <button
                        onClick={() => {
                          onReject(person);
                          onClose();
                        }}
                        className="px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20 text-[11px] font-bold tracking-wide transition-all rounded-[5px] shadow-sm flex items-center gap-1.5"
                      >
                        <XCircle size={12} />
                        Reject
                      </button>
                      <button
                        onClick={() => {
                          onApprove(person);
                          onClose();
                        }}
                        className="px-4 py-2 bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white border border-green-500/20 text-[11px] font-bold tracking-wide transition-all rounded-[5px] shadow-sm flex items-center gap-1.5"
                      >
                        <CheckCircle size={12} />
                        Approve
                      </button>
                    </>
                  )}
                <button
                  onClick={onClose}
                  className={`px-4 py-2 border text-[11px] font-medium tracking-wide transition-all rounded-[5px] shadow-sm ${
                    isLight
                      ? "border-gray-200 text-gray-600 hover:text-[#1A1A1A] hover:border-gray-300 hover:bg-gray-100"
                      : "border-white/10 text-gray-300/90 hover:text-white hover:border-white/20 hover:bg-white/[0.03]"
                  }`}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
};

export default BlacklistDetailModal;
