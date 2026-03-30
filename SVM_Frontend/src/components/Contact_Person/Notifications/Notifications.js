import React, { useState } from 'react';
import NotificationList from './NotificationList';
import { Bell, Trash2, CheckSquare } from 'lucide-react';

const NotificationsMain = () => {
    const [notifications, setNotifications] = useState([
        { id: 1, title: 'New Visitor Request', message: 'John Doe has submitted a Step 2 request for MAS Fabric Park.', time: '2 mins ago', type: 'pending', unread: true },
        { id: 2, title: 'Admin Approval Success', message: 'Request VR-2024-001 for Michael Chen has been finalized by Admin.', time: '1 hour ago', type: 'approval', unread: true },
        { id: 3, title: 'Request Rejected', message: 'Visitor Emma Wilson rejection confirmed by Security Hub.', time: '5 hours ago', type: 'rejection', unread: false },
        { id: 4, title: 'System Maintenance', message: 'The Visitor Management Portal will undergo node synchronization at 22:00.', time: '1 day ago', type: 'info', unread: false },
        { id: 5, title: 'Profile Updated', message: 'Your security clearance credentials have been successfully synced.', time: '2 days ago', type: 'approval', unread: false },
    ]);

    const markAllRead = () => {
        setNotifications(notifications.map(n => ({ ...n, unread: false })));
    };

    return (
        <div className="p-12 space-y-12 animate-fade-in">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-mas-border pb-12">
                <div>
                    <div className="flex items-center gap-4 mb-4">
                        <Bell size={14} className="text-mas-red" />
                        <span className="text-mas-red uppercase">Operational Alerts</span>
                        <div className="h-[1px] w-12 bg-mas-red"></div>
                    </div>
                    <h1 className="uppercase text-white flex items-center gap-6">
                        Activity Log
                        <span className="px-4 py-2 mas-glass border-mas-red/30 text-mas-red inline-flex">
                            {notifications.filter(n => n.unread).length} New
                        </span>
                    </h1>
                </div>

                <div className="flex items-center gap-4">
                    <button onClick={markAllRead} className="flex items-center gap-3 px-8 py-3 mas-glass border-white/5 text-mas-text-dim uppercase hover:text-white hover:border-white/20 transition-all">
                        <CheckSquare size={14} />
                        Mark All as Read
                    </button>
                    <button className="p-3 mas-glass border-white/5 text-mas-text-dim hover:text-mas-red hover:border-mas-red transition-all">
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>

            <div className="max-w-4xl">
                <NotificationList notifications={notifications} />
            </div>
        </div>
    );
};

export default NotificationsMain;
