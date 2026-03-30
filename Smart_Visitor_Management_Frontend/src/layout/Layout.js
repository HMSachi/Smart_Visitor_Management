import React from 'react';
import Box from '@mui/material/Box';

const Layout = ({ children }) => {
    return (
        <Box 
            component="main" 
            sx={{ 
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            {children}
        </Box>
    );
};

export default Layout;

