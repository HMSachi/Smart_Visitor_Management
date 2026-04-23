import React from "react";

const ApprovalModal = ({ isOpen, onClose, onConfirm, comment, setComment }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="w-full max-w-xl bg-[#161618]/95 backdrop-blur-3xl border border-white/10 rounded-[40px] p-6 md:p-10 relative z-10 animate-fade-in shadow-[0_30px_100px_rgba(0,0,0,0.6)] overflow-hidden group">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-[100px] group-hover:bg-primary/20 transition-all duration-700 pointer-events-none"></div>

        <div className="mb-8 relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-2 h-2 bg-primary rounded-full shadow-[0_0_10px_var(--color-primary)]"></div>
            <h2 className="text-white text-sm font-semibold tracking-[0.18em] uppercase">
              Approve Request
            </h2>
          </div>
          <p className="text-gray-300 text-sm leading-6 max-w-md">
            Review this request and add a short note if needed before sending
            your approval.
          </p>
        </div>

        <div className="space-y-6 mb-10 relative z-10">
          <div className="space-y-3">
            <label className="text-gray-300 text-[13px] font-medium tracking-wide">
              Approval notes
            </label>
            <textarea
              rows="4"
              placeholder="Add a note for the requester or security team (optional)"
              className="w-full bg-[var(--color-bg-default)] border border-white/5 rounded-2xl p-5 text-white text-sm leading-6 placeholder:text-gray-400 focus:outline-none focus:border-primary/40 focus:bg-[#161618] transition-all resize-none shadow-inner"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 relative z-10">
          <button
            onClick={onConfirm}
            className="flex-1 py-4 bg-primary text-white text-sm font-medium tracking-wide rounded-2xl shadow-[0_5px_20px_rgba(200,16,46,0.25)] hover:bg-primary-dark transition-all transform active:scale-95"
          >
            Send Approval
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-4 bg-white/[0.03] border border-white/5 text-gray-300 text-sm font-medium tracking-wide rounded-2xl hover:text-white hover:border-white/20 hover:bg-white/[0.05] transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApprovalModal;
