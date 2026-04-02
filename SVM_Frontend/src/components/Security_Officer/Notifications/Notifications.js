import React, { useState } from 'react';
import { Bell, AlertTriangle, ShieldAlert, Info, Trash2, CheckCircle2 } from 'lucide-react';

const NotificationsMain = () => {
    const [notifications, setNotifications] = useState([
        { id: 1, title: 'UNAUTHORIZED ACCESS ATTEMPT', message: 'Node SEC-08 detected invalid QR sequence at Main Gate 02.', time: '1 min ago', type: 'critical', unread: true },
        { id: 2, title: 'EQUIPMENT MISMATCH DETECTED', message: 'Visitor VER-SYNC-4291 exit protocol flagged missing DSLR Camera.', time: '15 mins ago', type: 'warning', unread: true },
        { id: 3, title: 'SYSTEM NODE UPDATE', message: 'Tactical encryption keys rotated successfully for all Guardian nodes.', time: '2 hours ago', type: 'info', unread: false },
        { id: 4, title: 'ADMIN OVERRIDE ACTIVE', message: 'Manual clearance granted for VIP personnel by Admin Hub.', time: '4 hours ago', type: 'info', unread: false },
        { id: 5, title: 'BREACH REPORT LOGGED', message: 'Incident report INC-8821 finalized and transmitted to central registry.', time: '1 day ago', type: 'warning', unread: false },
    ]);

    const markAllRead = () => {
        setNotifications(notifications.map(n => ({ ...n, unread: false })));
    };

    const getIcon = (type) => {
        switch(type) {
            case 'critical': return <ShieldAlert size={18} className="text-primary" />;
            case 'warning': return <AlertTriangle size={18} className="text-yellow-500" />;
            default: return <Info size={18} className="text-gray-300" />;
        }
    };

    return (
        <div className="p-12 space-y-12 animate-fade-in">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-mas-border pb-12">
                <div>
                    <div className="flex items-center gap-4 mb-4">
                        <Bell size={14} className="text-primary" />
                        <span className="text-primary uppercase">Critical Node Feed</span>
                        <div className="h-[1px] w-12 bg-primary"></div>
                    </div>
                    <h1 className="uppercase text-white flex items-center gap-6">
                        Alerts Center
                        <span className="px-4 py-2 mas-glass border-primary/30 text-primary inline-flex">
                            {notifications.filter(n => n.unread).length} New Alerts
                        </span>
                    </h1>
                </div>

                <div className="flex items-center gap-4">
                    <button onClick={markAllRead} className="flex items-center gap-3 px-8 py-3 mas-glass border-white/5 text-gray-300 uppercase hover:text-white hover:border-white/20 transition-all">
                        <CheckCircle2 size={14} />
                        Clear Alert Buffer
                    </button>
                    <button className="p-3 mas-glass border-white/5 text-gray-300 hover:text-primary hover:border-primary transition-all">
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>

            <div className="max-w-4xl space-y-4">
                {notifications.map((notif, i) => (
                    <div 
                        key={notif.id}
                        className={`mas-glass p-8 border-l-4 transition-all hover:bg-white/[0.03] cursor-pointer group flex items-start gap-8 ${notif.unread ? 'border-primary bg-primary/[0.02]' : 'border-white/10 opacity-70'}`}
                    >
                        <div className={`p-4 mas-glass border-white/5 ${notif.unread ? 'bg-primary/10' : 'bg-white/5'}`}>
                            {getIcon(notif.type)}
                        </div>
                        
                        <div className="flex-1 space-y-3">
                            <div className="flex justify-between items-center">
                                <h4 className={`uppercase ${notif.unread ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                                    {notif.title}
                                </h4>
                                <span className="text-gray-300 uppercase">
                                    {notif.time}
                                </span>
                            </div>
                            <p className="text-gray-300 uppercase leading-6 max-w-2xl">
                                {notif.message}
                            </p>
                            <div className="pt-4 flex items-center gap-6">
                                 <div className="flex items-center gap-2">
                                     <div className="w-1 h-1 bg-primary rounded-full"></div>
                                     <span className="text-gray-300 uppercase">Source: FRONT-DOOR-SCANNER-02</span>
                                 </div>
                                 <div className="flex items-center gap-2">
                                     <div className="w-1 h-1 bg-primary rounded-full"></div>
                                     <span className="text-gray-300 uppercase">Verification Logged</span>
                                 </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NotificationsMain;
