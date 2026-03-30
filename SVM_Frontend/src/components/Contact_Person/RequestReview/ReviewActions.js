import React from 'react';
import { Send, ShieldAlert, Check } from 'lucide-react';

const ReviewActions = ({ onApprove, onReject }) => {
    return (
        <div className="bg-[#121214] border border-white/5 p-10 rounded-[32px] shadow-2xl animate-fade-in-slow">
            <div className="flex flex-col md:flex-row items-center justify-between gap-10">
                <div className="flex-1">
                    <h4 className="text-white text-[11px] font-black tracking-[0.2em] uppercase mb-1">Authorization Finalization</h4>
                    <p className="text-mas-text-dim text-[9px] font-black uppercase tracking-widest opacity-40">Synchronize decision with Administrative Node 01</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <button
                        onClick={onApprove}
                        className="flex-1 sm:flex-none px-10 py-4 bg-mas-red text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl flex items-center justify-center gap-4 shadow-[0_4px_30px_rgba(200,16,46,0.3)] hover:bg-mas-red-dark hover:shadow-[0_4px_40px_rgba(200,16,46,0.5)] transition-all transform active:scale-[0.98] group"
                    >
                        <Check size={18} className="group-hover:scale-125 transition-transform" />
                        Transmit Protocol
                    </button>
                    <button
                        onClick={onReject}
                        className="flex-1 sm:flex-none px-10 py-4 bg-white/[0.03] border border-white/5 text-mas-text-dim text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl flex items-center justify-center gap-4 hover:border-mas-red/50 hover:text-white transition-all transform active:scale-[0.98] group"
                    >
                        <ShieldAlert size={18} className="group-hover:text-mas-red transition-colors" />
                        Deny Entry
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReviewActions;
