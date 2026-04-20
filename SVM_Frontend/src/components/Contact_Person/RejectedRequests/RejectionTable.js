import React from 'react';
import { Octagon,  ArrowRight } from 'lucide-react';

const RejectionTable = ({ requests, onSelect }) => {
    return (
        <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-xl shadow-gray-200/50 animate-fade-in sm:overflow-visible p-4 sm:p-0">
            <table className="w-full text-left border-separate border-spacing-y-4 sm:border-spacing-y-0 sm:border-collapse min-w-0 sm:min-w-[700px] block sm:table">
                <thead className="hidden sm:table-header-group">
                    <tr className="bg-[#F8F9FA] border-b border-gray-100 text-gray-400 text-[13px] font-bold uppercase tracking-[0.2em]">
                        <th className="px-8 py-3">Batch ID</th>
                        <th className="px-8 py-3">Visitor Identity</th>
                        <th className="px-8 py-3">Rejection Date</th>
                        <th className="px-8 py-3">Root Cause</th>
                        <th className="px-8 py-3 text-right">Details</th>
                    </tr>
                </thead>
                <tbody className="block sm:table-row-group">
                    {requests.map((req) => (
                        <tr key={req.id} className="group transition-all hover:bg-[#F8F9FA]/50 block sm:table-row bg-white border-b border-gray-50 sm:border-none p-6 sm:p-0 cursor-pointer" onClick={() => onSelect(req)}>
                            <td className="block sm:table-cell px-2 sm:px-8 py-4 sm:py-5 border-b border-gray-50 sm:border-none last:border-none">
                                <span className="text-[13px] font-bold tracking-[0.2em] text-primary/60 uppercase block sm:hidden mb-3 text-left">Batch ID</span>
                                <span className="text-[#1A1A1A] font-bold text-[13px]">#{req.id}</span>
                            </td>
                            <td className="block sm:table-cell px-2 sm:px-8 py-4 sm:py-5 border-b border-gray-50 sm:border-none last:border-none">
                                <span className="text-[13px] font-bold tracking-[0.2em] text-primary/60 uppercase block sm:hidden mb-3 text-left">Visitor Identity</span>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary border border-primary/20 text-[13px] font-bold">
                                        {req.name[0]}
                                    </div>
                                    <span className="uppercase text-[#1A1A1A] font-bold text-[13px]">{req.name}</span>
                                </div>
                            </td>
                            <td className="block sm:table-cell px-2 sm:px-8 py-4 sm:py-5 border-b border-gray-50 sm:border-none last:border-none">
                                <span className="text-[13px] font-bold tracking-[0.2em] text-primary/60 uppercase block sm:hidden mb-3 text-left">Rejection Date</span>
                                <span className="uppercase text-gray-600 text-[13px] font-bold">{req.date}</span>
                            </td>
                            <td className="block sm:table-cell px-2 sm:px-8 py-4 sm:py-5 border-b border-gray-50 sm:border-none last:border-none">
                                <span className="text-[13px] font-bold tracking-[0.2em] text-primary/60 uppercase block sm:hidden mb-3 text-left">Root Cause</span>
                                <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-md border border-primary/20 bg-primary/10 text-primary uppercase text-[10px] font-bold tracking-widest break-words">
                                    <Octagon size={10} />
                                    {req.reason}
                                </div>
                            </td>
                            <td className="block sm:table-cell px-2 sm:px-8 py-4 sm:py-5 text-left sm:text-right">
                                <span className="text-[14px] font-bold tracking-[0.2em] text-primary/60 uppercase block sm:hidden mb-3 text-left">Details</span>
                                <button className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500 hover:text-primary transition-colors group/btn">
                                    VIEW
                                    <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default RejectionTable;
