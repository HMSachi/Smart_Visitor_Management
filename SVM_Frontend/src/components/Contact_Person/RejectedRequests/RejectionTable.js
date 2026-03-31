import React from 'react';
import { Octagon,  ArrowRight } from 'lucide-react';

const RejectionTable = ({ requests, onSelect }) => {
    return (
        <div className="mas-glass border-mas-border overflow-hidden">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-mas-border bg-white/[0.02]">
                        <th className="px-8 py-6 uppercase text-gray-300">Batch ID</th>
                        <th className="px-8 py-6 uppercase text-gray-300">Visitor</th>
                        <th className="px-8 py-6 uppercase text-gray-300">Rejection Date</th>
                        <th className="px-8 py-6 uppercase text-gray-300">Root Cause</th>
                        <th className="px-8 py-6 uppercase text-gray-300 text-right">Details</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.map((req) => (
                        <tr key={req.id} className="border-b border-mas-border group hover:bg-white/[0.03] transition-all cursor-pointer" onClick={() => onSelect(req)}>
                            <td className="px-8 py-6 text-gray-300">#{req.id}</td>
                            <td className="px-8 py-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-mas-red/10 flex items-center justify-center text-mas-red border border-mas-red/20 group-hover:bg-mas-red group-hover:text-white transition-all">
                                        {req.name[0]}
                                    </div>
                                    <span className="uppercase text-white group-hover:translate-x-1 transition-transform inline-block">{req.name}</span>
                                </div>
                            </td>
                            <td className="px-8 py-6">
                                <span className="uppercase text-gray-500">{req.date}</span>
                            </td>
                            <td className="px-8 py-6">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-mas-red/5 border border-mas-red/20 text-mas-red uppercase">
                                    <Octagon size={10} />
                                    {req.reason}
                                </div>
                            </td>
                            <td className="px-8 py-6 text-right">
                                <div className="text-gray-300 group-hover:text-mas-red transition-all inline-block">
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
