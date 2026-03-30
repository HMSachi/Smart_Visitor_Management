import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
    LayoutDashboard, 
    Inbox, 
    LogOut, 
    CheckCircle, 
    Bell,
    ChevronLeft,
    ChevronRight 
} from 'lucide-react';

const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/contact_person/dashboard' },
        { id: 'inbox', label: 'Requests Inbox', icon: Inbox, path: '/contact_person/requests-inbox' },
        { id: 'approved', label: 'Approved Forms', icon: CheckCircle, path: '/contact_person/approved-requests' },
        { id: 'notifications', label: 'Notifications', icon: Bell, path: '/contact_person/notifications' },
    ];

    return (
        <aside className={`flex-none relative ${isCollapsed ? 'w-20' : 'w-72 md:w-80 lg:w-72'} bg-mas-dark/95 border-r border-white/5 z-50 flex flex-col transition-[width] duration-300 ease-in-out`}>
            {/* Header & Toggle */}
            <div className={`p-6 border-b border-white/5 bg-mas-black/50 relative flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
                {!isCollapsed && (
                    <div className="flex flex-col gap-1 animate-fade-in">
                        <img src="/logo_mas.png" alt="MAS Logo" className="h-7 w-auto mb-2" />
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-mas-red shadow-[0_0_8px_#C8102E]"></div>
                            <span className="text-mas-text-dim uppercase text-[10px] tracking-widest font-bold">CP PORTAL</span>
                        </div>
                    </div>
                )}
                {isCollapsed && (
                    <img src="/logo_mas.png" alt="MAS Logo" className="h-6 w-auto" />
                )}

                <button 
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-mas-red text-white flex items-center justify-center rounded-full shadow-[0_0_15px_rgba(200,16,46,0.3)] hover:scale-110 transition-transform z-50"
                >
                  {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>
            </div>

            <nav className="flex-1 py-8">
                {!isCollapsed && (
                    <div className="px-8 mb-6 animate-fade-in">
                        <span className="text-mas-text-dim uppercase text-[9px] tracking-[0.3em] font-black opacity-50">Operational Node</span>
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
                            {!isCollapsed && <span className="uppercase text-xs font-bold tracking-widest animate-fade-in">{item.label}</span>}
                            
                            {isCollapsed && (
                                <div className="absolute left-full ml-4 px-3 py-2 bg-mas-red text-white text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap rounded-sm">
                                    {item.label}
                                </div>
                            )}
                        </NavLink>
                    ))}
                </div>
            </nav>

            <div className={`p-6 border-t border-white/5 bg-mas-black/30 transition-all ${isCollapsed ? 'flex flex-col items-center gap-6' : ''}`}>
                <div className="flex items-center gap-4 group cursor-pointer">
                    <div className="w-10 h-10 bg-mas-red/10 border border-mas-red/20 flex items-center justify-center text-mas-red font-black text-xs group-hover:bg-mas-red group-hover:text-white transition-all shadow-[0_0_15px_rgba(200,16,46,0.1)]">
                        CP
                    </div>
                    {!isCollapsed && (
                        <div className="animate-fade-in overflow-hidden">
                            <p className="text-white uppercase text-[11px] font-black truncate">Sachi</p>
                            <p className="text-mas-text-dim uppercase text-[8px] tracking-widest font-medium truncate">Contact Person</p>
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
