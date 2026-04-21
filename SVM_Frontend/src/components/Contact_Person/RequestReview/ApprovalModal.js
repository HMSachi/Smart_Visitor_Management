import React from 'react';
import { useThemeMode } from '../../../theme/ThemeModeContext';

const ApprovalModal = ({ isOpen, onClose, onConfirm, comment, setComment }) => {
    const { themeMode } = useThemeMode();
    const isLight = themeMode === "light";

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <div className={`absolute inset-0 backdrop-blur-md transition-colors duration-500 ${isLight ? "bg-white/60" : "bg-[#070708]/95"}`} onClick={onClose}></div>
            <div className={`w-full max-w-xl border rounded-[40px] p-6 md:p-12 relative z-10 animate-fade-in shadow-2xl overflow-hidden group transition-all duration-500 ${
                isLight ? "bg-white border-gray-200" : "bg-[var(--color-bg-paper)] border-white/5"
            }`}>
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-[100px] group-hover:bg-primary/20 transition-all duration-700"></div>

                <div className="mb-10 relative z-10">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-2 h-2 bg-primary rounded-full shadow-[0_0_10px_var(--color-primary)]"></div>
                        <h2 className={`text-xs font-bold uppercase tracking-[0.3em] ${isLight ? "text-[#1A1A1A]" : "text-white"}`}>Approve Request</h2>
                    </div>
                    <p className={`text-[13px] font-medium uppercase tracking-widest opacity-80 ${isLight ? "text-gray-500" : "text-gray-300"}`}>Send this request for final approval</p>
                </div>

                <div className="space-y-6 mb-12 relative z-10">
                    <div className="space-y-3">
                        <label className={`text-[12px] font-medium uppercase tracking-widest ${isLight ? "text-gray-500" : "text-gray-300"}`}>Comments</label>
                        <textarea
                            rows="4"
                            placeholder="Add any notes about this approval..."
                            className={`w-full border rounded-2xl p-5 text-xs font-medium uppercase tracking-widest placeholder:opacity-70 focus:outline-none focus:border-primary transition-all resize-none ${
                                isLight 
                                    ? "bg-gray-50 border-gray-200 text-[#1A1A1A] focus:bg-white" 
                                    : "bg-white/[0.02] border-white/5 text-white focus:bg-white/[0.04]"
                            }`}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        ></textarea>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 relative z-10">
                    <button
                        onClick={onConfirm}
                        className="flex-1 py-5 bg-green-600 text-white text-[14px] font-medium uppercase tracking-[0.2em] rounded-2xl shadow-[0_4px_30px_rgba(22,163,74,0.3)] hover:bg-green-700 transition-all transform active:scale-95"
                    >
                        Confirm
                    </button>
                    <button
                        onClick={onClose}
                        className={`flex-1 py-5 border text-[14px] font-medium uppercase tracking-[0.2em] rounded-2xl transition-all ${
                            isLight 
                                ? "bg-gray-100 border-gray-200 text-gray-600 hover:bg-gray-200" 
                                : "bg-white/[0.03] border-white/5 text-gray-300 hover:text-white hover:border-white/20"
                        }`}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ApprovalModal;
