import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleMobileMenu, setMobileMenu } from '../../../reducers/uiSlice';
import {
    LayoutDashboard,
    Inbox,
    LogOut,
    CheckCircle,
    Bell,
    ChevronLeft,
    ChevronRight,
    X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = () => {
    const dispatch = useDispatch();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const isMobile = useSelector(state => state.ui.isMobile);
    const isMobileMenuOpen = useSelector(state => state.ui.isMobileMenuOpen);

    const handleNavClick = () => {
        if (isMobile) {
            dispatch(setMobileMenu(false));
        }
    };

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/contact_person/dashboard' },
        { id: 'inbox', label: 'Requests Inbox', icon: Inbox, path: '/contact_person/requests-inbox' },
        { id: 'approved', label: 'Approved Forms', icon: CheckCircle, path: '/contact_person/approved-requests' },
        { id: 'notifications', label: 'Notifications', icon: Bell, path: '/contact_person/notifications' },
    ];

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
                ${isCollapsed ? 'w-20' : 'w-72'} 
                ${isMobile && !isMobileMenuOpen ? '-translate-x-full' : 'translate-x-0'}
                bg-[#0a0a0b]/95 backdrop-blur-md border-r border-white/5 flex flex-col transition-all duration-500 ease-in-out shadow-2xl
            `}>
                {/* Header & Toggle */}
                <div className={`p-8 pt-12 border-b border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent relative flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
                    {!isCollapsed && (
                        <div className="flex flex-col gap-3 animate-fade-in">
                            <img src="/logo_mas.png" alt="MAS Logo" className="h-7 w-auto brightness-110" />
                            <div className="flex items-center gap-2 ml-1">
                                <div className="w-1.5 h-1.5 bg-mas-red rounded-full shadow-[0_0_8px_#C8102E]"></div>
                                <span className="text-mas-text-dim uppercase text-[9px] tracking-[0.25em] font-black opacity-80">CONTACT PORTAL</span>
                            </div>
                        </div>
                    )}
                    {isCollapsed && (
                        <img src="/logo_mas.png" alt="MAS Logo" className="h-5 w-auto animate-fade-in-slow" />
                    )}

                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#1a1a1c] border border-white/10 text-white flex items-center justify-center rounded-full hover:bg-mas-red hover:border-mas-red transition-all duration-300 z-50 group shadow-xl"
                    >
                        {isCollapsed ? <ChevronRight size={10} className="group-hover:scale-125 transition-transform" /> : <ChevronLeft size={10} className="group-hover:scale-125 transition-transform" />}
                    </button>
                </div>

                <nav className="flex-1 py-8 overflow-y-auto custom-scrollbar">
                    {!isCollapsed && (
                        <div className="px-8 mb-6 opacity-40">
                            <span className="text-mas-text-dim uppercase text-[10px] tracking-[0.3em] font-black">Main Navigation</span>
                        </div>
                    )}
                    <div className="flex flex-col gap-1 px-3">
                        {menuItems.map((item) => (
                            <NavLink
                                key={item.id}
                                to={item.path}
                                onClick={handleNavClick}
                                className={({ isActive }) => `
                                relative group flex items-center gap-4 px-5 py-3.5 rounded-xl transition-all duration-300 ${isActive ? 'bg-mas-red/10 text-white shadow-[inset_0_0_20px_rgba(200,16,46,0.05)]' : 'text-mas-text-dim hover:bg-white/[0.03] hover:text-white'} ${isCollapsed && !isMobile ? 'justify-center px-0 mx-auto w-12' : ''}
                            `}
                            >
                                <item.icon size={20} className={`transition-transform duration-300 group-hover:scale-110 ${isCollapsed ? '' : ''}`} />
                                {!isCollapsed && <span className="text-sm font-medium tracking-wide">{item.label}</span>}

                                {isCollapsed && (
                                    <div className="absolute left-full ml-4 px-3 py-1.5 bg-white text-black text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0 pointer-events-none z-50 whitespace-nowrap rounded-md shadow-2xl">
                                        {item.label}
                                    </div>
                                )}
                            </NavLink>
                        ))}
                    </div>
                </nav>

                <div className={`p-8 border-t border-white/5 bg-white/[0.01] transition-all ${isCollapsed ? 'flex flex-col items-center gap-6' : ''}`}>
                    <div className="flex items-center gap-4 p-3 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all group cursor-pointer">
                        <div className="w-10 h-10 rounded-xl bg-mas-red/10 border border-mas-red/20 flex items-center justify-center text-mas-red font-black text-xs group-hover:bg-mas-red group-hover:text-white transition-all shadow-[0_0_20px_rgba(200,16,46,0.1)]">
                            CP
                        </div>
                        {!isCollapsed && (
                            <div className="animate-fade-in overflow-hidden">
                                <p className="text-white text-sm font-bold truncate">Sachi</p>
                                <p className="text-mas-text-dim text-[10px] uppercase tracking-wider font-medium truncate">Security Personnel</p>
                            </div>
                        )}
                    </div>

                    <div className={`mt-6 ${isCollapsed ? 'w-full flex justify-center' : ''}`}>
                        <NavLink to="/login" className="flex items-center gap-3 text-mas-text-dim hover:text-mas-red transition-all group px-3 py-2 rounded-lg hover:bg-mas-red/5">
                            <LogOut size={16} className="group-hover:translate-x-1 transition-transform" />
                            {!isCollapsed && <span className="text-xs font-bold tracking-wide">Logout</span>}
                        </NavLink>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
