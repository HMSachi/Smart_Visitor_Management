import React from 'react';
import { Eye, ArrowRight } from 'lucide-react';

const RequestsTable = ({ requests, onReview }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'text-mas-red border-mas-red/20 bg-mas-red/5 animate-pulse';
            case 'Approved': return 'text-green-500 border-green-500/20 bg-green-500/5';
            case 'Rejected': return 'text-gray-500 border-gray-500/20 bg-gray-500/5';
            case 'In Review': return 'text-blue-400 border-blue-400/20 bg-blue-400/5';
            default: return 'text-white border-white/10 bg-white/5';
        }
    };

    return (
        <div className="mas-glass border-mas-border overflow-x-auto overflow-y-hidden custom-scrollbar">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-mas-border bg-white/[0.02]">
                        <th className="px-6 py-6 uppercase text-mas-text-dim whitespace-nowrap">Tracking ID</th>
                        <th className="px-6 py-6 uppercase text-mas-text-dim whitespace-nowrap">Visitor Name</th>
                        <th className="px-6 py-6 uppercase text-mas-text-dim whitespace-nowrap">Visit Type</th>
                        <th className="px-6 py-6 uppercase text-mas-text-dim whitespace-nowrap">Phase</th>
                        <th className="px-6 py-6 uppercase text-mas-text-dim whitespace-nowrap">Status</th>
                        <th className="px-6 py-6 uppercase text-mas-text-dim whitespace-nowrap">Last Sync</th>
                        <th className="px-6 py-6 uppercase text-mas-text-dim text-right whitespace-nowrap">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.map((req) => (
                        <tr 
                            key={req.id} 
                            className="border-b border-mas-border group hover:bg-white/[0.03] transition-all cursor-pointer"
                            onClick={onReview}
                        >
                            <td className="px-6 py-6 whitespace-nowrap">
                                <span className="text-mas-text-dim group-hover:text-mas-red transition-colors">#{req.id}</span>
                            </td>
                            <td className="px-6 py-6 whitespace-nowrap">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-mas-red/10 flex items-center justify-center text-mas-red border border-mas-red/20 group-hover:bg-mas-red group-hover:text-white transition-all">
                                        {req.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <span className="uppercase text-white group-hover:translate-x-1 transition-transform inline-block">{req.name}</span>
                                </div>
                            </td>
                            <td className="px-6 py-6 whitespace-nowrap">
                                <span className="uppercase text-gray-400">{req.type}</span>
                            </td>
                            <td className="px-6 py-6 whitespace-nowrap">
                                <span className="px-3 py-1 bg-white/5 border border-white/5 uppercase text-mas-text-dim group-hover:border-mas-red/20 group-hover:text-white transition-all">{req.step}</span>
                            </td>
                            <td className="px-6 py-6 whitespace-nowrap">
                                <div className={`inline-flex items-center gap-2 px-4 py-1 border uppercase ${getStatusColor(req.status)}`}>
                                    <div className="w-1.5 h-1.5 rounded-full bg-current shadow-[0_0_5px_currentColor]"></div>
                                    {req.status}
                                </div>
                            </td>
                            <td className="px-6 py-6 whitespace-nowrap">
                                <div className="flex flex-col gap-1">
                                    <span className="text-white text-xs bg-white/5 px-2 py-0.5 border border-white/10 w-max">{req.time}</span>
                                    <span className="text-mas-text-dim uppercase text-xs tracking-wider">{req.date}</span>
                                </div>
                            </td>
                            <td className="px-6 py-6 whitespace-nowrap">
                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-2 border border-white/10 text-mas-text-dim hover:text-white hover:bg-white/5 transition-all">
                                        <Eye size={14} />
                                    </button>
                                    <button className="px-5 py-2 bg-mas-red text-white uppercase flex items-center gap-2 shadow-[0_0_15px_rgba(200,16,46,0.3)]">
                                        Review
                                        <ArrowRight size={12} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default RequestsTable;
