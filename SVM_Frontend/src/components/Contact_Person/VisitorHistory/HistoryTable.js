import React, { useState } from 'react';
import { ChevronDown, FileText } from 'lucide-react';

const HistoryTable = ({ history }) => {
    const [expandedRow, setExpandedRow] = useState(null);

    return (
        <div className="bg-[var(--color-bg-paper)] border border-[var(--color-border-soft)] rounded-3xl overflow-hidden shadow-xl shadow-black/20 animate-fade-in sm:overflow-visible p-4 sm:p-0">
            
<div className="overflow-x-auto w-full max-w-full pb-4">
<table className="w-full text-left border-separate border-spacing-y-4 sm:border-spacing-y-0 sm:border-collapse min-w-0 sm:min-w-[700px] block sm:table">
                <thead className="hidden sm:table-header-group">
                    <tr className="bg-[var(--color-surface-1)] border-b border-[var(--color-border-soft)] text-[var(--color-text-dim)] text-[13px] font-bold uppercase tracking-[0.2em]">
                        <th className="px-8 py-3 w-16 text-[13px]"> </th>
                        <th className="px-8 py-3 text-[13px]">Visitor Name</th>
                        <th className="px-8 py-3 text-[13px]">Visit Date</th>
                        <th className="px-8 py-3 text-[13px]">Purpose</th>
                        <th className="px-8 py-3 text-right text-[13px]">Status</th>
                    </tr>
                </thead>
                <tbody className="block sm:table-row-group">
                    {history.map((item) => (
                        <React.Fragment key={item.id}>
                            <tr
                                className={`group transition-all cursor-pointer block sm:table-row bg-[var(--color-bg-paper)] border-b border-[var(--color-border-soft)] sm:border-none p-6 sm:p-0 ${expandedRow === item.id ? 'bg-[var(--color-surface-1)]' : 'hover:bg-[var(--color-surface-1)]/60'}`}
                                onClick={() => setExpandedRow(expandedRow === item.id ? null : item.id)}
                            >
                                <td className="block sm:table-cell px-2 sm:px-8 py-4 sm:py-5 border-b border-[var(--color-border-soft)] sm:border-none last:border-none">
                                    <div className="flex sm:block justify-between items-center sm:justify-start">
                                        <span className="text-[13px] font-bold tracking-[0.2em] text-primary/60 uppercase block sm:hidden">Expansion Hub</span>
                                        <div className={`transition-transform duration-300 ${expandedRow === item.id ? 'rotate-180' : ''}`}>
                                            <ChevronDown size={14} className={expandedRow === item.id ? 'text-primary' : 'text-[var(--color-text-dim)] opacity-80 group-hover:opacity-100'} />
                                        </div>
                                    </div>
                                </td>
                                <td className="block sm:table-cell px-2 sm:px-8 py-4 sm:py-5 border-b border-[var(--color-border-soft)] sm:border-none last:border-none">
                                    <span className="text-[13px] font-bold tracking-[0.2em] text-primary/60 uppercase block sm:hidden mb-3 text-left">Visitor Name</span>
                                    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-4">
                                        <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-[13px] font-bold">
                                            {item.visitor[0]}
                                        </div>
                                        <div>
                                            <p className="text-[var(--color-text-primary)] text-[13px] font-bold uppercase tracking-wide group-hover:text-primary transition-colors">{item.visitor}</p>
                                            <p className="text-[var(--color-text-dim)] text-[11px] font-bold uppercase tracking-widest opacity-80">Authenticated</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="block sm:table-cell px-2 sm:px-8 py-4 sm:py-5 border-b border-[var(--color-border-soft)] sm:border-none last:border-none">
                                    <span className="text-[13px] font-bold tracking-[0.2em] text-primary/60 uppercase block sm:hidden mb-3 text-left">Visit Date</span>
                                    <span className="text-[var(--color-text-secondary)] font-bold tracking-wide uppercase break-words text-[13px]">{item.date}</span>
                                </td>
                                <td className="block sm:table-cell px-2 sm:px-8 py-4 sm:py-5 border-b border-[var(--color-border-soft)] sm:border-none last:border-none">
                                    <span className="text-[13px] font-bold tracking-[0.2em] text-primary/60 uppercase block sm:hidden mb-3 text-left">Purpose</span>
                                    <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--color-text-primary)] break-words flex w-fit">{item.category}</span>
                                </td>
                                <td className="block sm:table-cell px-2 sm:px-8 py-4 sm:py-5 text-left sm:text-right">
                                    <span className="text-[13px] font-bold tracking-[0.2em] text-primary/60 uppercase block sm:hidden mb-3 text-left">Status</span>
                                    <span className={`inline-flex flex-col md:flex-row items-center gap-4 md:gap-2 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border ${item.status === 'Approved' ? 'text-green-500 border-green-500/20 bg-green-500/5' : 'text-primary border-primary/20 bg-primary/5'}`}>
                                        {item.status}
                                    </span>
                                </td>
                            </tr>
                            {expandedRow === item.id && (
                                <tr className="block sm:table-row bg-[var(--color-surface-1)] sm:bg-transparent border border-[var(--color-border-soft)] border-t-0 sm:border-none p-4 sm:p-0 rounded-bl-[24px] rounded-br-[24px] mb-6 sm:mb-0">
                                    <td colSpan="5" className="block sm:table-cell p-4 sm:p-4 md:p-10 sm:px-16 border-y-0 sm:border-y border-[var(--color-border-soft)]">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 animate-fade-in">
                                            <div className="space-y-6">
                                                <div className="flex flex-col md:flex-row items-center gap-4 md:gap-3">
                                                    <div className="w-1 h-4 bg-primary rounded-full"></div>
                                                    <span className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-text-primary)]">Personnel Data</span>
                                                </div>
                                                <div className="space-y-4">
                                                    <div className="p-4 rounded-2xl bg-[var(--color-bg-paper)] border border-[var(--color-border-soft)] space-y-1 group hover:border-primary/20 transition-colors">
                                                        <p className="text-[var(--color-text-dim)] text-[12px] uppercase font-medium tracking-widest opacity-80">NIC Registry</p>
                                                        <p className="text-[var(--color-text-primary)] text-xs font-medium tracking-widest">N-9428103X</p>
                                                    </div>
                                                    <div className="p-4 rounded-2xl bg-[var(--color-bg-paper)] border border-[var(--color-border-soft)] space-y-1 group hover:border-primary/20 transition-colors">
                                                        <p className="text-[var(--color-text-dim)] text-[12px] uppercase font-medium tracking-widest opacity-80">Protocol Sync</p>
                                                        <p className="text-[var(--color-text-primary)] text-xs font-medium tracking-widest">#SYNC-4281-ALPHA</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-6">
                                                <div className="flex flex-col md:flex-row items-center gap-4 md:gap-3">
                                                    <div className="w-1 h-4 bg-primary rounded-full"></div>
                                                    <span className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-text-primary)]">Mission Profile</span>
                                                </div>
                                                <div className="space-y-4">
                                                    <div className="p-4 rounded-2xl bg-[var(--color-bg-paper)] border border-[var(--color-border-soft)] space-y-1 group hover:border-primary/20 transition-colors">
                                                        <p className="text-[var(--color-text-dim)] text-[12px] uppercase font-medium tracking-widest opacity-80">Designated Contact Person</p>
                                                        <p className="text-[var(--color-text-primary)] text-xs font-medium tracking-widest uppercase">Sachi (HR-04)</p>
                                                    </div>
                                                    <div className="p-4 rounded-2xl bg-[var(--color-bg-paper)] border border-[var(--color-border-soft)] space-y-1 group hover:border-primary/20 transition-colors">
                                                        <p className="text-[var(--color-text-dim)] text-[12px] uppercase font-medium tracking-widest opacity-80">Total Session</p>
                                                        <p className="text-[var(--color-text-primary)] text-xs font-medium tracking-widest">02H 15M 42S</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-6">
                                                <div className="flex flex-col md:flex-row items-center gap-4 md:gap-3">
                                                    <div className="w-1 h-4 bg-primary rounded-full"></div>
                                                    <span className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-text-primary)]">Security Protocol</span>
                                                </div>
                                                <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 relative overflow-hidden">
                                                    <div className="absolute top-0 right-0 p-2 opacity-10">
                                                        <FileText size={40} className="text-primary" />
                                                    </div>
                                                    <p className="text-[var(--color-text-secondary)] text-[13px] leading-relaxed font-medium uppercase tracking-wide relative z-10">
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

        </div>
    );
};

export default HistoryTable;
