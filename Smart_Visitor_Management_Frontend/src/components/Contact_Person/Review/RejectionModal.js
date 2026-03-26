import React from 'react';

const RejectionModal = ({ isOpen, onClose, onConfirm, reason, setReason, comment, setComment }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-8">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-2xl" onClick={onClose}></div>
            <div className="w-full max-w-xl mas-glass border-mas-red/40 p-12 relative z-10 animate-slide-down">
                <div className="mb-8">
                    <h2 className="text-white uppercase mb-2">Request Rejection</h2>
                    <p className="text-mas-text-dim uppercase">Operation: Data Invalidation</p>
                </div>

                <div className="space-y-6 mb-12">
                    <div className="space-y-2">
                        <label className="uppercase text-mas-text-dim">Rejection Reason</label>
                        <select 
                            className="mas-input w-full uppercase"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                        >
                            <option value="">Select Primary Delta</option>
                            <option value="invalid_id">Invalid Identification Documentation</option>
                            <option value="access_denied">Access Range Restriction</option>
                            <option value="duplicate">Duplicate System Node Entry</option>
                            <option value="other">Other Protocol Breach</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="uppercase text-mas-text-dim">Detailed Observations (Required)</label>
                        <textarea 
                            rows="4"
                            placeholder="INPUT ENCRYPTED OBSERVATIONS..."
                            className="mas-input w-full uppercase resize-none"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        ></textarea>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button 
                        onClick={onConfirm}
                        className="flex-1 py-5 bg-mas-red text-white uppercase shadow-[0_0_30px_rgba(200,16,46,0.3)] hover:scale-[1.02] transition-all"
                    >
                        Confirm Rejection
                    </button>
                    <button 
                        onClick={onClose}
                        className="flex-1 py-5 bg-white/5 text-mas-text-dim uppercase border border-white/10 hover:text-white transition-all shadow-none"
                    >
                        Abort
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RejectionModal;
