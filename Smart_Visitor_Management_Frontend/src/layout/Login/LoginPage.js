import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, Shield, Users, User, ArrowRight } from 'lucide-react';

const LoginPage = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState('visitor');
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const roles = [
        { id: 'admin', label: 'Admin', icon: Shield },
        { id: 'contact', label: 'Contact Person', icon: Users },
        { id: 'security', label: 'Security', icon: Lock },
        { id: 'visitor', label: 'Visitor', icon: User },
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Simulate Login Logic
        setTimeout(() => {
            const { email, password } = formData;
            
            if (role === 'visitor') {
                if (email === 'visitor@company.com' && password === '123456') {
                    navigate('/home');
                } else {
                    setError('Invalid visitor credentials.');
                }
                setIsLoading(false);
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
                    setError('Invalid credentials for selected role.');
                }
            } else {
                setError('Invalid password. Please try again.');
            }
            setIsLoading(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-[#0E0E10] text-white flex flex-col md:flex-row font-sans selection:bg-[#E50914] selection:text-white">
            
            {/* Left Box: Branding & Vision */}
            <div className="hidden md:flex flex-col md:w-[45%] lg:w-[40%] bg-black relative overflow-hidden items-center justify-center p-12 lg:p-20 border-r border-white/5 shadow-[20px_0_50px_rgba(0,0,0,0.5)] z-20">
                {/* Subtle animated grid background */}
                <div className="absolute inset-0 z-0 opacity-[0.03]"
                     style={{
                         backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
                         backgroundSize: '40px 40px'
                     }}>
                </div>
                
                {/* Floating subtle red glow blobs behind logo */}
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#E50914]/10 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="relative z-10 flex flex-col items-center text-center animate-fade-in">
                    <img src="/logo_mas.png" alt="MAS Logo" className="h-28 w-auto mx-auto mb-10 drop-shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-transform duration-700 hover:scale-105" />
                    <h1 className="text-4xl lg:text-5xl font-black text-white uppercase tracking-tight mb-4">MAS <span className="text-[#E50914]">ACCESS</span></h1>
                    <p className="text-gray-400 text-lg lg:text-xl font-light tracking-[0.2em] uppercase">Change is Courage</p>
                    
                    <div className="mt-20 flex flex-col items-center">
                        <div className="h-[2px] w-12 bg-gradient-to-r from-transparent via-[#E50914] to-transparent mb-8"></div>
                        <p className="text-gray-500 text-sm tracking-wider uppercase max-w-xs leading-relaxed">
                            Enterprise Visitation & Security Management Core System
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Box: Login Form Container */}
            <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative overflow-hidden bg-gradient-to-br from-[#121214] to-[#0A0A0C]">
                {/* Subtle background red glow for login side */}
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#E50914]/5 rounded-full blur-[120px] pointer-events-none"></div>

                <div className="w-full max-w-lg relative z-10 animate-slide-up">
                    
                    {/* Glassmorphism Card */}
                    <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-2xl p-10 lg:p-14 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative">
                        
                        {/* Soft Red Top Border Glow */}
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#E50914] to-transparent opacity-80 shadow-[0_0_20px_#E50914]"></div>

                        <div className="mb-10 text-center">
                            <h2 className="text-2xl font-bold text-white mb-2 tracking-wide">Welcome Back</h2>
                            <p className="text-gray-400 text-sm">Please select your role and authenticate</p>
                        </div>

                        {/* Pill-style Role Tabs */}
                        <div className="flex flex-wrap gap-3 mb-12 justify-center">
                            {roles.map((r) => {
                                const isActive = role === r.id;
                                return (
                                    <button
                                        key={r.id}
                                        onClick={() => setRole(r.id)}
                                        className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                                            isActive 
                                            ? 'bg-gradient-to-r from-[#E50914] to-[#B0060E] text-white shadow-[0_0_15px_rgba(229,9,20,0.4)] border border-transparent' 
                                            : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/5'
                                        }`}
                                    >
                                        <r.icon size={16} />
                                        {r.label}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-8">
                            
                            {/* Floating Label Email Input */}
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400 group-focus-within:text-[#E50914] transition-colors">
                                    <Mail size={20} />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    required
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="block w-full px-12 py-4 text-white bg-black/20 border border-white/10 rounded-xl appearance-none focus:outline-none focus:ring-1 focus:ring-[#E50914] focus:border-[#E50914] focus:bg-black/40 transition-all peer placeholder-transparent shadow-inner"
                                    placeholder="Email Address"
                                />
                                <label htmlFor="email" className="absolute left-12 top-4 text-gray-400 text-sm transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:-top-6 peer-focus:text-xs peer-focus:text-[#E50914] peer-valid:-top-6 peer-valid:text-xs peer-valid:text-gray-400 font-medium">
                                    Email Address
                                </label>
                                <p className="absolute -bottom-6 left-1 text-[11px] text-gray-500 uppercase tracking-widest">
                                    Use your corporate ID
                                </p>
                            </div>

                            {/* Floating Label Password Input */}
                            <div className="relative group mt-10">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400 group-focus-within:text-[#E50914] transition-colors">
                                    <Lock size={20} />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    id="password"
                                    required
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="block w-full px-12 py-4 text-white bg-black/20 border border-white/10 rounded-xl appearance-none focus:outline-none focus:ring-1 focus:ring-[#E50914] focus:border-[#E50914] focus:bg-black/40 transition-all peer placeholder-transparent shadow-inner"
                                    placeholder="Password"
                                />
                                <label htmlFor="password" className="absolute left-12 top-4 text-gray-400 text-sm transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:-top-6 peer-focus:text-xs peer-focus:text-[#E50914] peer-valid:-top-6 peer-valid:text-xs peer-valid:text-gray-400 font-medium">
                                    Password
                                </label>
                                <button 
                                    type="button" 
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                                <p className="absolute -bottom-6 left-1 text-[11px] text-gray-500 uppercase tracking-widest">
                                    Minimum 8 characters
                                </p>
                                <p className="absolute -bottom-6 right-0 text-xs text-gray-400 hover:text-[#E50914] cursor-pointer transition-colors font-medium">
                                    Forgot Password?
                                </p>
                            </div>

                            {error && (
                                <div className="text-[#E50914] text-sm text-center pt-2 animate-shake">
                                    {error}
                                </div>
                            )}

                            {/* Primary Button */}
                            <div className="pt-6">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-[#E50914] to-[#B0060E] text-white rounded-xl font-bold tracking-wide uppercase transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_10px_30px_rgba(229,9,20,0.3)] disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-wait"
                                >
                                    {isLoading ? 'Authenticating...' : role === 'visitor' ? 'Request Access' : 'Login Securely'}
                                    {!isLoading && <ArrowRight size={18} className="opacity-80" />}
                                </button>
                            </div>

                        </form>
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-xs text-gray-600">
                            Secured by MAS Global Security Protocol 2.4<br/>
                            Unauthorized access is strictly prohibited
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
