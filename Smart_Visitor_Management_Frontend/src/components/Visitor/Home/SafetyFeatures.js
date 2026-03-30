import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Container, Grid, Typography, Paper, Stack, Button, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';

const SafetyFeatures = () => {
    const categories = [
        {
            name: "SAFETY OPERATIONS",
            items: ["Dynamic Protocol Briefing", "Real-time Compliance Tracking", "Emergency Response Node"]
        },
        {
            name: "DATA SOVEREIGNTY",
            items: ["Deep Encryption Infrastructure", "Unified Privacy Gateway", "Regulatory Audit Logging"]
        },
        {
            name: "SECURE PERIMETER",
            items: ["Advanced ID Verification", "Multi-zone Access Logic", "Integrated Guest Grid"]
        }
    ];

    return (
        <Box 
            id="safety" 
            component="section" 
            sx={{ 
                py: { xs: 12, md: 20 }, 
                bgcolor: '#0a0a0b', 
                borderTop: '1px solid rgba(255,255,255,0.05)' 
            }}
        >
            <Container maxWidth="lg">
                <Box 
                    sx={{ 
                        display: 'flex', 
                        flexDirection: { xs: 'column', md: 'row' }, 
                        alignItems: { xs: 'flex-start', md: 'center' }, 
                        justifyContent: 'space-between', 
                        mb: 12, 
                        gap: 12 
                    }}
                >
                    <Box sx={{ maxWidth: 600 }}>
                        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                            <Box sx={{ width: 32, height: 1, bgcolor: '#E50914' }} />
                            <Typography sx={{ color: '#E50914', textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '0.75rem', fontWeight: 700 }}>
                                Security First
                            </Typography>
                        </Stack>
                        <Typography variant="h3" sx={{ color: 'white', fontWeight: 900, textTransform: 'uppercase', mb: 3 }}>
                            ELITE <Box component="span" sx={{ color: '#E50914' }}>PROTECTION</Box>
                        </Typography>
                        <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.1rem', lineHeight: 1.6 }}>
                            A commitment to the highest security standards, ensuring absolute integrity of the MAS corporate perimeter.
                        </Typography>
                    </Box>
                </Box>

                <Grid container spacing={4}>
                    {categories.map((category, index) => (
                        <Grid item xs={12} md={4} key={index}>
                            <Paper 
                                elevation={0}
                                sx={{ 
                                    p: 6, 
                                    height: '100%',
                                    bgcolor: 'rgba(255,255,255,0.02)', 
                                    border: '1px solid rgba(229, 9, 20, 0.1)', 
                                    borderRadius: 4,
                                    position: 'relative',
                                    overflow: 'hidden',
                                    transition: '0.4s',
                                    '&:hover': {
                                        borderColor: 'rgba(229, 9, 20, 0.4)',
                                        bgcolor: 'rgba(255,255,255,0.03)',
                                        transform: 'translateY(-8px)'
                                    }
                                }}
                            >
                                <Box sx={{ position: 'absolute', top: 0, right: 0, width: 96, height: 96, bgcolor: 'rgba(229, 9, 20, 0.05)', borderRadius: '0 0 0 100%', pointerEvents: 'none' }} />
                                <Typography sx={{ color: '#E50914', fontWeight: 700, mb: 4, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                    {category.name}
                                </Typography>
                                <List sx={{ p: 0 }}>
                                    {category.items.map((item, idx) => (
                                        <ListItem key={idx} sx={{ p: 0, mb: 3, alignItems: 'flex-start' }}>
                                            <ListItemIcon sx={{ minWidth: 24, mt: 1 }}>
                                                <Box sx={{ width: 6, height: 6, bgcolor: '#E50914' }} />
                                            </ListItemIcon>
                                            <ListItemText 
                                                primary={item} 
                                                sx={{ 
                                                    '& .MuiListItemText-primary': { 
                                                        color: 'white', 
                                                        fontSize: '0.95rem',
                                                        fontWeight: 500
                                                    } 
                                                }} 
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
                
                {/* CTA Banner */}
                <Box 
                    sx={{ 
                        mt: 24, 
                        p: '1px', 
                        background: 'linear-gradient(to right, rgba(229, 9, 20, 0.4), rgba(229, 9, 20, 0.1), transparent)' 
                    }}
                >
                    <Box 
                        sx={{ 
                            p: { xs: 6, md: 10 }, 
                            bgcolor: '#0a0a0b', 
                            display: 'flex', 
                            flexDirection: { xs: 'column', md: 'row' }, 
                            alignItems: 'center', 
                            justifyContent: 'space-between',
                            gap: 6
                        }}
                    >
                        <Box sx={{ maxWidth: 500, textAlign: { xs: 'center', md: 'left' } }}>
                            <Typography variant="h5" sx={{ color: 'white', fontWeight: 700, mb: 2, textTransform: 'uppercase' }}>
                                Access Clearance Required?
                            </Typography>
                            <Typography sx={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
                                Initiate your digital clearance request for secure entry to MAS Holdings facilities.
                            </Typography>
                        </Box>
                        <Button 
                            component={Link} 
                            to="/request-step-1" 
                            variant="contained" 
                            sx={{ 
                                px: 8, 
                                py: 2.5, 
                                bgcolor: '#E50914', 
                                border: 'none',
                                borderRadius: 0,
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: '0.15em',
                                boxShadow: '0 0 30px rgba(200, 16, 46, 0.2)',
                                '&:hover': { bgcolor: '#B0060E' }
                            }}
                        >
                            Request Visit
                        </Button>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default SafetyFeatures;
