import React from 'react';
import { Activity, ArrowUpRight } from 'lucide-react';

const ActivityTimeline = () => {
    const activities = [
        { id: 1, type: 'review', visitor: 'John Doe', time: '2 mins ago', action: 'Pending Review', status: 'priority' },
        { id: 2, type: 'approval', visitor: 'Sarah Smith', time: '15 mins ago', action: 'Sent to Admin', status: 'complete' },
        { id: 3, type: 'request', visitor: 'Michael Chen', time: '45 mins ago', action: 'New Request', status: 'new' },
        { id: 4, type: 'review', visitor: 'Emma Wilson', time: '1 hour ago', action: 'Pending Review', status: 'urgent' },
    ];

    return (
        <div className="space-y-4 md:space-y-8">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <h3 className="uppercase flex items-center gap-3 text-[#1A1A1A] text-xs font-bold tracking-widest">
                    <Activity size={14} className="text-primary" />
                    Real-Time Node Activity
                </h3>
                <button className="text-gray-400 text-[10px] font-bold uppercase tracking-widest hover:text-primary transition-colors">View All Streams</button>
            </div>

            <div className="space-y-4">
                {activities.map((act) => (
                    <div key={act.id} className="flex items-center justify-between p-5 bg-white border border-gray-200 rounded-2xl hover:border-primary/20 transition-all group shadow-sm">
                        <div className="flex items-center gap-5">
                            <div className="relative">
                                <div className={`w-2.5 h-2.5 rounded-full ${act.status === 'priority' || act.status === 'urgent' ? 'bg-primary shadow-[0_0_8px_var(--color-primary)]' : 'bg-green-500 shadow-[0_0_8px_#22c55e]'}`}></div>
                                <div className={`absolute -inset-1 rounded-full animate-ping opacity-70 ${act.status === 'priority' || act.status === 'urgent' ? 'bg-primary' : 'bg-green-500'}`}></div>
                            </div>
                            <div>
                                <h4 className="text-[#1A1A1A] text-[11px] font-bold uppercase tracking-wider mb-1">{act.visitor}</h4>
                                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">{act.action}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">{act.time}</span>
                            <ArrowUpRight size={14} className="text-gray-400 group-hover:text-primary transition-colors cursor-pointer" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ActivityTimeline;
