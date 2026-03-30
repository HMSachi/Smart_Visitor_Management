import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, User, Calendar, Clock as ClockIcon } from 'lucide-react';

const RecentRequests = () => {
    const navigate = useNavigate();
    const { requests } = useSelector(state => state.contactPerson);

    // Get latest 5 requests
    const recentRequests = [...requests].reverse().slice(0, 5);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Approved': return 'text-green-500 bg-green-500/10 border-green-500/20';
            case 'Pending': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
            case 'Rejected': return 'text-mas-red bg-mas-red/10 border-mas-red/20';
            default: return 'text-mas-text-dim bg-white/5 border-white/10';
        }
    };

    return (
        <div className="bg-[#121214] border border-white/5 rounded-2xl overflow-hidden shadow-2xl animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <div>
                    <h3 className="text-white font-bold tracking-tight">Recent Authorization Requests</h3>
                    <p className="text-mas-text-dim text-xs uppercase tracking-widest mt-1">Latest synchronization with MAS nodes</p>
                </div>
                <button
                    onClick={() => navigate('/contact_person/requests-inbox')}
                    className="flex items-center gap-2 text-xs font-bold text-mas-red hover:text-white transition-colors group"
                >
                    View All Inbox <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-white/[0.02] text-mas-text-dim text-[9px] uppercase tracking-[0.2em] font-black">
                            <th className="px-4 md:px-6 py-3">Visitor Identity</th>
                            <th className="px-4 md:px-6 py-3">Reference ID</th>
                            <th className="px-4 md:px-6 py-3">Protocol Schedule</th>
                            <th className="px-4 md:px-6 py-3">Status</th>
                            <th className="px-4 md:px-6 py-3 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.03]">
                        {recentRequests.map((req) => (
                            <tr key={req.id} className="group hover:bg-white/[0.01] transition-all">
                                <td className="px-4 md:px-6 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-mas-red/20 to-transparent border border-mas-red/20 flex items-center justify-center text-mas-red text-[10px] font-black">
                                            {req.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <p className="text-white text-xs font-bold">{req.name}</p>
                                            <p className="text-mas-text-dim text-[9px] uppercase tracking-wider opacity-60">Lead Personnel</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 md:px-6 py-3">
                                    <span className="text-white/60 text-[10px] font-mono tracking-tighter uppercase">{req.batchId}</span>
                                </td>
                                <td className="px-4 md:px-6 py-3">
                                    <div className="flex flex-col">
                                        <span className="text-white/80 text-[10px] font-medium">{req.date}</span>
                                        <span className="text-mas-text-dim text-[9px] uppercase opacity-50">{req.timeIn}</span>
                                    </div>
                                </td>
                                <td className="px-4 md:px-6 py-3">
                                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider border ${getStatusColor(req.status)}`}>
                                        {req.status}
                                    </span>
                                </td>
                                <td className="px-4 md:px-6 py-3 text-right">
                                    <button
                                        onClick={() => navigate('/contact_person/request-review', { state: { requestId: req.id } })}
                                        className="text-[9px] font-black text-mas-text-dim hover:text-mas-red uppercase tracking-[0.1em] transition-all py-1.5 px-3 rounded-lg border border-white/5 hover:border-mas-red/20 hover:bg-mas-red/5"
                                    >
                                        Review
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecentRequests;
