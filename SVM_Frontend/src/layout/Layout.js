import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Sidebar from '../components/Admin/Layout/Sidebar';

const Layout = ({ children }) => {
    const location = useLocation();
    const isSidebarCollapsed = useSelector(state => state.ui.isSidebarCollapsed);
    const isMobile = useSelector(state => state.ui.isMobile);

    // Paths that should show the Admin/Staff Sidebar
    const isDashboardPath = location.pathname.startsWith('/admin') || 
                            location.pathname.startsWith('/contact_person') || 
                            location.pathname.startsWith('/Security_Officer');

    const isAdminPath = location.pathname.startsWith('/admin');
    const isLoginPage = location.pathname === '/login' || location.pathname === '/';

    return (
        <Box className="h-screen w-full flex bg-mas-dark-900 overflow-hidden">
            {isAdminPath && !isLoginPage && <Sidebar />}
            
            <Box 
                component="main" 
                className={`flex-1 flex flex-col min-w-0 transition-all duration-500 ease-in-out overflow-y-auto
                    ${!isDashboardPath && !isLoginPage ? 'pt-20' : ''}`}
            >
                {children}
            </Box>
        </Box>
    );
};

export default Layout;

