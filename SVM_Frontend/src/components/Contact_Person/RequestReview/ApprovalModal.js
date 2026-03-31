import React from 'react';

const ApprovalModal = ({ isOpen, onClose, onConfirm, comment, setComment }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-[#070708]/95 backdrop-blur-md" onClick={onClose}></div>
            <div className="w-full max-w-xl bg-[#121214] border border-white/5 rounded-[40px] p-12 relative z-10 animate-fade-in shadow-2xl overflow-hidden group">
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-mas-red/10 rounded-full blur-[100px] group-hover:bg-mas-red/20 transition-all duration-700"></div>

                <div className="mb-10 relative z-10">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-2 h-2 bg-mas-red rounded-full shadow-[0_0_10px_#C8102E]"></div>
                        <h2 className="text-white text-xs font-bold uppercase tracking-[0.3em]">Protocol Approval</h2>
                    </div>
                    <p className="text-gray-300 text-[10px] font-medium uppercase tracking-widest opacity-80">Dispatch authorization to administrative nodes</p>
                </div>

                <div className="space-y-6 mb-12 relative z-10">
                    <div className="space-y-3">
                        <label className="text-gray-300 text-[9px] font-medium uppercase tracking-widest">Personnel Observations</label>
                        <textarea
                            rows="4"
                            placeholder="INPUT ADMINISTRATIVE COMMENTS OR SECURITY NOTES..."
                            className="w-full bg-white/[0.02] border border-white/5 rounded-2xl p-5 text-white text-xs font-medium uppercase tracking-widest placeholder:opacity-70 focus:outline-none focus:border-mas-red focus:bg-white/[0.04] transition-all resize-none"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        ></textarea>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 relative z-10">
                    <button
                        onClick={onConfirm}
                        className="flex-1 py-5 bg-mas-red text-white text-[11px] font-medium uppercase tracking-[0.2em] rounded-2xl shadow-[0_4px_30px_rgba(200,16,46,0.3)] hover:bg-mas-red-dark transition-all transform active:scale-95"
                    >
                        Confirm Dispatch
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 py-5 bg-white/[0.03] border border-white/5 text-gray-300 text-[11px] font-medium uppercase tracking-[0.2em] rounded-2xl hover:text-white hover:border-white/20 transition-all"
                    >
                        Abort Protocol
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ApprovalModal;
