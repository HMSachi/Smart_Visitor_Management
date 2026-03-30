import React from 'react';
import { Clock, UserCheck, ArrowRight } from 'lucide-react';

const ApprovedTable = ({ requests, onQuickView }) => {
    const getAdminStatusStyle = (status) => {
        if (status === 'Pending Dispatch') {
            return 'text-mas-red bg-mas-red/10 border-mas-red/20';
        }
        return 'text-green-500 bg-green-500/10 border-green-500/20';
    };

    return (
        <div className="bg-[#121214] border border-white/5 rounded-3xl overflow-hidden shadow-2xl animate-fade-in">
            <table className="w-full text-left">
                <thead>
                    <tr className="bg-white/[0.02] border-b border-white/5 text-mas-text-dim text-[10px] font-black uppercase tracking-[0.2em]">
                        <th className="px-8 py-5 w-24">Log ID</th>
                        <th className="px-8 py-5">Visitor Identity</th>
                        <th className="px-8 py-5">Schedule Protocol</th>
                        <th className="px-8 py-5 text-center">Dispatch Status</th>
                        <th className="px-8 py-5 text-right">Control Matrix</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.03]">
                    {requests.map((req) => (
                        <tr key={req.id} className="group transition-all hover:bg-white/[0.01]">
                            <td className="px-8 py-6">
                                <span className="text-white/40 font-mono text-[11px] tracking-widest">#{req.id}</span>
                            </td>
                            <td className="px-8 py-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 flex items-center justify-center text-white text-[11px] font-black group-hover:border-mas-red/40 group-hover:text-mas-red transition-all duration-500">
                                        {req.name[0]}
                                    </div>
                                    <div>
                                        <p className="text-white text-sm font-bold uppercase tracking-wide group-hover:text-mas-red transition-colors">{req.name}</p>
                                        <p className="text-mas-text-dim text-[9px] uppercase tracking-widest font-black opacity-40">Verified Identity</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-8 py-6">
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-2 text-white/80 text-[11px] font-medium">
                                        <Clock size={12} className="text-mas-red/60" />
                                        {req.date}
                                    </div>
                                    <p className="text-mas-text-dim text-[9px] uppercase tracking-[0.1em] pl-5 opacity-60">Synchronized Protocol</p>
                                </div>
                            </td>
                            <td className="px-8 py-6 text-center">
                                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest ${getAdminStatusStyle(req.adminStatus)}`}>
                                    {req.adminStatus === 'Dispatched to Visitor' ? <UserCheck size={10} /> : <Clock size={10} className="animate-pulse" />}
                                    {req.adminStatus}
                                </div>
                            </td>
                            <td className="px-8 py-6 text-right">
                                <button
                                    onClick={() => onQuickView(req)}
                                    className="inline-flex items-center gap-3 px-5 py-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-[10px] font-black text-mas-text-dim uppercase tracking-widest hover:bg-mas-red hover:text-white hover:border-mas-red transition-all group shadow-lg"
                                >
                                    Transmit
                                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </td>
                        </tr>
                    ))}
                    {requests.length === 0 && (
                        <tr>
                            <td colSpan="5" className="px-8 py-20 text-center text-mas-text-dim uppercase text-xs tracking-[0.3em] font-black opacity-30">
                                NO APPROVED PROTOCOLS FOUND
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ApprovedTable;
