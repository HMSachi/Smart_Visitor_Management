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
        <div className="p-10 space-y-10 animate-fade-in-slow">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-2">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-1.5 h-1.5 bg-mas-red rounded-full shadow-[0_0_8px_#C8102E] animate-pulse"></div>
                        <span className="text-mas-red text-[10px] font-medium uppercase tracking-[0.3em]">Operational Alerts</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <p className="text-gray-300 text-xs uppercase tracking-widest opacity-90">System intelligence and activity log</p>
                        <span className="px-3 py-1 bg-mas-red/10 border border-mas-red/20 text-mas-red text-[9px] font-medium uppercase tracking-widest rounded-lg">
                            {notifications.filter(n => n.unread).length} Active Alerts
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button onClick={markAllRead} className="flex items-center gap-3 px-6 py-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-[10px] font-medium uppercase tracking-widest text-gray-300 hover:text-white hover:border-white/20 transition-all group">
                        <CheckSquare size={14} className="group-hover:text-mas-red transition-colors" />
                        Acknowledge All
                    </button>
                    <button className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-gray-300 hover:text-mas-red hover:border-mas-red transition-all shadow-lg">
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>

            <div className="max-w-4xl space-y-4">
                <NotificationList notifications={notifications} />
            </div>
        </div>
    );
};

export default NotificationsMain;
