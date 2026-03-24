import React from 'react';

const StatusCard = ({ status }) => {
    const config = {
        'review': { color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20', label: 'PROCESSING', icon: '⚡' },
        'approved': { color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20', label: 'AUTHORIZED', icon: '✓' },
        'rejected': { color: 'text-mas-red', bg: 'bg-mas-red/10', border: 'border-mas-red/20', label: 'DENIED', icon: '×' }
    };

    const current = config[status] || config.review;

    return (
        <div className={`glass-panel p-12 border-l-4 ${current.border.replace('border-', 'border-l-')} relative overflow-hidden`}>
            <div className="flex flex-col md:flex-row items-center justify-between text-center md:text-left">
                <div className="mb-8 md:mb-0">
                    <span className={`text-[10px] uppercase tracking-[0.5em] font-black ${current.color} mb-4 block`}>Current Protocol State</span>
                    <h2 className="text-4xl font-display font-black text-white uppercase tracking-tighter flex items-center justify-center md:justify-start">
                        <span className="mr-6">{current.icon}</span> {current.label}
                    </h2>
                </div>
                <div className="bg-white/5 border border-white/5 px-10 py-6">
                    <span className="text-[9px] text-gray-400 uppercase tracking-widest block mb-2">Estimated Completion</span>
                    <span className="text-white font-mono font-bold tracking-widest">~ 14 MINUTES</span>
                </div>
            </div>
            
            {/* Status Glow Overlay */}
            <div className={`absolute -right-20 -bottom-20 w-64 h-64 ${current.bg.replace('/10', '/5')} rounded-full blur-[100px]`}></div>
        </div>
    );
};

export default StatusCard;
