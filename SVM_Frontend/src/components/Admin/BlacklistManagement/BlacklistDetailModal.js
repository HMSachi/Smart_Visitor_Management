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
} from "lucide-react";
import { useThemeMode } from "../../../theme/ThemeModeContext";

/* ──────────────────────────────────────────────
   Small helper – labelled field row
────────────────────────────────────────────── */
const Field = ({ icon: Icon, label, value, accent, isLight }) => (
  <div
    className={`flex items-start justify-between gap-4 py-4 border-b last:border-0 ${
      isLight ? "border-gray-200" : "border-white/[0.04]"
    }`}
  >
    <span
      className={`flex items-center gap-2 text-[12px] font-medium tracking-[0.2em] capitalize whitespace-nowrap ${
        isLight ? "text-gray-500" : "text-gray-300/70"
      }`}
    >
      <Icon size={12} className="text-primary/40 flex-shrink-0" />
      {label}
    </span>
    <span
      className={`text-[13px] font-medium tracking-widest text-right break-all ${
        accent ? "text-primary" : isLight ? "text-[#1A1A1A]" : "text-white/90"
      }`}
    >
      {value || "—"}
    </span>
  </div>
);

/* ──────────────────────────────────────────────
   Risk badge (matches BlacklistTable style)
────────────────────────────────────────────── */
const RiskBadge = ({ level }) => {
  const styles = {
    "Level 01": "border-blue-500/20 text-blue-500 bg-blue-500/5",
    "Level 02": "border-primary/20 text-primary bg-primary/5",
    "Level 03":
      "border-primary/40 text-primary bg-primary/10 shadow-[0_0_15px_rgba(200,16,46,0.1)]",
  };
  return (
    <span
      className={`px-4 py-1.5 rounded-full text-[11px] font-medium tracking-[0.25em] uppercase border flex items-center gap-2 w-fit ${
        styles[level] || styles["Level 01"]
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          level === "Level 03"
            ? "bg-primary shadow-[0_0_5px_var(--color-primary)] animate-pulse"
            : "bg-current opacity-80"
        }`}
      />
      {level}
    </span>
  );
};

/* ──────────────────────────────────────────────
   Main modal
────────────────────────────────────────────── */
const BlacklistDetailModal = ({ isOpen, onClose, person }) => {
  const { themeMode } = useThemeMode();
  const isLight = themeMode === "light";

  if (!person) return null;

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
              initial={{ scale: 0.9, opacity: 0, y: 24 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 24 }}
              transition={{ type: "spring", bounce: 0.18, duration: 0.5 }}
              className={`w-full max-w-xl backdrop-blur-2xl border rounded-[28px] pointer-events-auto overflow-hidden relative ${
                isLight
                  ? "bg-white border-gray-200 shadow-[0_24px_70px_rgba(15,23,42,0.18)]"
                  : "bg-[#141416]/98 border-white/10 shadow-[0_24px_70px_rgba(0,0,0,0.75)]"
              }`}
            >
              {/* ambient glow */}
              <div className="absolute top-0 right-0 w-56 h-56 bg-primary/4 rounded-full blur-[90px] pointer-events-none" />
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

              {/* ── Header ── */}
              <div
                className={`p-5 border-b flex justify-between items-center relative z-10 ${
                  isLight ? "border-gray-200 bg-[#F8F9FA]" : "border-white/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-primary/10 border border-primary/15 text-primary shadow-inner">
                    <Ban size={18} />
                  </div>
                  <div>
                    <p
                      className={`text-[10px] font-medium tracking-[0.28em] uppercase mb-1 ${
                        isLight ? "text-gray-500" : "text-gray-300/70"
                      }`}
                    >
                      Blacklist Management
                    </p>
                    <h2
                      className={`text-[15px] font-semibold tracking-[0.12em] capitalize ${
                        isLight ? "text-[#1A1A1A]" : "text-white"
                      }`}
                    >
                      Visitor Details
                    </h2>
                  </div>
                </div>

                {/* Risk badge in header */}
                <div className="flex items-center gap-3">
                  <RiskBadge level={person.VB_Alert_Type} />
                  <button
                    onClick={onClose}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center border border-transparent transition-all duration-300 ${
                      isLight
                        ? "text-gray-500 hover:text-[#1A1A1A] hover:bg-gray-100 hover:border-gray-200"
                        : "text-gray-300/80 hover:text-white hover:bg-white/5 hover:border-white/10"
                    }`}
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* ── Scrollable Body ── */}
              <div
                className={`overflow-y-auto max-h-[60vh] px-5 py-4 space-y-5 relative z-10 scrollbar-thin scrollbar-track-transparent ${
                  isLight
                    ? "scrollbar-thumb-gray-300"
                    : "scrollbar-thumb-white/10"
                }`}
              >
                {/* ── Section: Blacklisted Person ── */}
                <section>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-1 h-3.5 bg-primary rounded-full shadow-[0_0_6px_var(--color-primary)]" />
                    <p className="text-primary text-[10px] font-bold tracking-[0.26em] uppercase">
                      Visitor Information
                    </p>
                  </div>

                  <div
                    className={`rounded-2xl px-5 py-1.5 shadow-inner border ${
                      isLight
                        ? "bg-white border-gray-200 shadow-gray-100/70"
                        : "bg-[var(--color-bg-paper)] border-white/[0.06]"
                    }`}
                  >
                    <Field
                      icon={User}
                      label="Full Name"
                      value={person.VB_Name}
                      isLight={isLight}
                    />
                    <Field
                      icon={Mail}
                      label="Email Address"
                      value={person.VB_Email}
                      isLight={isLight}
                    />
                    <Field
                      icon={Briefcase}
                      label="Role"
                      value={person.VB_Role}
                      isLight={isLight}
                    />
                  </div>
                </section>

                {/* ── Section: Blacklist Details ── */}
                <section>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-1 h-3.5 bg-primary rounded-full shadow-[0_0_6px_var(--color-primary)]" />
                    <p className="text-primary text-[10px] font-bold tracking-[0.26em] uppercase">
                      Blacklist Details
                    </p>
                  </div>

                  <div
                    className={`rounded-2xl px-5 py-1.5 shadow-inner border ${
                      isLight
                        ? "bg-white border-gray-200 shadow-gray-100/70"
                        : "bg-[var(--color-bg-paper)] border-white/[0.06]"
                    }`}
                  >
                    {/* Reason as a styled block */}
                    <div
                      className={`py-3.5 border-b ${
                        isLight ? "border-gray-200" : "border-white/[0.04]"
                      }`}
                    >
                      <span
                        className={`flex items-center gap-2 text-[11px] font-medium tracking-[0.18em] capitalize mb-2 ${
                          isLight ? "text-gray-500" : "text-gray-300/70"
                        }`}
                      >
                        <AlertTriangle size={12} className="text-primary/40" />
                        Blacklist Reason
                      </span>
                      <p
                        className={`text-[12px] font-medium tracking-wide leading-relaxed pl-5 ${
                          isLight ? "text-[#1A1A1A]" : "text-white/90"
                        }`}
                      >
                        {person.VB_Description || "—"}
                      </p>
                    </div>

                    <Field
                      icon={Calendar}
                      label="Date Added"
                      value={
                        person.VB_Created_Date
                          ? person.VB_Created_Date.split(" ")[0]
                          : ""
                      }
                      isLight={isLight}
                    />

                    <Field
                      icon={Shield}
                      label="Risk Level"
                      value={person.VB_Alert_Type}
                      accent
                      isLight={isLight}
                    />
                    <Field
                      icon={Shield}
                      label="Status"
                      value={person.VB_Status === "I" ? "Inactive" : "Active"}
                      accent
                      isLight={isLight}
                    />
                  </div>
                </section>
              </div>

              {/* ── Footer ── */}
              <div
                className={`px-5 py-4 border-t flex justify-end relative z-10 ${
                  isLight
                    ? "border-gray-200 bg-[#F8F9FA]"
                    : "border-white/5 bg-black/20"
                }`}
              >
                <button
                  onClick={onClose}
                  className={`px-6 py-2.5 border text-[11px] font-medium capitalize tracking-widest transition-all rounded-xl shadow-xl ${
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
