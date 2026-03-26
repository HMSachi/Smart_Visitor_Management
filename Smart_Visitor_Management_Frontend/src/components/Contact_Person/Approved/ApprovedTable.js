import React from 'react';
import { Eye, Clock, UserCheck, ArrowRight } from 'lucide-react';

const ApprovedTable = ({ requests, onQuickView }) => {
    return (
        <div className="mas-glass border-mas-border overflow-x-auto overflow-y-hidden custom-scrollbar">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-mas-border bg-white/[0.02]">
                        <th className="px-6 py-6 uppercase text-mas-text-dim whitespace-nowrap">Log ID</th>
                        <th className="px-6 py-6 uppercase text-mas-text-dim whitespace-nowrap">Visitor</th>
                        <th className="px-6 py-6 uppercase text-mas-text-dim whitespace-nowrap">Visit Date</th>
                        <th className="px-6 py-6 uppercase text-mas-text-dim whitespace-nowrap">Admin Status</th>
                        <th className="px-6 py-6 uppercase text-mas-text-dim text-right whitespace-nowrap">Protocol</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.map((req) => (
                        <tr key={req.id} className="border-b border-mas-border group hover:bg-white/[0.03] transition-all">
                            <td className="px-6 py-6 text-mas-text-dim whitespace-nowrap">#{req.id}</td>
                            <td className="px-6 py-6 whitespace-nowrap">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-green-500/10 flex items-center justify-center text-green-500 border border-green-500/20">
                                        {req.name[0]}
                                    </div>
                                    <span className="uppercase text-white">{req.name}</span>
                                </div>
                            </td>
                            <td className="px-6 py-6 whitespace-nowrap">
                                <span className="uppercase text-gray-400">{req.date}</span>
                            </td>
                            <td className="px-6 py-6 whitespace-nowrap">
                                <div className={`inline-flex items-center gap-2 px-4 py-1 border uppercase ${req.adminStatus === 'Pending Dispatch' ? 'text-mas-red border-mas-red/20 bg-mas-red/5' : 'text-green-400 border-green-400/20 bg-green-400/5'}`}>
                                    {req.adminStatus === 'Admin Approved' ? <UserCheck size={10} /> : <Clock size={10} />}
                                    {req.adminStatus}
                                </div>
                            </td>
                            <td className="px-6 py-6 text-right whitespace-nowrap">
                                <button 
                                    onClick={() => onQuickView(req)}
                                    className="px-5 py-2 bg-mas-red/10 border border-mas-red/20 text-mas-red uppercase hover:bg-mas-red hover:text-white transition-all flex items-center gap-2 ml-auto shadow-[0_0_10px_rgba(200,16,46,0.1)]"
                                >
                                    Send to Visitor
                                    <ArrowRight size={12} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ApprovedTable;
