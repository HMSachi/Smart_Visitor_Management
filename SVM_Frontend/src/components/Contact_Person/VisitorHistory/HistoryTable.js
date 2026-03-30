import React, { useState } from 'react';
import { ChevronDown, FileText } from 'lucide-react';

const HistoryTable = ({ history }) => {
    const [expandedRow, setExpandedRow] = useState(null);

    return (
        <div className="bg-[#121214] border border-white/5 rounded-3xl overflow-hidden shadow-2xl animate-fade-in">
            <table className="w-full text-left">
                <thead>
                    <tr className="bg-white/[0.02] border-b border-white/5 text-mas-text-dim text-[10px] font-black uppercase tracking-[0.2em]">
                        <th className="px-8 py-5 w-16"></th>
                        <th className="px-8 py-5">Personnel Identity</th>
                        <th className="px-8 py-5">History Timestamp</th>
                        <th className="px-8 py-5">Access Protocol</th>
                        <th className="px-8 py-5 text-right">Archived Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.03]">
                    {history.map((item) => (
                        <React.Fragment key={item.id}>
                            <tr
                                className={`group transition-all cursor-pointer ${expandedRow === item.id ? 'bg-mas-red/[0.03]' : 'hover:bg-white/[0.01]'}`}
                                onClick={() => setExpandedRow(expandedRow === item.id ? null : item.id)}
                            >
                                <td className="px-8 py-6">
                                    <div className={`transition-transform duration-300 ${expandedRow === item.id ? 'rotate-180' : ''}`}>
                                        <ChevronDown size={14} className={expandedRow === item.id ? 'text-mas-red' : 'text-mas-text-dim opacity-40 group-hover:opacity-100'} />
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 flex items-center justify-center text-white text-[11px] font-black group-hover:border-mas-red/40 group-hover:text-mas-red transition-all duration-500">
                                            {item.visitor[0]}
                                        </div>
                                        <div>
                                            <p className="text-white text-sm font-bold uppercase tracking-wide group-hover:text-mas-red transition-colors">{item.visitor}</p>
                                            <p className="text-mas-text-dim text-[9px] uppercase tracking-widest font-black opacity-40">Entry Authenticated</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <span className="text-white/60 text-[11px] font-medium tracking-wide uppercase">{item.date}</span>
                                </td>
                                <td className="px-8 py-6">
                                    <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-white/[0.02] border border-white/5 rounded-lg text-mas-text-dim">{item.category}</span>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border shadow-lg ${item.status === 'Approved' ? 'text-green-500 border-green-500/20 bg-green-500/5 shadow-green-500/5' : 'text-mas-red border-mas-red/20 bg-mas-red/5 shadow-mas-red/5'}`}>
                                        {item.status === 'Approved' ? 'Validated' : 'Denied'}
                                    </span>
                                </td>
                            </tr>
                            {expandedRow === item.id && (
                                <tr>
                                    <td colSpan="5" className="bg-[#0D0D0E] p-10 px-16 border-y border-white/5">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 animate-fade-in">
                                            <div className="space-y-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-1 h-4 bg-mas-red rounded-full"></div>
                                                    <span className="text-xs font-black uppercase tracking-[0.2em] text-white">Personnel Data</span>
                                                </div>
                                                <div className="space-y-4">
                                                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1 group hover:border-mas-red/20 transition-colors">
                                                        <p className="text-mas-text-dim text-[9px] uppercase font-black tracking-widest opacity-40">NIC Registry</p>
                                                        <p className="text-white text-xs font-bold tracking-widest">N-9428103X</p>
                                                    </div>
                                                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1 group hover:border-mas-red/20 transition-colors">
                                                        <p className="text-mas-text-dim text-[9px] uppercase font-black tracking-widest opacity-40">Protocol Sync</p>
                                                        <p className="text-white text-xs font-bold tracking-widest">#SYNC-4281-ALPHA</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-1 h-4 bg-mas-red rounded-full"></div>
                                                    <span className="text-xs font-black uppercase tracking-[0.2em] text-white">Mission Profile</span>
                                                </div>
                                                <div className="space-y-4">
                                                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1 group hover:border-mas-red/20 transition-colors">
                                                        <p className="text-mas-text-dim text-[9px] uppercase font-black tracking-widest opacity-40">Designated Host</p>
                                                        <p className="text-white text-xs font-bold tracking-widest uppercase">Sachi (HR-04)</p>
                                                    </div>
                                                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1 group hover:border-mas-red/20 transition-colors">
                                                        <p className="text-mas-text-dim text-[9px] uppercase font-black tracking-widest opacity-40">Total Session</p>
                                                        <p className="text-white text-xs font-bold tracking-widest">02H 15M 42S</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-1 h-4 bg-mas-red rounded-full"></div>
                                                    <span className="text-xs font-black uppercase tracking-[0.2em] text-white">Security Protocol</span>
                                                </div>
                                                <div className="p-6 rounded-2xl bg-mas-red/5 border border-mas-red/10 relative overflow-hidden">
                                                    <div className="absolute top-0 right-0 p-2 opacity-10">
                                                        <FileText size={40} className="text-mas-red" />
                                                    </div>
                                                    <p className="text-white/70 text-[11px] leading-relaxed font-medium uppercase tracking-wide relative z-10">
                                                        "Entry verified through primary biometric point. All assets cleared by security node 04. No protocol anomalies detected during visitation window."
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default HistoryTable;
