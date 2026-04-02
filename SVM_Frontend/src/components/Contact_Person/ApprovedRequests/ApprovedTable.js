import React from 'react';
import { Clock, UserCheck, ArrowRight } from 'lucide-react';

const ApprovedTable = ({ requests, onQuickView }) => {
    const getAdminStatusStyle = (status) => {
        if (status === 'Pending Dispatch') {
            return 'text-primary bg-primary/10 border-primary/20';
        }
        return 'text-green-500 bg-green-500/10 border-green-500/20';
    };

    return (
        <div className="bg-[var(--color-bg-paper)] border border-white/5 rounded-3xl overflow-hidden shadow-2xl animate-fade-in sm:overflow-visible p-4 sm:p-0">
            <table className="w-full text-left border-separate border-spacing-y-4 sm:border-spacing-y-0 sm:border-collapse min-w-0 sm:min-w-[700px] block sm:table">
                <thead className="hidden sm:table-header-group">
                    <tr className="bg-white/[0.02] border-b border-white/5 text-gray-300 text-[13px] font-medium uppercase tracking-[0.2em]">
                        <th className="px-8 py-5 w-24">Log ID</th>
                        <th className="px-8 py-5">Visitor Identity</th>
                        <th className="px-8 py-5">Schedule Protocol</th>
                        <th className="px-8 py-5 text-center">Dispatch Status</th>
                        <th className="px-8 py-5 text-right">Control Matrix</th>
                    </tr>
                </thead>
                <tbody className="block sm:table-row-group">
                    {requests.map((req) => (
                        <tr key={req.id} className="group transition-all hover:bg-white/[0.01] block sm:table-row bg-[#161618] sm:bg-transparent border border-white/5 sm:border-none rounded-3xl sm:rounded-none mb-6 sm:mb-0 p-6 sm:p-0 shadow-2xl sm:shadow-none">
                            <td className="block sm:table-cell px-2 sm:px-8 py-4 sm:py-6 border-b border-white/5 sm:border-none last:border-none">
                                <span className="text-[14px] font-bold tracking-[0.2em] text-primary/60 uppercase block sm:hidden mb-3 text-left">Log ID</span>
                                <span className="text-white/80 font-mono text-[14px] tracking-widest">#{req.id}</span>
                            </td>
                            <td className="block sm:table-cell px-2 sm:px-8 py-4 sm:py-6 border-b border-white/5 sm:border-none last:border-none">
                                <span className="text-[14px] font-bold tracking-[0.2em] text-primary/60 uppercase block sm:hidden mb-3 text-left">Visitor Identity</span>
                                <div className="flex items-center gap-4">
                                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 flex items-center justify-center text-white text-[14px] font-medium group-hover:border-primary/40 group-hover:text-primary transition-all duration-500">
                                        {req.name[0]}
                                    </div>
                                    <div>
                                        <p className="text-white text-sm font-medium uppercase tracking-wide group-hover:text-primary transition-colors">{req.name}</p>
                                        <p className="text-gray-300 text-[12px] uppercase tracking-widest font-medium opacity-80">Verified Identity</p>
                                    </div>
                                </div>
                            </td>
                            <td className="block sm:table-cell px-2 sm:px-8 py-4 sm:py-6 border-b border-white/5 sm:border-none last:border-none">
                                <span className="text-[14px] font-bold tracking-[0.2em] text-primary/60 uppercase block sm:hidden mb-3 text-left">Schedule Protocol</span>
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-2 text-white/80 text-[14px] font-medium">
                                        <Clock size={12} className="text-primary/60" />
                                        {req.date}
                                    </div>
                                    <p className="text-gray-300 text-[12px] uppercase tracking-[0.1em] pl-5 opacity-90">Synchronized Protocol</p>
                                </div>
                            </td>
                            <td className="block sm:table-cell px-2 sm:px-8 py-4 sm:py-6 text-left sm:text-center border-b border-white/5 sm:border-none last:border-none">
                                <span className="text-[14px] font-bold tracking-[0.2em] text-primary/60 uppercase block sm:hidden mb-3 text-left">Dispatch Status</span>
                                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg border text-[12px] font-medium uppercase tracking-widest ${getAdminStatusStyle(req.adminStatus)}`}>
                                    {req.adminStatus === 'Dispatched to Visitor' ? <UserCheck size={10} /> : <Clock size={10} className="animate-pulse" />}
                                    {req.adminStatus}
                                </div>
                            </td>
                            <td className="block sm:table-cell px-2 sm:px-8 py-4 sm:py-6 text-left sm:text-right">
                                <span className="text-[14px] font-bold tracking-[0.2em] text-primary/60 uppercase block sm:hidden mb-3 text-left">Control Matrix</span>
                                <button
                                    onClick={() => onQuickView(req)}
                                    className="inline-flex items-center gap-3 px-5 py-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-[13px] font-medium text-gray-300 uppercase tracking-widest hover:bg-primary hover:text-white hover:border-primary transition-all group shadow-lg"
                                >
                                    Transmit
                                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </td>
                        </tr>
                    ))}
                    {requests.length === 0 && (
                        <tr>
                            <td colSpan="5" className="px-8 py-20 text-center text-gray-300 uppercase text-xs tracking-[0.3em] font-medium opacity-30">
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
