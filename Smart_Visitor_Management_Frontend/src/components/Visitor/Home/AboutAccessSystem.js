import React from 'react';
import { Box, Container, Grid, Typography, Paper, Stack } from '@mui/material';

const AboutAccessSystem = () => {
    const features = [
        {
            title: "DIGITAL PROTOCOL",
            description: "Encrypted registration for global visitors via our unified intelligence node.",
            icon: "01"
        },
        {
            title: "INSTANT TELEMETRY",
            description: "Real-time host notification and visitor tracking across the entire facility grid.",
            icon: "02"
        },
        {
            title: "SECURE CLEARANCE",
            description: "Automated identity verification integrated with MAS biometric security layers.",
            icon: "03"
        }
    ];

    return (
        <Box 
            id="about" 
            component="section" 
            sx={{ 
                py: { xs: 12, md: 20 }, 
                bgcolor: '#0a0a0b', 
                position: 'relative', 
                overflow: 'hidden' 
            }}
        >
            <Container maxWidth="lg">
                <Box 
                    sx={{ 
                        display: 'flex', 
                        flexDirection: { xs: 'column', md: 'row' }, 
                        alignItems: { xs: 'flex-start', md: 'flex-end' }, 
                        justifyContent: 'space-between', 
                        mb: 12 
                    }}
                >
                    <Box sx={{ maxWidth: 600 }}>
                        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                            <Box sx={{ width: 32, height: 1, bgcolor: '#E50914' }} />
                            <Typography sx={{ color: '#E50914', textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '0.75rem', fontWeight: 700 }}>
                                Architecture
                            </Typography>
                        </Stack>
                        <Typography variant="h3" sx={{ color: 'white', fontWeight: 900, textTransform: 'uppercase', lineHeight: 1.1 }}>
                            SYSTEM <Box component="span" sx={{ color: '#E50914' }}>INTELLIGENCE</Box>
                        </Typography>
                    </Box>
                    <Typography sx={{ mt: { xs: 4, md: 0 }, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontSize: '0.85rem', maxWidth: 300, fontWeight: 500 }}>
                        Engineered for the high-precision environments of MAS Holdings.
                    </Typography>
                </Box>

                <Grid container sx={{ border: '1px solid rgba(255,255,255,0.05)', bgcolor: 'rgba(255,255,255,0.02)' }}>
                    {features.map((feature, index) => (
                        <Grid item xs={12} md={4} key={index}>
                            <Paper 
                                elevation={0}
                                sx={{ 
                                    p: 6, 
                                    height: '100%',
                                    bgcolor: 'transparent', 
                                    borderRadius: 0,
                                    borderRight: { md: index < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none' },
                                    borderBottom: { xs: index < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none', md: 'none' },
                                    position: 'relative',
                                    transition: '0.4s',
                                    '&:hover': {
                                        bgcolor: 'rgba(255,255,255,0.03)',
                                        '& .accent-bar': { height: '100%' }
                                    }
                                }}
                            >
                                <Typography sx={{ fontSize: '2rem', color: '#E50914', opacity: 0.6, fontWeight: 900, mb: 4 }}>
                                    {feature.icon}
                                </Typography>
                                <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 2, textTransform: 'uppercase' }}>
                                    {feature.title}
                                </Typography>
                                <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                                    {feature.description}
                                </Typography>

                                {/* Hover accent bar */}
                                <Box className="accent-bar" sx={{ position: 'absolute', top: 0, left: 0, width: 2, height: 0, bgcolor: '#E50914', transition: '0.4s' }} />
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* Background Text Overlay */}
            <Typography sx={{ 
                position: 'absolute', 
                top: '50%', 
                left: 0, 
                transform: 'translateY(-50%)', 
                color: 'rgba(255,255,255,0.02)', 
                fontSize: '15rem', 
                fontWeight: 900, 
                letterSpacing: '0.1em',
                pointerEvents: 'none',
                zIndex: -1,
                userSelect: 'none'
            }}>
                PROTOCOL
            </Typography>
        </Box>
    );
};

export default AboutAccessSystem;

