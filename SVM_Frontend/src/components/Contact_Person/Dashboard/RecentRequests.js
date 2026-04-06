import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, User, Calendar, Clock as ClockIcon } from 'lucide-react';

const RecentRequests = () => {
    const navigate = useNavigate();
    const { requests } = useSelector(state => state.contactPortal);

    // Get latest 5 requests
    const recentRequests = [...requests].reverse().slice(0, 5);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Approved': return 'text-green-500 bg-green-500/10 border-green-500/20';
            case 'Pending': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
            case 'Rejected': return 'text-primary bg-primary/10 border-primary/20';
            default: return 'text-gray-300 bg-white/5 border-white/10';
        }
    };

    return (
        <div className="bg-[var(--color-bg-paper)] border border-white/5 rounded-2xl overflow-hidden shadow-2xl animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <div>
                    <h3 className="text-white font-bold tracking-tight">Recent Authorization Requests</h3>
                    <p className="text-gray-300 text-xs uppercase tracking-widest mt-1">Latest synchronization with MAS nodes</p>
                </div>
                <button
                    onClick={() => navigate('/contact_person/requests-inbox')}
                    className="flex items-center gap-2 text-xs font-medium text-primary hover:text-white transition-colors group"
                >
                    View All Inbox <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-white/[0.02] text-gray-300 text-[12px] uppercase tracking-[0.2em] font-medium">
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
                                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-transparent border border-primary/20 flex items-center justify-center text-primary text-[13px] font-medium">
                                            {req.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <p className="text-white text-xs font-medium">{req.name}</p>
                                            <p className="text-gray-300 text-[12px] uppercase tracking-wider opacity-90">Lead Personnel</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 md:px-6 py-3">
                                    <span className="text-white/90 text-[13px] font-mono tracking-tighter uppercase">{req.batchId}</span>
                                </td>
                                <td className="px-4 md:px-6 py-3">
                                    <div className="flex flex-col">
                                        <span className="text-white/80 text-[13px] font-medium">{req.date}</span>
                                        <span className="text-gray-300 text-[12px] uppercase opacity-50">{req.timeIn}</span>
                                    </div>
                                </td>
                                <td className="px-4 md:px-6 py-3">
                                    <span className={`px-2 py-0.5 rounded-md text-[12px] font-medium uppercase tracking-wider border ${getStatusColor(req.status)}`}>
                                        {req.status}
                                    </span>
                                </td>
                                <td className="px-4 md:px-6 py-3 text-right">
                                    <button
                                        onClick={() => navigate('/contact_person/request-review', { state: { requestId: req.id } })}
                                        className="text-[12px] font-medium text-gray-300 hover:text-primary uppercase tracking-[0.1em] transition-all py-1.5 px-3 rounded-lg border border-white/5 hover:border-primary/20 hover:bg-primary/5"
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
