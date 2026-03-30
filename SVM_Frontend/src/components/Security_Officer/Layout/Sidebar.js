import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleMobileMenu, setMobileMenu } from '../../../reducers/uiSlice';
import { motion, AnimatePresence } from 'framer-motion';
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
    ChevronRight,
    Activity,
    Shield,
    Zap,
    Cpu
} from 'lucide-react';

const Sidebar = () => {
    const dispatch = useDispatch();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const location = useLocation();
    const isMobile = useSelector(state => state.ui.isMobile);
    const isMobileMenuOpen = useSelector(state => state.ui.isMobileMenuOpen);

    const menuItems = [
        { id: 'dashboard', label: 'Command Hub', icon: ShieldCheck, path: '/Security_Officer/dashboard', accent: 'text-mas-red' },
        { id: 'scanner', label: 'Node Scanner', icon: QrCode, path: '/Security_Officer/scanner' },
        { id: 'verification', label: 'Auth Protocols', icon: Shield, path: '/Security_Officer/verification' },
        { id: 'approval', label: 'Access Control', icon: UserCheck, path: '/Security_Officer/entry-approval' },
        { id: 'active', label: 'Node Presence', icon: Users, path: '/Security_Officer/active-visitors' },
        { id: 'exit', label: 'Exit Protocol', icon: ClipboardList, path: '/Security_Officer/exit-verification' },
        { id: 'incident', label: 'Threat Report', icon: AlertOctagon, path: '/Security_Officer/incident-report', danger: true },
        { id: 'logs', label: 'Movement Matrix', icon: History, path: '/Security_Officer/logs-history' },
        { id: 'notifications', label: 'Signal Alerts', icon: Bell, path: '/Security_Officer/notifications' },
    ];

    const handleNavClick = () => {
        if (isMobile) {
            dispatch(setMobileMenu(false));
        }
    };

    const sidebarVariants = {
        open: { x: 0, opacity: 1 },
        closed: { x: '-100%', opacity: 0 }
    };

    return (
        <>
            {/* Mobile Backdrop */}
            <AnimatePresence>
                {isMobile && isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => dispatch(setMobileMenu(false))}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] lg:hidden"
                    />
                )}
            </AnimatePresence>

            <aside className={`
                ${isMobile ? 'fixed top-0 left-0 h-full z-[101]' : 'relative flex-none'}
                ${isCollapsed ? 'w-24' : 'w-80'} 
                ${isMobile && !isMobileMenuOpen ? '-translate-x-full' : 'translate-x-0'}
                bg-[#0A0A0B] border-r border-white/5 flex flex-col transition-all duration-500 ease-[cubic-bezier(0.16, 1, 0.3, 1)] shadow-[20px_0_40px_rgba(0,0,0,0.4)]
            `}>
                {/* Tactical Header */}
                <div className={`p-8 border-b border-white/5 bg-[#0D0D0E]/80 backdrop-blur-xl relative flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} overflow-hidden`}>
                    {!isCollapsed && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex flex-col gap-2 relative z-10"
                        >
                            <img src="/logo_mas.png" alt="MAS Logo" className="h-6 w-auto mb-1 brightness-110" />
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 bg-mas-red rounded-full shadow-[0_0_10px_#C8102E] animate-pulse"></div>
                                <span className="text-mas-red uppercase text-[9px] font-black tracking-[0.5em] italic">Tactical_Node_04</span>
                            </div>
                        </motion.div>
                    )}
                    {isCollapsed && (
                        <img src="/logo_mas.png" alt="MAS Logo" className="h-5 w-auto brightness-110" />
                    )}

                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="absolute -right-3 top-1/2 -translate-y-1/2 w-7 h-7 bg-mas-red text-white flex items-center justify-center rounded-full shadow-[0_0_20px_rgba(200,16,46,0.4)] hover:scale-110 transition-all z-50 border border-white/20 group"
                    >
                        {isCollapsed ? <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" /> : <ChevronLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />}
                    </button>

                    {/* Decorative background element */}
                    <div className="absolute -right-10 -bottom-10 w-24 h-24 bg-mas-red/5 rounded-full blur-2xl"></div>
                </div>

                <nav className="flex-1 py-10 overflow-y-auto no-scrollbar scroll-smooth">
                    {!isCollapsed && (
                        <div className="px-10 mb-8 flex items-center justify-between">
                            <span className="text-mas-text-dim/30 uppercase text-[9px] font-black tracking-[0.4em] italic">Operational_Nav</span>
                            <div className="flex gap-1">
                                <div className="w-1 h-1 bg-mas-red/40 rounded-full"></div>
                                <div className="w-1 h-1 bg-mas-red/20 rounded-full"></div>
                            </div>
                        </div>
                    )}
                    <div className="flex flex-col px-4 gap-1.5">
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <NavLink
                                    key={item.id}
                                    to={item.path}
                                    onClick={handleNavClick}
                                    className={`
                                    relative group flex items-center gap-4 px-6 py-4 transition-all duration-500 rounded-2xl ${isActive ? 'bg-mas-red/5 text-white shadow-inner border border-mas-red/10' : 'text-mas-text-dim hover:text-white hover:bg-white/[0.02] border border-transparent'} ${isCollapsed && !isMobile ? 'justify-center px-0' : ''}
                                `}
                                >
                                    <div className={`relative ${isActive ? 'text-mas-red' : 'group-hover:text-mas-red'} transition-colors duration-500`}>
                                        <item.icon size={18} strokeWidth={isActive ? 2.5 : 1.5} />
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeGlow"
                                                className="absolute -inset-2 bg-mas-red/20 blur-md rounded-full -z-10"
                                            />
                                        )}
                                    </div>

                                    {!isCollapsed && (
                                        <span className={`uppercase text-[11px] font-black tracking-[0.2em] transition-all duration-500 ${isActive ? 'translate-x-1' : 'group-hover:translate-x-1'}`}>
                                            {item.label}
                                        </span>
                                    )}

                                    {isActive && !isCollapsed && (
                                        <motion.div
                                            layoutId="activeIndicator"
                                            className="ml-auto w-1 h-3 bg-mas-red rounded-full shadow-[0_0_8px_#C8102E]"
                                        />
                                    )}

                                    {isCollapsed && (
                                        <div className="absolute left-full ml-6 px-4 py-2 bg-[#121214] border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-[100] whitespace-nowrap rounded-lg shadow-[20px_0_40px_rgba(0,0,0,0.5)] translate-x-2 group-hover:translate-x-0 italic">
                                            <div className="flex items-center gap-3">
                                                <div className="w-1 h-3 bg-mas-red rounded-full"></div>
                                                {item.label}
                                            </div>
                                        </div>
                                    )}
                                </NavLink>
                            );
                        })}
                    </div>
                </nav>

                {/* Tactical Status & Profile */}
                <div className={`p-8 border-t border-white/5 bg-[#0D0D0E]/50 relative transition-all ${isCollapsed ? 'flex flex-col items-center gap-8' : ''}`}>
                    <div className={`mb-6 flex flex-col gap-3 ${isCollapsed ? 'hidden' : ''}`}>
                        <div className="flex items-center justify-between px-2">
                            <span className="text-mas-text-dim/30 text-[8px] font-black uppercase tracking-widest">Nodal_Security</span>
                            <span className="text-green-500 text-[8px] font-black">ENCRYPTED</span>
                        </div>
                        <div className="h-[2px] w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                animate={{ width: ['40%', '90%', '60%', '95%'] }}
                                transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                                className="h-full bg-mas-red shadow-[0_0_10px_#C8102E]"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4 group cursor-pointer w-full relative z-10">
                        <div className="relative">
                            <div className="w-12 h-12 rounded-2xl bg-mas-red flex items-center justify-center text-white font-black text-sm shadow-[0_0_20px_rgba(200,16,46,0.3)] border border-white/20 group-hover:rotate-12 transition-all duration-500 relative z-10">
                                SO
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#0D0D0E] shadow-[0_0_10px_#22C55E] z-20"></div>
                        </div>

                        {!isCollapsed && (
                            <div className="flex-1 min-w-0">
                                <p className="text-white uppercase text-[11px] font-black tracking-widest truncate group-hover:text-mas-red transition-colors">Guardian Node 04</p>
                                <div className="flex items-center gap-2">
                                    <Cpu size={8} className="text-mas-text-dim/40" />
                                    <p className="text-mas-text-dim/40 uppercase text-[8px] font-bold tracking-[0.2em] truncate italic">Security_Ops_Duty</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className={`mt-10 ${isCollapsed ? 'w-full flex justify-center' : ''}`}>
                        <NavLink to="/login" className="flex items-center gap-4 text-mas-text-dim hover:text-mas-red transition-all duration-300 group">
                            <div className="p-2 rounded-xl bg-white/[0.02] border border-white/5 group-hover:border-mas-red/40 group-hover:bg-mas-red/10 transition-all">
                                <LogOut size={16} className="group-hover:rotate-12 transition-transform" />
                            </div>
                            {!isCollapsed && <span className="text-[10px] font-black uppercase tracking-[0.4em] italic">Terminate Protocol</span>}
                        </NavLink>
                    </div>

                    {/* Tactical background detail */}
                    {!isCollapsed && (
                        <div className="absolute bottom-0 right-0 p-2 opacity-[0.02] pointer-events-none font-mono text-[60px] font-black italic">NODE_04</div>
                    )}
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
