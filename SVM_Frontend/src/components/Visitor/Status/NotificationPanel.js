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
        <section className="bg-white/[0.01] border border-white/5 p-6 rounded-xl">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-white/5">
                <div className="flex items-center gap-2">
                    <div className="text-mas-red">
                        <Terminal size={14} />
                    </div>
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-0 !mb-0">Security Log</h3>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-mas-red/40" />
                    <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Protocol Sync</span>
                </div>
            </div>

            <div className="space-y-4">
                {alerts.map((alert, index) => (
                    <div 
                        key={`${status}-${alert.id}`}
                        className="pl-4 py-1.5 border-l border-white/5 hover:border-mas-red transition-all cursor-pointer group/item"
                    >
                        <div className="flex justify-between items-center mb-1">
                            <div className="flex items-center gap-2">
                                <alert.icon size={12} className={alert.type === 'APPROVED' || alert.type === 'CLEARED' ? 'text-green-500/60 group-hover/item:text-green-500' : 'text-mas-red/60 group-hover/item:text-mas-red transition-colors'} />
                                <span className={`text-[9px] font-bold uppercase tracking-widest ${alert.type === 'APPROVED' || alert.type === 'CLEARED' ? 'text-green-500' : 'text-mas-red'}`}>{alert.type}</span>
                            </div>
                            <span className="text-[8px] font-bold text-gray-600 uppercase tracking-widest">{alert.time}</span>
                        </div>
                        <p className="text-[10px] text-gray-500 font-semibold leading-relaxed uppercase tracking-wider group-hover/item:text-gray-300 transition-colors">
                            {alert.msg}
                        </p>
                    </div>
                ))}
            </div>
            
            <div className="mt-8 pt-6 border-t border-white/5">
                <p className="text-[8px] text-gray-700 font-bold uppercase tracking-widest leading-relaxed">
                    Interaction Log: <span className="text-gray-600">AES-256-GCM Active</span>
                </p>
            </div>
        </section>
    );
};

export default NotificationPanel;
