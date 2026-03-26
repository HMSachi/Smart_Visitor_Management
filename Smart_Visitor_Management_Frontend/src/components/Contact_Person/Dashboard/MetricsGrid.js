import React from 'react';
import { Layers, Clock, CheckSquare, Send } from 'lucide-react';

const MetricsGrid = () => {
    const stats = [
        { label: 'Total Requests', value: '1,284', icon: Layers, trend: '+12.5%', color: 'white' },
        { label: 'Pending Reviews', value: '42', icon: Clock, trend: 'Priority', color: 'mas-red' },
        { label: 'Approved Requests', value: '892', icon: CheckSquare, trend: '+8.2%', color: 'white' },
        { label: 'Sent to Admin', value: '350', icon: Send, trend: 'Finalized', color: 'white' },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
                <div key={i} className="mas-glass p-8 border-mas-border group hover:border-mas-red/40 transition-all duration-500 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-0 group-hover:h-full bg-mas-red transition-all duration-500"></div>
                    <div className="flex items-start justify-between mb-8">
                        <div className={`p-4 bg-white/5 border border-white/5 group-hover:border-mas-red/20 group-hover:text-mas-red transition-all ${stat.color === 'mas-red' ? 'text-mas-red' : 'text-mas-text-dim'}`}>
                            <stat.icon size={20} />
                        </div>
                        <span className={`uppercase ${stat.color === 'mas-red' ? 'text-mas-red animate-pulse' : 'text-mas-text-dim'}`}>
                            {stat.trend}
                        </span>
                    </div>
                    <h3 className="mb-2 group-hover:translate-x-1 transition-transform">{stat.value}</h3>
                    <p className="text-mas-text-dim uppercase">{stat.label}</p>
                </div>
            ))}
        </div>
    );
};

export default MetricsGrid;
