import React from 'react';
import { Layers, Clock, CheckSquare, Send } from 'lucide-react';

const MetricsGrid = () => {
    const stats = [
        { label: 'Total Syncs', value: '1,284', icon: Layers, trend: '+12.5%', color: 'mas-red', subtitle: 'Global Records' },
        { label: 'Awaiting Action', value: '42', icon: Clock, trend: 'Priority', color: 'mas-red', subtitle: 'Urgent Review' },
        { label: 'Authorization Success', value: '892', icon: CheckSquare, trend: '+8.2%', color: 'mas-red', subtitle: 'Completed Cycles' },
        { label: 'Admin Escalations', value: '350', icon: Send, trend: 'Finalized', color: 'mas-red', subtitle: 'HQ Reporting' },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
                <div key={i} className="bg-[#121214] p-5 sm:p-6 rounded-3xl border border-white/5 hover:border-mas-red/30 transition-all duration-500 group relative overflow-hidden shadow-xl">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-mas-red/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                    <div className="flex items-center justify-between mb-6">
                        <div className={`p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 group-hover:bg-mas-red/10 group-hover:border-mas-red/30 text-mas-text-dim group-hover:text-mas-red transition-all duration-500`}>
                            <stat.icon size={20} className="group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <span className={`text-[9px] font-black uppercase tracking-[0.15em] py-1 px-2.5 rounded-lg bg-white/[0.03] border border-white/5 ${stat.trend === 'Priority' ? 'text-mas-red animate-pulse border-mas-red/20 bg-mas-red/5' : 'text-mas-text-dim'}`}>
                            {stat.trend}
                        </span>
                    </div>

                    <div className="relative z-10">
                        <h3 className="text-3xl font-bold text-white mb-0.5 tracking-tight group-hover:translate-x-1 transition-transform duration-500">{stat.value}</h3>
                        <p className="text-mas-text-dim text-[10px] font-bold uppercase tracking-[0.1em] mb-4">{stat.label}</p>
                        <div className="flex items-center gap-3">
                            <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-mas-red shadow-[0_0_8px_#C8102E]"
                                    style={{ width: i === 0 ? '70%' : i === 1 ? '40%' : i === 2 ? '85%' : '60%' }}
                                ></div>
                            </div>
                            <span className="text-[8px] text-mas-text-dim/40 uppercase font-bold whitespace-nowrap">{stat.subtitle}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MetricsGrid;
