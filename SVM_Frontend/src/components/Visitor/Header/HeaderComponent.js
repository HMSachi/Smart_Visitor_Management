import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { ArrowLeft, Menu, X, Home, Shield, Activity, Plus } from "lucide-react";
import { Drawer, IconButton, Box, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { toggleMobileMenu, setMobileMenu } from '../../../reducers/uiSlice';

const HeaderComponent = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isMobileMenuOpen = useSelector(state => state.ui.isMobileMenuOpen);
    
    const menuItems = [
        { label: 'Home', path: '/home', icon: Home },
        { label: 'Access Control', path: '/access', icon: Shield },
        { label: 'Status Check', path: '/status', icon: Activity },
    ];

    const handleNavigate = (path) => {
        navigate(path);
        dispatch(setMobileMenu(false));
    };

    return (
        <header className="fixed top-0 left-0 w-full z-[100] h-16 bg-bg border-b border-white/[0.03] flex items-center">
            <div className="max-w-7xl mx-auto px-6 w-full flex justify-between items-center">
                {/* Logo and Back */}
                <div className="flex items-center gap-4 md:gap-8">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="w-8 h-8 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-center text-gray-500 hover:text-white transition-all active:scale-95"
                    >
                        <ArrowLeft size={16} />
                    </button>
                    
                    <Link to="/home" className="flex items-center group">
                        <img 
                            src="/logo_mas.png" 
                            alt="MAS Logo" 
                            className="h-6 w-auto brightness-90 group-hover:brightness-100 transition-all"
                        />
                        <div className="hidden sm:block ml-3 h-4 w-px bg-white/10"></div>
                        <span className="hidden sm:block ml-3 text-white font-medium tracking-tighter text-sm uppercase">
                            Access <span className="text-primary">Portal</span>
                        </span>
                    </Link>
                </div>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center space-x-6">
                    {menuItems.map((item) => (
                        <Link 
                            key={item.path}
                            to={item.path} 
                            className="text-[13px] font-bold text-gray-500 hover:text-white transition-all uppercase tracking-widest"
                        >
                            {item.label}
                        </Link>
                    ))}
                    
                    <button 
                        onClick={() => navigate('/request-step-1')}
                        className="compact-btn !px-5 !py-2 !bg-primary hover:!bg-primary-hover"
                    >
                        Request Visit
                    </button>
                </nav>

                {/* Mobile Menu Trigger */}
                <IconButton 
                    onClick={() => dispatch(toggleMobileMenu())}
                    className="md:hidden text-white bg-white/[0.03] p-3 rounded-xl border border-white/[0.05]"
                >
                    <Menu size={24} />
                </IconButton>
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
                        backgroundColor: '#0A0A0B',
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