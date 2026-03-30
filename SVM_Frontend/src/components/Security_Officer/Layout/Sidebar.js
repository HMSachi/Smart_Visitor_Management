import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
    QrCode, 
    ShieldCheck, 
    UserCheck, 
    Users, 
    ClipboardList, 
    AlertOctagon, 
    History, 
    Bell, 
    LogOut,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);

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
        <aside className={`flex-none relative ${isCollapsed ? 'w-20' : 'w-72 md:w-80 lg:w-72'} bg-mas-dark/95 border-r border-white/5 z-50 flex flex-col transition-[width] duration-300 ease-in-out shadow-2xl`}>
            {/* Tactical Header & Toggle */}
            <div className={`p-6 border-b border-white/5 bg-mas-black/50 relative flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
                {!isCollapsed && (
                    <div className="flex flex-col gap-1 animate-fade-in">
                        <img src="/logo_mas.png" alt="MAS Logo" className="h-7 w-auto mb-2" />
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-mas-red shadow-[0_0_8px_#C8102E]"></div>
                            <span className="text-mas-text-dim uppercase text-[10px] tracking-widest font-black">TACTICAL NODE</span>
                        </div>
                    </div>
                )}
                {isCollapsed && (
                    <img src="/logo_mas.png" alt="MAS Logo" className="h-6 w-auto" />
                )}

                <button 
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-mas-red text-white flex items-center justify-center rounded-full shadow-[0_0_15px_rgba(200,16,46,0.3)] hover:scale-110 transition-transform z-50 border border-white/10"
                >
                  {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>
            </div>

            <nav className="flex-1 py-8 overflow-y-auto no-scrollbar">
                {!isCollapsed && (
                    <div className="px-8 mb-6 animate-fade-in">
                        <span className="text-mas-text-dim uppercase text-[9px] tracking-[0.3em] font-black opacity-30">Operational Protocol</span>
                    </div>
                )}
                <div className="flex flex-col">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.id}
                            to={item.path}
                            className={({ isActive }) => `
                                relative group flex items-center gap-4 px-8 py-4 transition-all duration-300 border-l-2 ${isActive ? 'bg-mas-red/5 border-mas-red text-white' : 'border-transparent text-mas-text-dim hover:bg-white/[0.02] hover:text-white'} ${isCollapsed ? 'justify-center border-l-0' : ''}
                            `}
                        >
                            <item.icon size={18} />
                            {!isCollapsed && <span className="uppercase text-[11px] font-black tracking-widest animate-fade-in">{item.label}</span>}
                            
                            {isCollapsed && (
                                <div className="absolute left-full ml-4 px-3 py-2 bg-mas-red text-white text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap rounded-sm shadow-xl">
                                    {item.label}
                                </div>
                            )}
                        </NavLink>
                    ))}
                </div>
            </nav>

            {/* Profile Block */}
            <div className={`p-6 border-t border-white/5 bg-mas-black/30 transition-all ${isCollapsed ? 'flex flex-col items-center gap-6' : ''}`}>
                <div className="flex items-center gap-4 group cursor-pointer">
                    <div className="w-10 h-10 bg-mas-red flex items-center justify-center text-white font-black text-xs shadow-[0_0_15px_rgba(200,16,46,0.2)] border border-white/10 group-hover:scale-105 transition-transform">
                        SO
                    </div>
                    {!isCollapsed && (
                        <div className="animate-fade-in overflow-hidden">
                            <p className="text-white uppercase text-[11px] font-black truncate">Guardian Node 04</p>
                            <p className="text-mas-text-dim uppercase text-[8px] tracking-widest font-medium truncate">Duty Officer</p>
                        </div>
                    )}
                </div>
                
                <div className={`mt-8 ${isCollapsed ? 'w-full flex justify-center' : ''}`}>
                    <NavLink to="/login" className="flex items-center gap-3 text-mas-text-dim hover:text-mas-red uppercase transition-colors group">
                        <LogOut size={14} className="group-hover:scale-110 transition-transform" />
                        {!isCollapsed && <span className="text-[10px] font-black tracking-widest">Terminate Session</span>}
                    </NavLink>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
