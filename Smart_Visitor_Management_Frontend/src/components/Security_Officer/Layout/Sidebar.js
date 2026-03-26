import React from 'react';
import { NavLink } from 'react-router-dom';
import { QrCode, ShieldCheck, UserCheck, Users, ClipboardList, AlertOctagon, History, Bell, LogOut } from 'lucide-react';

const Sidebar = () => {
    const menuItems = [
        { id: 'dashboard', label: 'Command Center', icon: ShieldCheck, path: '/Security_Officer/dashboard' },
        { id: 'scanner', label: 'QR Scanner', icon: QrCode, path: '/Security_Officer/scanner' },
        { id: 'verification', label: 'Verification', icon: ShieldCheck, path: '/Security_Officer/verification' },
        { id: 'approval', label: 'Entry Approval', icon: UserCheck, path: '/Security_Officer/entry-approval' },
        { id: 'active', label: 'Active Visitors', icon: Users, path: '/Security_Officer/active-visitors' },
        { id: 'exit', label: 'Exit Check', icon: ClipboardList, path: '/Security_Officer/exit-verification' },
        { id: 'incident', label: 'Report Incident', icon: AlertOctagon, path: '/Security_Officer/incident-report' },
        { id: 'logs', label: 'Movement Logs', icon: History, path: '/Security_Officer/logs-history' },
        { id: 'notifications', label: 'Security Alerts', icon: Bell, path: '/Security_Officer/notifications' },
    ];

    return (
        <aside className="fixed left-0 top-0 h-full w-72 bg-mas-dark border-r border-mas-border z-50 flex flex-col">
            <div className="p-8 border-b border-mas-border bg-mas-black/50">
                <div className="flex items-center gap-4 mb-2">
                    <img src="/logo_mas.png" alt="MAS Logo" className="h-8 w-auto" />
                    <div className="h-4 w-px bg-mas-border"></div>
                    <span className="text-white">SECURITY</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-mas-red shadow-[0_0_8px_#C8102E]"></div>
                    <span className="text-mas-text-dim uppercase">Tactical Access Node</span>
                </div>
            </div>

            <nav className="flex-1 py-8">
                <div className="px-8 mb-4">
                    <span className="text-mas-text-dim uppercase">Operational Protocol</span>
                </div>
                {menuItems.map((item) => (
                    <NavLink
                        key={item.id}
                        to={item.path}
                        className={({ isActive }) => `
                            flex items-center gap-4 px-8 py-4 cursor-pointer transition-all duration-300 border-l-2 ${isActive ? 'bg-mas-red/5 border-mas-red text-white' : 'border-transparent text-mas-text-dim hover:bg-white/[0.02] hover:text-white'}
                        `}
                    >
                        <item.icon size={18} />
                        <span className="uppercase">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-8 border-t border-mas-border bg-mas-black/30">
                <div className="flex items-center gap-4 group cursor-pointer mb-6">
                    <div className="w-10 h-10 bg-mas-red flex items-center justify-center text-white shadow-[0_0_15px_rgba(200,16,46,0.2)]">
                        SO
                    </div>
                    <div>
                        <p className="text-white uppercase">Guardian Node 04</p>
                        <p className="text-mas-text-dim uppercase">Duty Officer</p>
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
