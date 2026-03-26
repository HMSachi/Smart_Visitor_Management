import React from 'react';
import { Info, CheckCircle, XCircle, Clock } from 'lucide-react';

const ReviewActions = ({ onApprove, onReject }) => {
    return (
        <div className="space-y-8 sticky top-32">
            <div className="mas-glass border-mas-border p-10 bg-mas-red/[0.02]">
                <div className="flex items-center gap-4 mb-8">
                    <Info size={16} className="text-mas-red" />
                    <h3 className="uppercase text-white">Review Summary</h3>
                </div>
                
                <div className="space-y-6 mb-12 border-b border-mas-border pb-8">
                    <div className="flex justify-between">
                        <span className="text-mas-text-dim uppercase">Submitted</span>
                        <span className="text-white">2 Minutes Ago</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-mas-text-dim uppercase">History</span>
                        <span className="text-white">First Visit</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-mas-text-dim uppercase">Flagged Ops</span>
                        <span className="text-green-500">None</span>
                    </div>
                </div>

                <div className="space-y-4 mb-8 border-t border-mas-border pt-6">
                    <label className="text-mas-text-dim uppercase text-xs">Contact Person Observation (Optional)</label>
                    <textarea 
                        className="mas-input w-full bg-white/[0.02] border border-white/5 focus:bg-white/[0.04] h-24 p-4 placeholder:text-white/20"
                        placeholder="Add comments for the Admin / Security Node before approval..."
                    ></textarea>
                </div>

                <div className="space-y-4">
                    <button 
                        onClick={onApprove}
                        className="w-full py-5 bg-mas-red text-white uppercase flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(200,16,46,0.2)] hover:shadow-[0_0_40px_rgba(200,16,46,0.4)] transition-all transform active:scale-[0.98]"
                    >
                        <CheckCircle size={18} />
                        Approve & Send to Admin
                    </button>
                    <button 
                        onClick={onReject}
                        className="w-full py-5 bg-transparent border border-white/10 text-mas-text-dim uppercase flex items-center justify-center gap-3 hover:border-mas-red/50 hover:text-white transition-all transform active:scale-[0.98]"
                    >
                        <XCircle size={18} />
                        Reject Request
                    </button>
                </div>
            </div>

            <div className="p-8 border border-white/5 bg-white/[0.01]">
                <h4 className="text-mas-text-dim uppercase mb-4 flex items-center gap-3">
                    <Clock size={14} />
                    Review Countdown
                </h4>
                <div className="h-1 w-full bg-white/5 overflow-hidden">
                     <div className="h-full bg-mas-red w-[75%] animate-pulse"></div>
                </div>
                <p className="text-mas-text-dim uppercase mt-2 text-right">Node Synchronization: 14:02 Left</p>
            </div>
        </div>
    );
};

export default ReviewActions;
