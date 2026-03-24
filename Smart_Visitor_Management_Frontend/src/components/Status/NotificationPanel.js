import React from 'react';

const NotificationPanel = () => {
    const alerts = [
        { id: 1, type: 'SECURITY', msg: 'Identity verification phase initiated by MAS Security Node 04.', time: '2m ago' },
        { id: 2, type: 'SYSTEM', msg: 'Vehicle WP ABC-0000 registered in temporary clearance list.', time: '14m ago' },
        { id: 3, type: 'ALERT', msg: 'Additional equipment declaration review required.', time: '1h ago' }
    ];

    return (
        <section className="bg-white/[0.02] border border-white/5 p-8 h-full">
            <h3 className="text-[10px] uppercase tracking-[0.4em] font-black text-white mb-10 pb-4 border-b border-white/5 flex justify-between items-center">
                Security Log
                <span className="w-2 h-2 bg-mas-red animate-pulse"></span>
            </h3>
            <div className="space-y-8">
                {alerts.map((alert) => (
                    <div key={alert.id} className="group border-l border-white/10 pl-6 py-2 hover:border-mas-red transition-all cursor-crosshair">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-[8px] font-black uppercase tracking-widest text-mas-red">{alert.type}</span>
                            <span className="text-[8px] text-gray-500 font-mono italic">{alert.time}</span>
                        </div>
                        <p className="text-[10px] text-gray-400 font-light leading-relaxed group-hover:text-gray-200 transition-colors">
                            {alert.msg}
                        </p>
                    </div>
                ))}
            </div>
            
            <div className="mt-20 pt-8 border-t border-white/5">
                <div className="p-4 bg-mas-red/5 border border-mas-red/10">
                    <p className="text-[8px] text-gray-400 uppercase tracking-[0.2em] leading-relaxed">
                        Security Notice: All interactions within this node are logged and encrypted using <span className="text-white font-mono">AES-256</span>.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default NotificationPanel;
