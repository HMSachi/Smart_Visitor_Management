import React, { useState } from "react";
import {
  Check,
  X,
  AlertCircle,
  Info,
  ChevronRight,
  MessageSquare,
  Shield,
  Activity,
  Fingerprint,
  Camera,
  Package,
  Car,
  Lock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ApprovalChecklist = ({ visitor, onBack }) => {
  const displayVisitor = visitor || {
    name: "JOHN DOE",
    type: "Staff_Visitor",
    id: "VER-SYNC-4291",
    time: "12:34:02 PM",
    nodeOrigin: "Reception_01",
    initials: "JD",
  };
  const [checks, setChecks] = useState({
    identity: false,
    vehicle: false,
    equipment: false,
  });
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [authenticating, setAuthenticating] = useState(null);

  const toggleCheck = (id) => {
    if (!checks[id]) {
      setAuthenticating(id);
      setTimeout(() => {
        setChecks((prev) => ({ ...prev, [id]: true }));
        setAuthenticating(null);
      }, 1000);
    } else {
      setChecks((prev) => ({ ...prev, [id]: false }));
    }
  };

  const allChecked = Object.values(checks).every((v) => v);

  return (
    <div className="max-w-3xl mx-auto w-full py-8 space-y-4 md:space-y-8">
      {/* Back Button */}
      <div className="mb-2 flex justify-start">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-white/[0.03] border border-white/10 rounded-xl text-gray-300 hover:text-white hover:border-white/30 transition-all flex flex-col md:flex-row items-center gap-3 md:gap-2 text-[12px] font-medium uppercase tracking-widest group"
        >
          <ChevronRight
            size={13}
            className="group-hover:-translate-x-1 transition-transform rotate-180"
          />{" "}
          Back to Request
        </button>
      </div>

      {/* Personnel Authorization Identity Card */}
      <div className="relative group">
        <div className="mas-glass p-5 md:p-6 bg-[var(--color-bg-paper)]/60 backdrop-blur-3xl rounded-[24px] shadow-[0_30px_60px_rgba(0,0,0,0.6)] border border-white/10 overflow-hidden hover:border-primary/20 transition-all duration-700">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
            {/* Profile/Biometric Node */}
            <div className="relative">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-primary flex items-center justify-center text-white text-xl font-medium shadow-[0_0_30px_rgba(200,16,46,0.2)] border border-white/10 relative z-10 group-hover:rotate-6 transition-transform duration-700">
                {displayVisitor.initials}
              </div>
              <div className="absolute -bottom-1 -right-1 p-1.5 bg-[#0D0D0E] rounded-xl border border-white/10 shadow-xl z-20">
                <Fingerprint size={12} className="text-primary animate-pulse" />
              </div>
            </div>

            <div className="flex-1 space-y-4 text-center md:text-left">
              <div className="space-y-2">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
                  <div className="px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20 text-primary text-[11px] font-medium tracking-widest uppercase">
                    {displayVisitor.type}
                  </div>
                  <div className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-gray-300 text-[11px] font-medium tracking-widest uppercase">
                    Ready to Review
                  </div>
                </div>
                <h3 className="text-white text-2xl md:text-3xl font-bold uppercase tracking-widest group-hover:text-primary transition-colors duration-500">
                  {displayVisitor.name}
                </h3>
                <p className="text-gray-300/80 uppercase text-[11px] font-medium tracking-[0.3em] mt-1 underline decoration-primary/20 underline-offset-4">
                  Ref: {displayVisitor.id}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-3 border-t border-white/5">
                <div className="space-y-1">
                  <p className="text-gray-300/80 text-[7px] font-medium uppercase tracking-widest">
                    Time
                  </p>
                  <p className="text-white text-[12px] font-mono font-medium">
                    {displayVisitor.time}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-gray-300/80 text-[7px] font-medium uppercase tracking-widest">
                    Entry Point
                  </p>
                  <p className="text-white text-[12px] font-medium uppercase">
                    {displayVisitor.nodeOrigin.split("_")[0]}
                  </p>
                </div>
                <div className="hidden md:block space-y-1">
                  <p className="text-gray-300/80 text-[7px] font-medium uppercase tracking-widest">
                    Status
                  </p>
                  <div className="flex flex-col md:flex-row items-center gap-4 md:gap-1.5">
                    <Lock size={8} className="text-primary" />
                    <span className="text-white text-[11px] font-medium tracking-widest">
                      Secure
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative corner ID element */}
          <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none font-mono text-[100px] font-medium select-none">
            {displayVisitor.id.split("-").pop()}
          </div>
        </div>
      </div>

      {/* Authorization Matrix Protocol */}
      <div className="space-y-3 md:space-y-6">
        <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4 px-2">
          <div className="flex flex-col md:flex-row items-center gap-3 md:gap-2">
            <Shield size={14} className="text-primary" />
            <h4 className="text-gray-300/30 uppercase text-[11px] font-medium tracking-[0.35em]">
              Review Steps
            </h4>
          </div>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-white/5 via-white/10 to-transparent"></div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {[
            {
              id: "identity",
              label: "Visitor Details",
              desc: "Check the visitor details against the record.",
              icon: Camera,
            },
            {
              id: "vehicle",
              label: "Vehicle",
              desc: "Check the vehicle details if one is listed.",
              icon: Car,
            },
            {
              id: "equipment",
              label: "Items",
              desc: "Check any items the visitor brought with them.",
              icon: Package,
            },
          ].map((item) => {
            const isAuth = authenticating === item.id;
            const isChecked = checks[item.id];
            return (
              <motion.div
                key={item.id}
                whileHover={{ x: 6 }}
                onClick={() => toggleCheck(item.id)}
                className={`mas-glass p-4 md:p-5 border-white/5 bg-[var(--color-bg-paper)]/40 flex items-center justify-between cursor-pointer transition-all duration-500 rounded-[22px] group relative overflow-hidden ${isChecked ? "bg-primary/[0.04] border-primary/20" : "hover:border-white/20"}`}
              >
                <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center relative z-10">
                  <div className="relative">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-700 border ${isChecked ? "bg-primary border-primary text-white rotate-12 shadow-[0_0_20px_var(--color-primary)]" : "bg-[#0D0D0E] border-white/10 text-gray-300 group-hover:border-white"}`}
                    >
                      {isAuth ? (
                        <Activity size={16} className="animate-spin" />
                      ) : isChecked ? (
                        <Check size={18} strokeWidth={4} />
                      ) : (
                        <item.icon size={16} />
                      )}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-col md:flex-row items-center gap-3 md:gap-2">
                      <p
                        className={`text-[12px] font-medium tracking-widest transition-all duration-500 uppercase ${isChecked ? "text-white" : "text-gray-300 group-hover:text-white"}`}
                      >
                        {item.label}
                      </p>
                      {isAuth && (
                        <span className="text-primary text-[7px] font-medium animate-pulse tracking-[0.3em]">
                          Reviewing...
                        </span>
                      )}
                    </div>
                    <p className="text-gray-300/80 text-[11px] font-medium uppercase tracking-widest">
                      {item.desc}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row items-center gap-3 md:gap-3 relative z-10 px-3">
                  <div
                    className={`w-1.5 h-6 rounded-full transition-all duration-700 ${isChecked ? "bg-primary shadow-[0_0_8px_var(--color-primary)]" : "bg-white/5"}`}
                  ></div>
                  <Info
                    size={14}
                    className="text-gray-300/10 group-hover:text-gray-300 transition-colors"
                  />
                </div>

                {/* Internal Scanning Visualizer */}
                {isAuth && (
                  <motion.div
                    className="absolute top-0 left-0 h-full bg-primary/10 group-hover:bg-primary/20 pointer-events-none"
                    animate={{ width: ["0%", "100%"] }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Tactical Action Terminal */}
      <div className="pt-8 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-white/5">
        <button
          onClick={() => setShowRejectModal(true)}
          className="group relative overflow-hidden w-full py-3.5 rounded-xl border border-primary text-primary bg-transparent font-medium uppercase text-[12px] tracking-[0.3em] hover:bg-primary hover:text-white transition-all duration-700 flex items-center justify-center gap-3 shadow-xl active:scale-95"
        >
          <X
            size={14}
            strokeWidth={4}
            className="group-hover:rotate-90 transition-transform duration-500"
          />
          Decline Request
        </button>
        <button
          disabled={!allChecked}
          className={`group relative overflow-hidden w-full py-3.5 rounded-xl font-medium uppercase text-[12px] tracking-[0.3em] flex items-center justify-center gap-3 transition-all duration-700 shadow-2xl active:scale-95 ${allChecked ? "bg-primary text-white shadow-[0_0_50px_rgba(200,16,46,0.3)] cursor-pointer" : "bg-white/5 text-white/10 border border-white/5 cursor-not-allowed opacity-70 grayscale"}`}
        >
          <Check size={14} strokeWidth={4} />
          Approve Request
        </button>
      </div>

      {/* Final Clearance Terminal (Rejection Modal) */}
      <AnimatePresence>
        {showRejectModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
              onClick={() => setShowRejectModal(false)}
            ></motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50, rotateX: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50, rotateX: 20 }}
              transition={{ type: "spring", damping: 20 }}
              className="relative mas-glass max-w-xl w-full p-5 md:p-8 border-primary bg-[#0D0D0E]/95 backdrop-blur-3xl rounded-[28px] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.8)] border border-primary/40"
            >
              {/* Terminal Scanline */}
              <div className="absolute top-0 left-0 w-full h-[1px] bg-primary animate-scan z-20 opacity-80"></div>

              <div className="space-y-5 md:space-y-8 relative z-10">
                <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
                  <div className="p-4 rounded-2xl bg-primary text-white shadow-[0_0_30px_rgba(200,16,46,0.4)] rotate-3">
                    <AlertCircle size={24} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-white text-2xl font-bold uppercase tracking-[0.25em]">
                      Decline Request
                    </h3>
                    <p className="text-primary uppercase text-[11px] font-medium tracking-[0.35em] mt-2 animate-pulse">
                      Please add a short note
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between px-3">
                    <label className="text-gray-300/80 uppercase text-[11px] font-medium tracking-[0.3em]">
                      Reason
                    </label>
                    <MessageSquare
                      size={13}
                      className="text-primary opacity-50"
                    />
                  </div>
                  <div className="relative group">
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Write a short note here..."
                      className="w-full min-h-[150px] bg-white/[0.02] border-2 border-white/10 rounded-3xl p-5 text-white uppercase font-mono text-[12px] tracking-widest placeholder:text-white/20 focus:border-primary/50 focus:bg-primary/[0.02] outline-none transition-all duration-500 resize-none"
                    ></textarea>
                    <div className="absolute bottom-3 right-4 text-gray-300/10 text-[11px] font-medium tracking-widest group-hover:text-primary/40 transition-colors">
                      Note
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                  <button
                    onClick={() => setShowRejectModal(false)}
                    className="flex-1 py-3.5 rounded-2xl bg-white/[0.02] border border-white/10 text-gray-300 uppercase text-[12px] font-medium tracking-[0.3em] hover:text-white hover:bg-white/5 transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={!rejectionReason}
                    className="flex-[2] py-3.5 rounded-2xl bg-primary text-white uppercase text-[12px] font-medium tracking-[0.3em] shadow-[0_0_40px_rgba(200,16,46,0.4)] disabled:opacity-30 disabled:grayscale transition-all duration-500 hover:scale-[1.02] active:scale-95"
                  >
                    Confirm Decline
                  </button>
                </div>
              </div>

              {/* Background decoration */}
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-[60px] pointer-events-none"></div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ApprovalChecklist;
