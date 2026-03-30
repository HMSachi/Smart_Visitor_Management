import React from 'react';
import { motion } from 'framer-motion';
import { Bell, ShieldAlert, Terminal, Info, ShieldCheck } from 'lucide-react';

const NotificationPanel = () => {
    const alerts = [
        { id: 1, type: 'SECURITY', msg: 'Identity verification phase initiated by MAS Security Node 04.', time: '2m ago', icon: ShieldAlert },
        { id: 2, type: 'SYSTEM', msg: 'Vehicle registration WP ABC-0000 synchronized with clearance list.', time: '14m ago', icon: Terminal },
        { id: 3, type: 'ALERT', msg: 'Additional equipment declaration review required for Node 01.', time: '1h ago', icon: Bell }
    ];

    return (
        <section className="bg-white/[0.03] border border-white/10 p-8 rounded-[2.5rem] h-full shadow-2xl relative overflow-hidden group">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-mas-red/5 -mr-16 -mt-16 group-hover:bg-mas-red/10 transition-all duration-700" />
            
            <div className="flex items-center justify-between mb-10 pb-6 border-b border-white/[0.05] relative z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-mas-red/10 text-mas-red">
                        <Terminal size={16} />
                    </div>
                    <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] italic">Security Log</h3>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[8px] text-gray-500 font-bold uppercase tracking-widest animate-pulse">Node Sync Live</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-mas-red shadow-[0_0_8px_#C8102E] animate-ping" />
                </div>
            </div>

            <div className="space-y-6 relative z-10">
                {alerts.map((alert, index) => (
                    <motion.div 
                        key={alert.id}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group/item relative pl-8 py-2 border-l border-white/5 hover:border-mas-red transition-all cursor-pointer"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                                <alert.icon size={12} className="text-mas-red/60 group-hover/item:text-mas-red transition-colors" />
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-mas-red italic">{alert.type}</span>
                            </div>
                            <span className="text-[8px] font-bold text-gray-600 uppercase tracking-widest">{alert.time}</span>
                        </div>
                        <p className="text-[10px] text-gray-400 font-bold leading-relaxed uppercase tracking-wider group-hover/item:text-white transition-colors">
                            {alert.msg}
                        </p>
                    </motion.div>
                ))}
            </div>
            
            <div className="mt-16 pt-8 border-t border-white/[0.05] relative z-10">
                <div className="p-6 bg-mas-red/5 border border-mas-red/10 rounded-2xl group/notice hover:bg-mas-red/10 transition-all">
                    <div className="flex items-center gap-3 mb-3">
                        <ShieldCheck size={14} className="text-mas-red" />
                        <span className="text-[9px] font-black text-white uppercase tracking-widest">Notice</span>
                    </div>
                    <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed">
                        Interaction within this node is logged and encrypted via <span className="text-white italic">AES-256-GCM</span> infrastructure.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default NotificationPanel;
