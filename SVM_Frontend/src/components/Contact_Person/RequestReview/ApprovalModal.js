import React from 'react';

const ApprovalModal = ({ isOpen, onClose, onConfirm, comment, setComment }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-8">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-2xl" onClick={onClose}></div>
            <div className="w-full max-w-xl mas-glass border-green-500/40 p-12 relative z-10 animate-slide-down">
                <div className="mb-8 border-b border-white/5 pb-6">
                    <h2 className="text-white uppercase mb-2">Request Approval</h2>
                    <p className="text-mas-text-dim uppercase">Operation: Dispatch to Admin</p>
                </div>

                <div className="space-y-6 mb-12">
                    <div className="space-y-2">
                        <label className="uppercase text-mas-text-dim">Contact Person Observation (Optional)</label>
                        <textarea 
                            rows="4"
                            placeholder="ADD COMMENTS FOR THE ADMIN / SECURITY NODE BEFORE APPROVAL..."
                            className="mas-input w-full uppercase resize-none bg-white/[0.02] border border-white/5 focus:border-green-500/50 focus:bg-white/[0.04] p-4 text-white placeholder:text-white/20 transition-all focus:outline-none"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        ></textarea>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button 
                        onClick={onConfirm}
                        className="flex-1 py-5 bg-green-600 text-white uppercase shadow-[0_0_30px_rgba(34,197,94,0.3)] hover:bg-green-500 hover:shadow-[0_0_40px_rgba(34,197,94,0.5)] active:scale-[0.98] transition-all"
                    >
                        Confirm & Send
                    </button>
                    <button 
                        onClick={onClose}
                        className="flex-1 py-5 bg-transparent border border-white/10 text-mas-text-dim uppercase hover:text-white hover:border-white/30 transition-all"
                    >
                        Abort
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ApprovalModal;
