import React from 'react';
import { Octagon,  ArrowRight } from 'lucide-react';

const RejectionTable = ({ requests, onSelect }) => {
    return (
        <div className="mas-glass border-mas-border overflow-hidden sm:overflow-visible p-4 sm:p-0">
            <table className="w-full text-left border-separate border-spacing-y-4 sm:border-spacing-y-0 sm:border-collapse min-w-0 sm:min-w-[700px] block sm:table">
                <thead className="hidden sm:table-header-group">
                    <tr className="border-b border-mas-border bg-white/[0.02]">
                        <th className="px-8 py-6 uppercase text-gray-300">Batch ID</th>
                        <th className="px-8 py-6 uppercase text-gray-300">Visitor identity</th>
                        <th className="px-8 py-6 uppercase text-gray-300">Rejection Date</th>
                        <th className="px-8 py-6 uppercase text-gray-300">Root Cause</th>
                        <th className="px-8 py-6 uppercase text-gray-300 text-right">Details</th>
                    </tr>
                </thead>
                <tbody className="block sm:table-row-group">
                    {requests.map((req) => (
                        <tr key={req.id} className="group transition-all hover:bg-white/[0.01] block sm:table-row bg-[#161618] sm:bg-transparent border border-white/5 sm:border-none rounded-3xl sm:rounded-none mb-6 sm:mb-0 p-6 sm:p-0 shadow-2xl sm:shadow-none cursor-pointer" onClick={() => onSelect(req)}>
                            <td className="block sm:table-cell px-2 sm:px-8 py-4 sm:py-6 border-b border-white/5 sm:border-none last:border-none">
                                <span className="text-[14px] font-bold tracking-[0.2em] text-primary/60 uppercase block sm:hidden mb-3 text-left">Batch ID</span>
                                <span className="text-gray-300">#{req.id}</span>
                            </td>
                            <td className="block sm:table-cell px-2 sm:px-8 py-4 sm:py-6 border-b border-white/5 sm:border-none last:border-none">
                                <span className="text-[14px] font-bold tracking-[0.2em] text-primary/60 uppercase block sm:hidden mb-3 text-left">Visitor Identity</span>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary border border-primary/20 group-hover:bg-primary group-hover:text-white transition-all">
                                        {req.name[0]}
                                    </div>
                                    <span className="uppercase text-white group-hover:translate-x-1 transition-transform inline-block break-words">{req.name}</span>
                                </div>
                            </td>
                            <td className="block sm:table-cell px-2 sm:px-8 py-4 sm:py-6 border-b border-white/5 sm:border-none last:border-none">
                                <span className="text-[14px] font-bold tracking-[0.2em] text-primary/60 uppercase block sm:hidden mb-3 text-left">Rejection Date</span>
                                <span className="uppercase text-gray-500">{req.date}</span>
                            </td>
                            <td className="block sm:table-cell px-2 sm:px-8 py-4 sm:py-6 border-b border-white/5 sm:border-none last:border-none">
                                <span className="text-[14px] font-bold tracking-[0.2em] text-primary/60 uppercase block sm:hidden mb-3 text-left">Root Cause</span>
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 border border-primary/20 text-primary uppercase break-words">
                                    <Octagon size={10} />
                                    {req.reason}
                                </div>
                            </td>
                            <td className="block sm:table-cell px-2 sm:px-8 py-4 sm:py-6 text-left sm:text-right">
                                <span className="text-[14px] font-bold tracking-[0.2em] text-primary/60 uppercase block sm:hidden mb-3 text-left">Protocol Details</span>
                                <div className="text-gray-300 group-hover:text-primary transition-all inline-block">
                                    <ArrowRight size={14} />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default RejectionTable;
