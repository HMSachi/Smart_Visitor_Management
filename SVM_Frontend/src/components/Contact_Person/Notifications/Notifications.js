import React, { useState } from 'react';
import NotificationList from './NotificationList';
import { Bell, Trash2, CheckSquare } from 'lucide-react';

const NotificationsMain = () => {
    const [notifications, setNotifications] = useState([
        { id: 1, title: 'NEW AUTHORIZATION REQUEST', message: 'John Doe has submitted a Step 2 request for MAS Fabric Park Hub.', time: '2 MINS AGO', type: 'pending', unread: true },
        { id: 2, title: 'ADMIN FINALIZATION SUCCESS', message: 'Request VR-2024-001 for Michael Chen has been finalized by Admin.', time: '1 HOUR AGO', type: 'approval', unread: true },
        { id: 3, title: 'SECURITY HUB REJECTION', message: 'Visitor Emma Wilson rejection protocol confirmed by Security Hub.', time: '5 HOURS AGO', type: 'rejection', unread: false },
        { id: 4, title: 'NODE SYNCHRONIZATION ALERT', message: 'The Visitor Management Portal will undergo node synchronization at 22:00.', time: '1 DAY AGO', type: 'info', unread: false },
        { id: 5, title: 'CREDENTIAL SYNC SUCCESS', message: 'Your security clearance credentials have been successfully synced.', time: '2 DAYS AGO', type: 'approval', unread: false },
    ]);

    const markAllRead = () => {
        setNotifications(notifications.map(n => ({ ...n, unread: false })));
    };

    return (
        <div className="px-4 sm:px-8 py-2 sm:py-4 animate-fade-in-slow">
            <div className="bg-[var(--color-bg-paper)] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
                {/* Compact Action Bar - No Redundant Title */}
                <div className="px-6 py-5 sm:px-8 sm:py-6 border-b border-white/5 bg-gradient-to-r from-white/[0.02] to-transparent flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_8px_var(--color-primary)] animate-pulse"></div>
                            <span className="text-gray-300 text-[12px] font-medium uppercase tracking-[0.3em] opacity-90">Operational Alerts</span>
                        </div>
                        <span className="px-2.5 py-0.5 bg-primary/10 border border-primary/20 text-primary text-[14px] font-medium uppercase tracking-widest rounded-lg">
                            {notifications.filter(n => n.unread).length} New
                        </span>
                    </div>

                    <div className="flex items-center gap-4 w-full sm:w-auto">
                        <button onClick={markAllRead} className="flex-1 sm:flex-none flex items-center justify-center gap-3 px-6 py-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-[13px] font-medium uppercase tracking-widest text-gray-300 hover:text-white hover:border-primary/30 hover:bg-primary/5 transition-all group">
                            <CheckSquare size={14} className="group-hover:text-primary transition-colors" /> Acknowledge All
                        </button>
                        <button className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-gray-300 hover:text-primary hover:border-primary transition-all shadow-lg shrink-0">
                            <Trash2 size={18} />
                        </button>
                    </div>
                </div>

                <div className="p-4 sm:p-6 bg-[var(--color-bg-default)]/30">
                    <div className="max-w-none space-y-4">
                        <NotificationList notifications={notifications} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationsMain;
