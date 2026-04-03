import React, { useState } from 'react';
import { ChevronDown, FileText } from 'lucide-react';

const HistoryTable = ({ history }) => {
    const [expandedRow, setExpandedRow] = useState(null);

    return (
        <div className="bg-[var(--color-bg-paper)] border border-white/5 rounded-3xl overflow-hidden shadow-2xl animate-fade-in sm:overflow-visible p-4 sm:p-0">
            <table className="w-full text-left border-separate border-spacing-y-4 sm:border-spacing-y-0 sm:border-collapse min-w-0 sm:min-w-[700px] block sm:table">
                <thead className="hidden sm:table-header-group">
                    <tr className="bg-white/[0.02] border-b border-white/5 text-gray-300 text-[13px] font-medium uppercase tracking-[0.2em]">
                        <th className="px-8 py-5 w-16"></th>
                        <th className="px-8 py-5">Personnel Identity</th>
                        <th className="px-8 py-5">History Timestamp</th>
                        <th className="px-8 py-5">Access Protocol</th>
                        <th className="px-8 py-5 text-right">Archived Status</th>
                    </tr>
                </thead>
                <tbody className="block sm:table-row-group">
                    {history.map((item) => (
                        <React.Fragment key={item.id}>
                            <tr
                                className={`group transition-all cursor-pointer block sm:table-row bg-[#161618] sm:bg-transparent border border-white/5 sm:border-none rounded-3xl sm:rounded-tl-none sm:rounded-tr-none mb-0 sm:mb-0 p-6 sm:p-0 shadow-2xl sm:shadow-none ${expandedRow === item.id ? 'bg-primary/[0.03]' : 'hover:bg-white/[0.01]'}`}
                                onClick={() => setExpandedRow(expandedRow === item.id ? null : item.id)}
                            >
                                <td className="block sm:table-cell px-2 sm:px-8 py-2 sm:py-6 border-b border-white/5 sm:border-none last:border-none">
                                    <div className="flex sm:block justify-between items-center sm:justify-start">
                                        <span className="text-[14px] font-bold tracking-[0.2em] text-primary/60 uppercase block sm:hidden">Expansion Hub</span>
                                        <div className={`transition-transform duration-300 ${expandedRow === item.id ? 'rotate-180' : ''}`}>
                                            <ChevronDown size={14} className={expandedRow === item.id ? 'text-primary' : 'text-gray-300 opacity-80 group-hover:opacity-100'} />
                                        </div>
                                    </div>
                                </td>
                                <td className="block sm:table-cell px-2 sm:px-8 py-4 sm:py-6 border-b border-white/5 sm:border-none last:border-none">
                                    <span className="text-[14px] font-bold tracking-[0.2em] text-primary/60 uppercase block sm:hidden mb-3 text-left">Personnel Identity</span>
                                    <div className="flex items-center gap-4">
                                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 flex items-center justify-center text-white text-[14px] font-medium group-hover:border-primary/40 group-hover:text-primary transition-all duration-500">
                                            {item.visitor[0]}
                                        </div>
                                        <div>
                                            <p className="text-white text-sm font-medium uppercase tracking-wide group-hover:text-primary transition-colors">{item.visitor}</p>
                                            <p className="text-gray-300 text-[12px] uppercase tracking-widest font-medium opacity-80">Entry Authenticated</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="block sm:table-cell px-2 sm:px-8 py-4 sm:py-6 border-b border-white/5 sm:border-none last:border-none">
                                    <span className="text-[14px] font-bold tracking-[0.2em] text-primary/60 uppercase block sm:hidden mb-3 text-left">History Timestamp</span>
                                    <span className="text-white/90 text-[14px] font-medium tracking-wide uppercase break-words">{item.date}</span>
                                </td>
                                <td className="block sm:table-cell px-2 sm:px-8 py-4 sm:py-6 border-b border-white/5 sm:border-none last:border-none">
                                    <span className="text-[14px] font-bold tracking-[0.2em] text-primary/60 uppercase block sm:hidden mb-3 text-left">Access Protocol</span>
                                    <span className="text-[13px] font-medium uppercase tracking-widest px-3 py-1 bg-white/[0.02] border border-white/5 rounded-lg text-gray-300 break-words flex w-fit">{item.category}</span>
                                </td>
                                <td className="block sm:table-cell px-2 sm:px-8 py-4 sm:py-6 text-left sm:text-right">
                                    <span className="text-[14px] font-bold tracking-[0.2em] text-primary/60 uppercase block sm:hidden mb-3 text-left">Archived Status</span>
                                    <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-xl text-[12px] font-medium uppercase tracking-widest border shadow-lg ${item.status === 'Approved' ? 'text-green-500 border-green-500/20 bg-green-500/5 shadow-green-500/5' : 'text-primary border-primary/20 bg-primary/5 shadow-primary/5'}`}>
                                        {item.status === 'Approved' ? 'Validated' : 'Denied'}
                                    </span>
                                </td>
                            </tr>
                            {expandedRow === item.id && (
                                <tr className="block sm:table-row bg-[#0D0D0E] sm:bg-transparent border border-white/5 border-t-0 sm:border-none p-4 sm:p-0 rounded-bl-[24px] rounded-br-[24px] mb-6 sm:mb-0">
                                    <td colSpan="5" className="block sm:table-cell p-4 sm:p-4 md:p-10 sm:px-16 border-y-0 sm:border-y border-white/5">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 animate-fade-in">
                                            <div className="space-y-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-1 h-4 bg-primary rounded-full"></div>
                                                    <span className="text-xs font-medium uppercase tracking-[0.2em] text-white">Personnel Data</span>
                                                </div>
                                                <div className="space-y-4">
                                                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1 group hover:border-primary/20 transition-colors">
                                                        <p className="text-gray-300 text-[12px] uppercase font-medium tracking-widest opacity-80">NIC Registry</p>
                                                        <p className="text-white text-xs font-medium tracking-widest">N-9428103X</p>
                                                    </div>
                                                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1 group hover:border-primary/20 transition-colors">
                                                        <p className="text-gray-300 text-[12px] uppercase font-medium tracking-widest opacity-80">Protocol Sync</p>
                                                        <p className="text-white text-xs font-medium tracking-widest">#SYNC-4281-ALPHA</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-1 h-4 bg-primary rounded-full"></div>
                                                    <span className="text-xs font-medium uppercase tracking-[0.2em] text-white">Mission Profile</span>
                                                </div>
                                                <div className="space-y-4">
                                                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1 group hover:border-primary/20 transition-colors">
                                                        <p className="text-gray-300 text-[12px] uppercase font-medium tracking-widest opacity-80">Designated Host</p>
                                                        <p className="text-white text-xs font-medium tracking-widest uppercase">Sachi (HR-04)</p>
                                                    </div>
                                                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1 group hover:border-primary/20 transition-colors">
                                                        <p className="text-gray-300 text-[12px] uppercase font-medium tracking-widest opacity-80">Total Session</p>
                                                        <p className="text-white text-xs font-medium tracking-widest">02H 15M 42S</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-1 h-4 bg-primary rounded-full"></div>
                                                    <span className="text-xs font-medium uppercase tracking-[0.2em] text-white">Security Protocol</span>
                                                </div>
                                                <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 relative overflow-hidden">
                                                    <div className="absolute top-0 right-0 p-2 opacity-10">
                                                        <FileText size={40} className="text-primary" />
                                                    </div>
                                                    <p className="text-white/70 text-[14px] leading-relaxed font-medium uppercase tracking-wide relative z-10">
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
