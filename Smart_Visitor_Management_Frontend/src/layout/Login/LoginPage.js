import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box, 
  Button, 
  Container, 
  TextField, 
  Typography, 
  IconButton, 
  InputAdornment, 
  Paper, 
  Tab, 
  Tabs,
  CircularProgress,
  Fade,
  Stack
} from '@mui/material';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  Shield, 
  Users as UsersIcon, 
  User as UserIcon, 
  ArrowForward as ArrowForwardIcon 
} from '@mui/icons-material';
import { GetLogin } from '../../actions/LoginAction';

const LoginPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isLoading: reduxLoading, error: reduxError, user } = useSelector(state => state.login);

    const [role, setRole] = useState('visitor');
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [localError, setLocalError] = useState('');

    const roles = [
        { id: 'admin', label: 'Admin', icon: Shield },
        { id: 'contact', label: 'Contact Person', icon: UsersIcon },
        { id: 'security', label: 'Security', icon: Lock },
        { id: 'visitor', label: 'Visitor', icon: UserIcon },
    ];

    useEffect(() => {
        if (user) {
            // Success logic based on user payload
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setLocalError('');
    };

    const handleRoleChange = (event, newRole) => {
        if (newRole) setRole(newRole);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLocalError('');

        // Dispatch Redux Action
        dispatch(GetLogin());

        // Simulate Navigation (Keep original logic but integrate with Redux state)
        setTimeout(() => {
            const { email, password } = formData;
            
            if (role === 'visitor') {
                if (email === 'visitor@company.com' && password === '123456') {
                    navigate('/home');
                } else {
                    setLocalError('Invalid visitor credentials.');
                }
                return;
            }

            if (password === '123456') {
                if (role === 'admin' && email === 'admin@company.com') {
                    navigate('/admin-dashboard');
                } else if (role === 'contact' && email === 'contact@company.com') {
                    navigate('/contact_person/dashboard');
                } else if (role === 'security' && email === 'security@company.com') {
                    navigate('/security-dashboard');
                } else {
                    setLocalError('Invalid credentials for selected role.');
                }
            } else {
                setLocalError('Invalid password. Please try again.');
            }
        }, 1500);
    };

    return (
        <Box 
            sx={{ 
                minHeight: '100vh', 
                bgcolor: '#0E0E10', 
                color: 'white', 
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                fontFamily: 'Inter, sans-serif'
            }}
        >
            {/* Left Box: Branding & Vision */}
            <Box 
                sx={{ 
                    display: { xs: 'none', md: 'flex' },
                    flexDirection: 'column',
                    width: { md: '45%', lg: '40%' },
                    bgcolor: 'black',
                    position: 'relative',
                    overflow: 'hidden',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: { md: 8, lg: 12 },
                    borderRight: '1px solid rgba(255,255,255,0.05)',
                    zIndex: 20
                }}
            >
                <Box 
                    sx={{ 
                        position: 'absolute', 
                        inset: 0, 
                        opacity: 0.03,
                        backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
                        backgroundSize: '40px 40px'
                    }}
                />
                
                <Box 
                    sx={{ 
                        position: 'absolute', 
                        top: '33%', 
                        left: '50%', 
                        transform: 'translate(-50%, -50%)', 
                        width: 400, 
                        height: 400, 
                        bgcolor: 'rgba(229, 9, 20, 0.1)', 
                        borderRadius: '50%', 
                        filter: 'blur(100px)',
                        pointerEvents: 'none'
                    }}
                />

                <Box sx={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
                    <img src="/logo_mas.png" alt="MAS Logo" style={{ height: '7rem', width: 'auto', marginBottom: '2.5rem' }} />
                    <Typography variant="h3" sx={{ fontWeight: 900, color: 'white', textTransform: 'uppercase', mb: 1 }}>
                        MAS <Box component="span" sx={{ color: '#E50914' }}>ACCESS</Box>
                    </Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '1.1rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 300 }}>
                        Change is Courage
                    </Typography>
                    
                    <Box sx={{ mt: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Box sx={{ height: 2, width: 48, background: 'linear-gradient(to right, transparent, #E50914, transparent)', mb: 4 }} />
                        <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', maxWidth: 280, lineHeight: 1.6 }}>
                            Enterprise Visitation & Security Management Core System
                        </Typography>
                    </Box>
                </Box>
            </Box>

            {/* Right Box: Login Form Container */}
            <Box 
                sx={{ 
                    flex: 1, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    p: { xs: 3, md: 6 }, 
                    position: 'relative', 
                    overflow: 'hidden',
                    background: 'radial-gradient(circle at top left, #121214, #0A0A0C)'
                }}
            >
                <Box 
                    sx={{ 
                        position: 'absolute', 
                        bottom: 0, 
                        right: 0, 
                        width: 500, 
                        height: 500, 
                        bgcolor: 'rgba(229, 9, 20, 0.05)', 
                        borderRadius: '50%', 
                        filter: 'blur(120px)',
                        pointerEvents: 'none'
                    }}
                />

                <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 10 }}>
                    <Paper 
                        elevation={24}
                        sx={{ 
                            p: { xs: 4, lg: 7 }, 
                            bgcolor: 'rgba(255, 255, 255, 0.03)', 
                            backdropFilter: 'blur(20px)', 
                            border: '1px solid rgba(255, 255, 255, 0.1)', 
                            borderRadius: 4,
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        {/* Soft Red Top Border Glow */}
                        <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 1, background: 'linear-gradient(to right, transparent, #E50914, transparent)', opacity: 0.8 }} />

                        <Box sx={{ mb: 5, textAlign: 'center' }}>
                            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>Welcome Back</Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)' }}>Please select your role and authenticate</Typography>
                        </Box>

                        <Tabs 
                            value={role} 
                            onChange={handleRoleChange}
                            centered
                            sx={{ 
                                mb: 6,
                                '& .MuiTabs-indicator': { display: 'none' },
                                '& .MuiTab-root': { 
                                    color: 'rgba(255,255,255,0.4)', 
                                    borderRadius: 10,
                                    mx: 0.5,
                                    fontSize: '0.75rem',
                                    transition: '0.3s',
                                    '&.Mui-selected': { 
                                        color: 'white',
                                        bgcolor: '#E50914',
                                        boxShadow: '0 0 15px rgba(229, 9, 20, 0.4)'
                                    }
                                }
                            }}
                        >
                            {roles.map((r) => (
                                <Tab 
                                    key={r.id} 
                                    value={r.id} 
                                    label={r.label} 
                                    icon={<r.icon sx={{ fontSize: '1rem !important' }} />} 
                                    iconPosition="start"
                                />
                            ))}
                        </Tabs>

                        <form onSubmit={handleSubmit}>
                            <Stack spacing={4}>
                                <TextField
                                    fullWidth
                                    label="Email Address"
                                    name="email"
                                    type="email"
                                    required
                                    variant="outlined"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="your@email.com"
                                    autoComplete="email"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Mail sx={{ color: 'rgba(255,255,255,0.3)' }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 3,
                                            bgcolor: 'rgba(0,0,0,0.2)',
                                            '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                                            '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                                            '&.Mui-focused fieldset': { borderColor: '#E50914' },
                                        }
                                    }}
                                />

                                <TextField
                                    fullWidth
                                    label="Password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    variant="outlined"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    autoComplete="current-password"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Lock sx={{ color: 'rgba(255,255,255,0.3)' }} />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton 
                                                    onClick={() => setShowPassword(!showPassword)} 
                                                    edge="end"
                                                    sx={{ color: 'rgba(255,255,255,0.3)' }}
                                                >
                                                    {showPassword ? <EyeOff /> : <Eye />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 3,
                                            bgcolor: 'rgba(0,0,0,0.2)',
                                            '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                                            '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                                            '&.Mui-focused fieldset': { borderColor: '#E50914' },
                                        }
                                    }}
                                />

                                {(localError || reduxError) && (
                                    <Fade in={true}>
                                        <Typography sx={{ color: '#E50914', fontSize: '0.85rem', textAlign: 'center' }}>
                                            {localError || reduxError}
                                        </Typography>
                                    </Fade>
                                )}

                                <Button
                                    fullWidth
                                    type="submit"
                                    variant="contained"
                                    disabled={reduxLoading}
                                    endIcon={!reduxLoading && <ArrowForwardIcon />}
                                    sx={{ 
                                        py: 1.8, 
                                        borderRadius: 3, 
                                        fontWeight: 700, 
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.1em',
                                        bgcolor: '#E50914',
                                        '&:hover': { bgcolor: '#B0060E' }
                                    }}
                                >
                                    {reduxLoading ? <CircularProgress size={24} color="inherit" /> : (role === 'visitor' ? 'Request Access' : 'Login Securely')}
                                </Button>
                            </Stack>
                        </form>
                    </Paper>

                    <Box sx={{ mt: 5, textAlign: 'center' }}>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.2)', display: 'block', lineHeight: 1.8 }}>
                            Secured by MAS Global Security Protocol 2.4<br/>
                            Unauthorized access is strictly prohibited
                        </Typography>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
};

export default LoginPage;

