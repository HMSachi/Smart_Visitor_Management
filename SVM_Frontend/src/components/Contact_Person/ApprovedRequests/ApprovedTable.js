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
        <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-xl shadow-gray-200/50 animate-fade-in sm:overflow-visible p-4 sm:p-0">
            <table className="w-full text-left border-separate border-spacing-y-4 sm:border-spacing-y-0 sm:border-collapse min-w-0 sm:min-w-[700px] block sm:table">
                <thead className="hidden sm:table-header-group">
                    <tr className="bg-[#F8F9FA] border-b border-gray-100 text-gray-400 text-[13px] font-bold uppercase tracking-[0.2em]">
                        <th className="px-8 py-3 w-24">Request ID</th>
                        <th className="px-8 py-3">Visitor Name</th>
                        <th className="px-8 py-3 text-center">Visit Date</th>
                        <th className="px-8 py-3 text-center">Status</th>
                        <th className="px-8 py-3 text-right">Details</th>
                    </tr>
                </thead>
                <tbody className="block sm:table-row-group">
                    {requests.map((req) => (
                        <tr key={req.id} className="group transition-all hover:bg-[#F8F9FA]/50 block sm:table-row bg-white border-b border-gray-50 sm:border-none p-6 sm:p-0">
                            <td className="block sm:table-cell px-2 sm:px-8 py-4 sm:py-5 border-b border-gray-50 sm:border-none last:border-none">
                                <span className="text-[13px] font-bold tracking-[0.2em] text-primary/60 uppercase block sm:hidden mb-3 text-left">Request ID</span>
                                <span className="text-[#1A1A1A] font-medium text-[13px] tracking-widest font-bold">#{req.id}</span>
                            </td>
                             <td className="block sm:table-cell px-2 sm:px-8 py-4 sm:py-5 border-b border-gray-50 sm:border-none last:border-none uppercase tracking-wide">
                                <span className="text-[13px] font-bold tracking-[0.2em] text-primary/60 uppercase block sm:hidden mb-3 text-left">Visitor Name</span>
                                <p className="text-[#1A1A1A] text-[13px] font-bold">{req.name}</p>
                            </td>
                            <td className="block sm:table-cell px-2 sm:px-8 py-4 sm:py-5 border-b border-gray-50 sm:border-none last:border-none text-center">
                                <span className="text-[13px] font-bold tracking-[0.2em] text-primary/60 uppercase block sm:hidden mb-3 text-left">Visit Date</span>
                                <div className="flex flex-col items-center justify-center gap-1">
                                    <div className="text-[#1A1A1A] text-[13px] font-bold">
                                        {req.date}
                                    </div>
                                </div>
                            </td>
                            <td className="block sm:table-cell px-2 sm:px-8 py-4 sm:py-5 text-left sm:text-center border-b border-gray-50 sm:border-none last:border-none">
                                <span className="text-[13px] font-bold tracking-[0.2em] text-primary/60 uppercase block sm:hidden mb-3 text-left">Status</span>
                                <div className={`inline-flex items-center gap-2 px-2 py-0.5 rounded-md border text-[10px] font-bold uppercase tracking-widest ${getAdminStatusStyle(req.adminStatus)}`}>
                                    {req.adminStatus}
                                </div>
                            </td>
                            <td className="block sm:table-cell px-2 sm:px-8 py-4 sm:py-5 text-left sm:text-right">
                                <span className="text-[13px] font-bold tracking-[0.2em] text-primary/60 uppercase block sm:hidden mb-3 text-left">Details</span>
                                <button
                                    onClick={() => onQuickView(req)}
                                    className="inline-flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest hover:text-primary transition-colors group"
                                >
                                    View
                                    <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
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
