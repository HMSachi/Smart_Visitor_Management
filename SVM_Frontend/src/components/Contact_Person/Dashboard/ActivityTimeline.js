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
        <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-mas-border pb-4">
                <h3 className="uppercase flex items-center gap-3">
                    <Activity size={14} className="text-primary" />
                    Real-Time Node Activity
                </h3>
                <button className="text-gray-300 uppercase hover:text-white transition-colors">View All Streams</button>
            </div>

            <div className="space-y-4">
                {activities.map((act) => (
                    <div key={act.id} className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-primary/20 transition-all group">
                        <div className="flex items-center gap-6">
                            <div className="relative">
                                <div className={`w-3 h-3 rounded-full ${act.status === 'priority' || act.status === 'urgent' ? 'bg-primary shadow-[0_0_8px_var(--color-primary)]' : 'bg-green-500 shadow-[0_0_8px_#22c55e]'}`}></div>
                                <div className={`absolute -inset-1 rounded-full animate-ping opacity-70 ${act.status === 'priority' || act.status === 'urgent' ? 'bg-primary' : 'bg-green-500'}`}></div>
                            </div>
                            <div>
                                <h4 className="text-white uppercase mb-1">{act.visitor}</h4>
                                <p className="text-gray-300 uppercase">{act.action}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-8">
                            <span className="text-gray-300 uppercase">{act.time}</span>
                            <ArrowUpRight size={14} className="text-gray-300 group-hover:text-primary transition-colors cursor-pointer" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ActivityTimeline;
