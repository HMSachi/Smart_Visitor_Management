import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Inbox, ClipboardCheck, LogOut, CheckCircle,  Send,  Bell, UserCircle } from 'lucide-react';

const Sidebar = () => {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/contact_person/dashboard' },
        { id: 'inbox', label: 'Requests Inbox', icon: Inbox, path: '/contact_person/requests-inbox' },
        { id: 'review', label: 'Request Review', icon: ClipboardCheck, path: '/contact_person/request-review' },
        { id: 'approved', label: 'Approved Entries', icon: CheckCircle, path: '/contact_person/approved-requests' },
        { id: 'sent', label: 'Waiting for Admin', icon: Send, path: '/contact_person/sent-to-admin' },
        { id: 'notifications', label: 'Notifications', icon: Bell, path: '/contact_person/notifications' },
        { id: 'profile', label: 'Profile', icon: UserCircle, path: '/contact_person/profile-settings' },
    ];

    return (
        <aside className="fixed left-0 top-0 h-full w-72 bg-mas-dark border-r border-mas-border z-50 flex flex-col">
            <div className="p-8 border-b border-mas-border bg-mas-black/50">
                <div className="flex items-center gap-4 mb-2">
                    <img src="/logo_mas.png" alt="MAS Logo" className="h-8 w-auto" />
                    <div className="h-4 w-px bg-mas-border"></div>
                    <span className="text-white">ACCESS</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-mas-red shadow-[0_0_8px_#C8102E]"></div>
                    <span className="text-mas-text-dim uppercase">Contact Person Portal</span>
                </div>
            </div>

            <nav className="flex-1 py-8">
                <div className="px-8 mb-4">
                    <span className="text-mas-text-dim uppercase">Management Workflow</span>
                </div>
                {menuItems.map((item) => (
                    <NavLink
                        key={item.id}
                        to={item.path}
                        className={({ isActive }) => `
                            mas-sidebar-item ${isActive ? 'active text-white' : 'text-mas-text-dim hover:text-white'}
                        `}
                    >
                        <item.icon size={18} />
                        <span className="uppercase">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-8 border-t border-mas-border bg-mas-black/30">
                <div className="flex items-center gap-4 group cursor-pointer mb-6">
                    <div className="w-10 h-10 bg-mas-red/10 border border-mas-red/20 flex items-center justify-center text-mas-red group-hover:bg-mas-red group-hover:text-white transition-all">
                        CP
                    </div>
                    <div>
                        <p className="text-white uppercase">Sachi</p>
                        <p className="text-mas-text-dim uppercase">Contact Person</p>
                    </div>
                </div>
                <NavLink to="/login" className="flex items-center gap-3 text-mas-text-dim hover:text-mas-red uppercase transition-colors">
                    <LogOut size={14} />
                    <span>Terminate Session</span>
                </NavLink>
            </div>
        </aside>
    );
};

export default Sidebar;
