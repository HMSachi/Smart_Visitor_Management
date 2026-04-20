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
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xl shadow-gray-200/50 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <div>
                    <h3 className="text-[#1A1A1A] font-bold tracking-tight text-sm">Recent Authorization Requests</h3>
                    <p className="text-gray-400 text-[10px] uppercase tracking-widest mt-1">Latest synchronization with MAS nodes</p>
                </div>
                <button
                    onClick={() => navigate('/contact_person/requests-inbox')}
                    className="flex items-center gap-2 text-[11px] font-bold text-primary hover:text-[#A00D25] uppercase tracking-widest transition-colors group"
                >
                    View All Inbox <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-[#F8F9FA] text-gray-400 text-[13px] uppercase tracking-[0.2em] font-bold border-b border-gray-100">
                            <th className="px-4 md:px-6 py-3">Visitor Identity</th>
                            <th className="px-4 md:px-6 py-3 text-center">Date to Visit</th>
                            <th className="px-4 md:px-6 py-3 text-center">Status</th>
                            <th className="px-4 md:px-6 py-3 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.03]">
                        {recentRequests.map((req) => (
                            <tr key={req.id} className="group hover:bg-white/[0.01] transition-all">
                                <td className="px-4 md:px-6 py-3">
                                    <div>
                                        <p className="text-[#1A1A1A] text-[13px] font-bold uppercase tracking-wider">{req.name}</p>
                                    </div>
                                </td>
                                <td className="px-4 md:px-6 py-3 text-center">
                                    <div className="flex flex-col items-center justify-center">
                                        <span className="text-[#1A1A1A] text-[13px] font-bold">{req.date}</span>
                                        <span className="text-gray-400 text-[12px] uppercase tracking-widest">{req.timeIn}</span>
                                    </div>
                                </td>
                                <td className="px-4 md:px-6 py-3 text-center">
                                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border shadow-sm ${getStatusColor(req.status)}`}>
                                        {req.status}
                                    </span>
                                </td>
                                <td className="px-4 md:px-6 py-3 text-right">
                                    <button
                                        onClick={() => navigate('/contact_person/request-review', { state: { requestId: req.id } })}
                                        className="text-[11px] font-bold text-gray-500 hover:text-primary uppercase tracking-widest transition-all py-1.5 px-3 rounded-lg border border-gray-100 hover:border-primary/20 hover:bg-primary/5"
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
