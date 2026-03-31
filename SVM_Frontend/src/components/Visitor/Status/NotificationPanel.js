import React from 'react';
import { motion } from 'framer-motion';
import { Bell, ShieldAlert, Terminal, Info, ShieldCheck, CheckCircle2 } from 'lucide-react';

const NotificationPanel = ({ status }) => {
    // Dynamic alerts based on status
    const getAlerts = () => {
        switch (status) {
            case 'step1_pending':
                return [
                    { id: 1, type: 'SECURITY', msg: 'Identity verification phase initiated by MAS Security.', time: 'Just now', icon: ShieldAlert },
                    { id: 2, type: 'SYSTEM', msg: 'Basic Form 01 details synchronized.', time: '1m ago', icon: Terminal }
                ];
            case 'step1_approved':
                return [
                    { id: 1, type: 'APPROVED', msg: 'Primary Form 01 authorization granted successfully.', time: 'Just now', icon: CheckCircle2 },
                    { id: 2, type: 'ACTION REQUIRED', msg: 'Form 02 submission needed for final clearance.', time: 'Just now', icon: Bell },
                    { id: 3, type: 'SYSTEM', msg: 'Awaiting secondary documentation sync.', time: '1m ago', icon: Terminal }
                ];
            case 'step2_pending':
                return [
                    { id: 1, type: 'SUBMITTED', msg: 'Form 02 (Vehicle & Equipment) data synchronized.', time: 'Just now', icon: CheckCircle2 },
                    { id: 2, type: 'SECURITY', msg: 'Final review requested from Security Officer.', time: '1m ago', icon: ShieldAlert },
                    { id: 3, type: 'ALERT', msg: 'Vehicle details matching with Global Registry.', time: '2m ago', icon: Info }
                ];
            case 'fully_approved':
                return [
                    { id: 1, type: 'CLEARED', msg: 'Full Facility Clearance Granted. Welcome to MAS.', time: 'Just now', icon: ShieldCheck },
                    { id: 2, type: 'SYSTEM', msg: 'Digital QR Pass has been activated.', time: '1m ago', icon: Terminal },
                    { id: 3, type: 'SECURITY', msg: 'Your arrival has been logged with Node 04 Security.', time: '2m ago', icon: Bell }
                ];
            default:
                return [
                    { id: 1, type: 'SYSTEM', msg: 'Connecting to MAS Security Framework...', time: '-', icon: Terminal }
                ];
        }
    };

    const alerts = getAlerts();

    return (
        <section className="bg-white/[0.03] border border-white/10 p-6 rounded-[2.5rem] h-full shadow-2xl relative overflow-hidden group">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-mas-red/5 -mr-16 -mt-16 group-hover:bg-mas-red/10 transition-all duration-700" />
            
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.05] relative z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-mas-red/10 text-mas-red">
                        <Terminal size={16} />
                    </div>
                    <h3 className="text-sm font-medium text-white uppercase tracking-[0.2em]">Security Log</h3>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[7.5px] text-gray-300 font-medium uppercase tracking-widest animate-pulse">Node Sync Live</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-mas-red shadow-[0_0_8px_#C8102E] animate-ping" />
                </div>
            </div>

            <div className="space-y-6 relative z-10">
                {alerts.map((alert, index) => (
                    <motion.div 
                        key={`${status}-${alert.id}`}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group/item relative pl-8 py-2 border-l border-white/5 hover:border-mas-red transition-all cursor-pointer"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                                <alert.icon size={12} className={alert.type === 'APPROVED' || alert.type === 'CLEARED' ? 'text-green-500/60 group-hover/item:text-green-500' : 'text-mas-red/60 group-hover/item:text-mas-red transition-colors'} />
                                <span className={`text-[8.5px] font-normal uppercase tracking-[0.2em] ${alert.type === 'APPROVED' || alert.type === 'CLEARED' ? 'text-green-500' : 'text-mas-red'}`}>{alert.type}</span>
                            </div>
                            <span className="text-[7.5px] font-medium text-gray-400 uppercase tracking-widest">{alert.time}</span>
                        </div>
                        <p className="text-[9px] text-gray-300 font-normal leading-relaxed uppercase tracking-wider group-hover/item:text-white transition-colors">
                            {alert.msg}
                        </p>
                    </motion.div>
                ))}
            </div>
            
            <div className="mt-16 pt-8 border-t border-white/[0.05] relative z-10">
                <div className="p-6 bg-mas-red/5 border border-mas-red/10 rounded-2xl group/notice hover:bg-mas-red/10 transition-all">
                    <div className="flex items-center gap-3 mb-3">
                        <ShieldCheck size={14} className="text-mas-red" />
                        <span className="text-[8px] font-normal text-white uppercase tracking-widest">Notice</span>
                    </div>
                    <p className="text-[8px] text-gray-400 font-normal uppercase tracking-widest leading-relaxed">
                        Interaction within this node is logged and encrypted via <span className="text-white">AES-256-GCM</span> infrastructure.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default NotificationPanel;
