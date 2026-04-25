import React from "react";
import { useThemeMode } from "../../../theme/ThemeModeContext";

const RejectionModal = ({
  isOpen,
  onClose,
  onConfirm,
  reason,
  setReason,
  comment,
  setComment,
}) => {
  const { themeMode } = useThemeMode();
  const isLight = themeMode === "light";

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className={`absolute inset-0 backdrop-blur-sm ${isLight ? "bg-black/55" : "bg-[#070708]/85"}`}
        onClick={onClose}
      ></div>
      <div
        className={`w-full max-w-md border rounded-3xl p-5 md:p-6 relative z-10 animate-fade-in shadow-2xl overflow-hidden ${isLight ? "bg-white border-gray-200" : "bg-[var(--color-bg-paper)] border-white/10"}`}
      >
        <div className="absolute -top-24 -right-24 w-40 h-40 bg-primary/10 rounded-full blur-[90px] pointer-events-none"></div>

        <div className="mb-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-3 md:gap-3 mb-2">
            <div className="w-2 h-2 bg-primary rounded-full shadow-[0_0_10px_var(--color-primary)]"></div>
            <h2
              className={`text-sm font-bold tracking-[0.08em] ${isLight ? "text-[#1A1A1A]" : "text-white"}`}
            >
              Reject Request
            </h2>
          </div>
          <p
            className={`text-[12px] font-medium ${isLight ? "text-gray-500" : "text-gray-300/80"}`}
          >
            Tell us why this visitor request is being rejected.
          </p>
        </div>

        <div className="space-y-4 mb-6 relative z-10">
          <div className="space-y-3">
            <label
              className={`text-[11px] font-semibold uppercase tracking-[0.12em] ${isLight ? "text-gray-500" : "text-gray-300"}`}
            >
              Rejection Reason
            </label>
            <select
              className={`w-full border rounded-xl px-3.5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.08em] focus:outline-none focus:border-primary transition-all appearance-none cursor-pointer ${isLight ? "bg-white border-gray-200 text-[#1A1A1A] focus:bg-gray-50" : "bg-white/[0.02] border-white/10 text-white focus:bg-white/[0.04]"}`}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            >
              <option
                value=""
                className={
                  isLight
                    ? "bg-white text-[#1A1A1A]"
                    : "bg-[var(--color-bg-paper)] text-white"
                }
              >
                Select a reason
              </option>
              <option
                value="invalid_id"
                className={
                  isLight
                    ? "bg-white text-[#1A1A1A]"
                    : "bg-[var(--color-bg-paper)] text-white"
                }
              >
                Invalid ID or passport details
              </option>
              <option
                value="access_denied"
                className={
                  isLight
                    ? "bg-white text-[#1A1A1A]"
                    : "bg-[var(--color-bg-paper)] text-white"
                }
              >
                Access is not allowed for this visit
              </option>
              <option
                value="duplicate"
                className={
                  isLight
                    ? "bg-white text-[#1A1A1A]"
                    : "bg-[var(--color-bg-paper)] text-white"
                }
              >
                Duplicate request
              </option>
              <option
                value="other"
                className={
                  isLight
                    ? "bg-white text-[#1A1A1A]"
                    : "bg-[var(--color-bg-paper)] text-white"
                }
              >
                Other reason
              </option>
            </select>
          </div>

          <div className="space-y-3">
            <label
              className={`text-[11px] font-semibold uppercase tracking-[0.12em] ${isLight ? "text-gray-500" : "text-gray-300"}`}
            >
              Additional Comment (Required)
            </label>
            <textarea
              rows="4"
              placeholder="Briefly explain why this request is being rejected..."
              className={`w-full border rounded-xl px-3.5 py-3 text-[12px] font-medium placeholder:opacity-70 focus:outline-none focus:border-primary transition-all resize-none ${isLight ? "bg-white border-gray-200 text-[#1A1A1A] focus:bg-gray-50 placeholder:text-gray-400" : "bg-white/[0.02] border-white/10 text-white focus:bg-white/[0.04] placeholder:text-white/50"}`}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 relative z-10">
          <button
            onClick={onConfirm}
            className="flex-1 py-3 bg-primary text-white text-[12px] font-semibold uppercase tracking-[0.14em] rounded-xl shadow-[0_4px_24px_rgba(200,16,46,0.25)] hover:bg-primary-dark transition-all transform active:scale-95"
          >
            Reject Request
          </button>
          <button
            onClick={onClose}
            className={`flex-1 py-3 border text-[12px] font-semibold uppercase tracking-[0.14em] rounded-xl transition-all ${isLight ? "bg-white border-gray-200 text-gray-600 hover:text-[#1A1A1A] hover:border-gray-300" : "bg-white/[0.03] border-white/10 text-gray-300 hover:text-white hover:border-white/20"}`}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectionModal;
