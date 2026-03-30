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
        <header className="fixed top-0 left-0 w-full z-[100] h-20 bg-mas-dark-900/80 backdrop-blur-2xl border-b border-white/[0.05] flex items-center">
            <div className="max-w-7xl mx-auto px-6 w-full flex justify-between items-center">
                {/* Logo and Back */}
                <div className="flex items-center gap-4 md:gap-8">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-gray-400 hover:text-white transition-all active:scale-95"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    
                    <Link to="/home" className="flex items-center group">
                        <img 
                            src="/logo_mas.png" 
                            alt="MAS Logo" 
                            className="h-8 md:h-10 w-auto filter brightness-110 group-hover:brightness-125 transition-all"
                        />
                        <div className="hidden sm:block ml-4 h-6 w-px bg-white/10"></div>
                        <span className="hidden sm:block ml-4 text-white font-bold tracking-tighter text-lg uppercase">
                            Access <span className="text-mas-red">Portal</span>
                        </span>
                    </Link>
                </div>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center space-x-10">
                    {menuItems.map((item) => (
                        <Link 
                            key={item.path}
                            to={item.path} 
                            className="text-sm font-semibold text-gray-400 hover:text-mas-red transition-all uppercase tracking-widest"
                        >
                            {item.label}
                        </Link>
                    ))}
                    
                    <button 
                        onClick={() => navigate('/request-step-1')}
                        className="px-8 py-3.5 bg-mas-red text-white text-sm font-bold uppercase rounded-xl hover:bg-mas-red-hover hover:shadow-[0_0_30px_rgba(200,16,46,0.4)] transition-all transform active:scale-95"
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
                        maxWidth: '360px',
                        backgroundColor: '#0A0A0B',
                        backgroundImage: 'linear-gradient(to bottom, rgba(200, 16, 46, 0.05), transparent)',
                        borderLeft: '1px solid rgba(255, 255, 255, 0.05)'
                    }
                }}
            >
                <Box className="p-8 h-full flex flex-col">
                    <div className="flex justify-between items-center mb-12">
                        <span className="text-mas-red font-black tracking-widest text-xl">MENU</span>
                        <IconButton onClick={() => dispatch(setMobileMenu(false))} className="text-white bg-white/5">
                            <X size={20} />
                        </IconButton>
                    </div>

                    <List className="space-y-4">
                        {menuItems.map((item) => (
                            <ListItem 
                                button 
                                key={item.path}
                                onClick={() => handleNavigate(item.path)}
                                className="rounded-2xl bg-white/[0.03] border border-white/[0.05] p-5"
                            >
                                <ListItemIcon className="min-w-0 mr-4">
                                    <item.icon className="text-mas-red" size={24} />
                                </ListItemIcon>
                                <ListItemText 
                                    primary={item.label} 
                                    className="text-white uppercase font-bold"
                                    primaryTypographyProps={{ style: { fontWeight: 700, fontSize: '0.875rem', letterSpacing: '0.1em' } }}
                                />
                            </ListItem>
                        ))}
                    </List>

                    <div className="mt-auto">
                        <button 
                            onClick={() => handleNavigate('/request-step-1')}
                            className="w-full py-6 bg-mas-red text-white font-black uppercase rounded-2xl shadow-[0_20px_40px_rgba(200,16,46,0.2)] flex items-center justify-center gap-3"
                        >
                            <Plus size={20} /> Request Visit
                        </button>
                    </div>
                </Box>
            </Drawer>
        </header>
    );
};

export default HeaderComponent;