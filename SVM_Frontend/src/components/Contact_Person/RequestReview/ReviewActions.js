import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

const ReviewActions = ({ onApprove, onReject }) => {
    return (
        <div className="mas-glass border-mas-border p-8 bg-[#0E0E10] border border-white/5 shadow-sm">

            <div className="flex flex-col sm:flex-row gap-4">
                <button 
                    onClick={onApprove}
                    className="flex-1 py-4 bg-mas-red text-white uppercase flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(200,16,46,0.2)] hover:shadow-[0_0_40px_rgba(200,16,46,0.4)] transition-all transform active:scale-[0.98]"
                >
                    <CheckCircle size={18} />
                    Approve & Send to Admin
                </button>
                <button 
                    onClick={onReject}
                    className="flex-1 py-4 bg-transparent border border-white/10 text-mas-text-dim uppercase flex items-center justify-center gap-3 hover:border-mas-red/50 hover:text-white transition-all transform active:scale-[0.98]"
                >
                    <XCircle size={18} />
                    Reject Request
                </button>
            </div>
        </div>
    );
};

export default ReviewActions;
