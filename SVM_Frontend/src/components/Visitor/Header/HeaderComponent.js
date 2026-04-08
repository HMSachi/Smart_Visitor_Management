import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { ArrowLeft, Menu, X, Home, Shield, Activity, Plus, LogOut } from "lucide-react";
import { Drawer, IconButton, Box, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { toggleMobileMenu, setMobileMenu } from '../../../reducers/uiSlice';
import ThemeToggleButton from '../../common/ThemeToggleButton';
import { LOGOUT } from '../../../constants/LoginConstants';

const HeaderComponent = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isMobileMenuOpen = useSelector(state => state.ui.isMobileMenuOpen);
    const { user } = useSelector(state => state.login);
    
    // Dynamic extraction for the visitor
    const userEmail = user?.ResultSet?.[0]?.VA_Email || user?.ResultSet?.[0]?.VV_Email || (user?.ResultSet?.[0]?.VA_Role === 'Visitor' ? user?.ResultSet?.[0]?.VA_Email : null);
    
    const menuItems = [
        { label: 'Home', path: '/home', icon: Home },
        { label: 'Access Control', path: '/access', icon: Shield },
        { label: 'Status Check', path: '/status', icon: Activity },
    ];

    const handleNavigate = (path) => {
        navigate(path);
        dispatch(setMobileMenu(false));
    };

    const handleLogout = () => {
        const shouldLogout = window.confirm('Are you sure you want to logout?');
        if (!shouldLogout) return;

        localStorage.removeItem('user_session');
        dispatch({ type: LOGOUT });
        dispatch(setMobileMenu(false));
        navigate('/login');
    };

    return (
        <header className="fixed top-0 left-0 w-full z-[100] h-20 bg-black border-b border-white/[0.05] flex items-center shadow-2xl">
            <div className="px-8 md:px-16 w-full flex justify-between items-center">
                {/* Logo and Back */}
                <div className="flex items-center gap-6 md:gap-12">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="w-10 h-10 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-gray-500 hover:text-white transition-all active:scale-95"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    
                    <Link to="/home" className="flex items-center group">
                        <img 
                            src="/logo_mas.png" 
                            alt="MAS Logo" 
                            className="h-7 w-auto brightness-90 group-hover:brightness-100 transition-all"
                        />
                        <div className="hidden sm:block ml-4 h-5 w-px bg-white/10"></div>
                        <span className="hidden sm:block ml-4 text-white font-bold tracking-tighter text-base uppercase">
                            Access <span className="text-primary">Portal</span>
                        </span>
                    </Link>
                </div>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-10">
                    <div className="flex items-center gap-8 mr-6">
                        {menuItems.map((item) => (
                            <Link 
                                key={item.path}
                                to={item.path} 
                                className="text-[12px] font-black text-gray-500 hover:text-white transition-all uppercase tracking-[0.2em]"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                    
                    <button 
                        onClick={() => navigate('/request-step-1')}
                        className="px-8 h-11 bg-primary hover:bg-primary-hover text-white text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-lg shadow-primary/20"
                    >
                        Request Visit
                    </button>

                    <ThemeToggleButton className="!ml-2" />

                    <button
                        onClick={handleLogout}
                        className="h-11 px-4 border border-white/10 text-gray-300 hover:text-white hover:border-white/25 transition-all uppercase tracking-[0.18em] text-[10px] font-black flex items-center gap-2"
                        title="Logout"
                    >
                        <LogOut size={14} />
                        Logout
                    </button>

                    {userEmail && (
                        <div className="flex items-center gap-4 pl-10 border-l border-white/10 group cursor-default">
                            <div className="flex flex-col items-end">
                                <span className="text-[9px] text-gray-600 uppercase font-black tracking-[0.3em]">IDENTIFIED</span>
                                <span className="text-[11px] text-white/90 font-bold uppercase tracking-widest max-w-[150px] truncate">{userEmail}</span>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-white/[0.03] border border-white/5 flex items-center justify-center text-primary/40 group-hover:text-primary transition-all">
                                <Activity size={16} />
                            </div>
                        </div>
                    )}
                </nav>

                {/* Mobile Menu Trigger */}
                <IconButton 
                    onClick={() => dispatch(toggleMobileMenu())}
                    className="md:hidden text-white bg-white/[0.03] p-3 rounded-xl border border-white/[0.05]"
                >
                    <Menu size={24} />
                </IconButton>
                <div className="md:hidden ml-2">
                    <ThemeToggleButton />
                </div>
            </div>

            {/* Premium Mobile Drawer */}
            <Drawer
                anchor="right"
                open={isMobileMenuOpen}
                onClose={() => dispatch(setMobileMenu(false))}
                PaperProps={{
                    sx: {
                        width: '85%',
                        maxWidth: '320px',
                        backgroundColor: 'var(--color-bg-default)',
                        borderLeft: '1px solid rgba(255, 255, 255, 0.03)'
                    }
                }}
            >
                <Box className="p-8 h-full flex flex-col">
                    <div className="flex justify-between items-center mb-12">
                        <span className="text-primary font-medium tracking-widest text-xl">MENU</span>
                        <IconButton onClick={() => dispatch(setMobileMenu(false))} className="text-white bg-white/5">
                            <X size={20} />
                        </IconButton>
                    </div>

                    {userEmail && (
                        <div className="mb-10 p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                            <span className="text-[10px] text-primary font-black uppercase tracking-[0.3em] block mb-1">Authenticated As</span>
                            <span className="text-sm text-white/90 font-bold uppercase tracking-widest truncate block">{userEmail}</span>
                        </div>
                    )}

                    <List className="space-y-2">
                        {menuItems.map((item) => (
                            <ListItem 
                                button 
                                key={item.path}
                                onClick={() => handleNavigate(item.path)}
                                className="rounded-lg bg-white/[0.01] border border-white/5 p-4"
                            >
                                <ListItemIcon className="min-w-0 mr-3">
                                    <item.icon className="text-primary" size={18} />
                                </ListItemIcon>
                                <ListItemText 
                                    primary={item.label} 
                                    primaryTypographyProps={{ style: { fontWeight: 800, fontSize: '12px', letterSpacing: '0.15em', color: '#fff', textTransform: 'uppercase' } }}
                                />
                            </ListItem>
                        ))}

                        <ListItem
                            button
                            onClick={handleLogout}
                            className="rounded-lg bg-white/[0.01] border border-white/5 p-4"
                        >
                            <ListItemIcon className="min-w-0 mr-3">
                                <LogOut className="text-primary" size={18} />
                            </ListItemIcon>
                            <ListItemText
                                primary="Logout"
                                primaryTypographyProps={{ style: { fontWeight: 800, fontSize: '12px', letterSpacing: '0.15em', color: '#fff', textTransform: 'uppercase' } }}
                            />
                        </ListItem>
                    </List>

                    <div className="mt-auto">
                        <button 
                            onClick={() => handleNavigate('/request-step-1')}
                            className="compact-btn !w-full !py-4 flex items-center justify-center gap-2"
                        >
                            <Plus size={16} /> Request Visit
                        </button>
                    </div>
                </Box>
            </Drawer>
        </header>
    );
};

export default HeaderComponent;
