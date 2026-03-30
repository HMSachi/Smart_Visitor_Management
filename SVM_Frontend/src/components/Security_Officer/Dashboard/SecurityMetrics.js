import React from 'react';
import { useSelector } from 'react-redux';
import { QrCode, ShieldCheck, Users, AlertTriangle } from 'lucide-react';

const iconMap = {
    QrCode,
    ShieldCheck,
    Users,
    AlertTriangle
};

const SecurityMetrics = () => {
    const { metrics } = useSelector(state => state.security);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {metrics.map((stat, i) => {
                const Icon = iconMap[stat.iconName] || ShieldCheck;
                return (
                    <div key={i} className="mas-glass p-8 border-white/5 bg-white/[0.01] hover:bg-white/[0.02] transition-all group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Icon size={64} />
                        </div>
                        
                        <div className="space-y-4 relative z-10">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 mas-glass border-white/5 ${stat.color === 'text-mas-red' ? 'bg-mas-red/10' : 'bg-white/5'}`}>
                                    <Icon size={14} className={stat.color} />
                                </div>
                                <span className="text-mas-text-dim uppercase">{stat.label}</span>
                            </div>
                            
                            <div className="flex items-end justify-between">
                                <p className={`${stat.color}`}>{stat.value}</p>
                                <span className={`uppercase ${stat.color === 'text-mas-red' ? 'text-mas-red' : 'text-mas-text-dim'}`}>
                                    {stat.trend}
                                </span>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default SecurityMetrics;
