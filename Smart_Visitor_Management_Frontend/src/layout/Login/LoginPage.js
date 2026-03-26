import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, AlertCircle, User, Users, Shield } from 'lucide-react';

const LoginPage = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState('visitor');
    const [formData, setFormData] = useState({ email: '', password: '', rememberMe: false });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const roles = [
        { id: 'admin', label: 'Admin', desc: 'Full system control & approvals', icon: Shield, accent: 'mas-red' },
        { id: 'contact', label: 'Contact Person', desc: 'Manage visitor requests & coordination', icon: Users, accent: 'white' },
        { id: 'security', label: 'Security', desc: 'Entry validation & monitoring', icon: Lock, accent: 'white' },
        { id: 'visitor', label: 'Visitor', desc: 'Fill the visit request', icon: User, accent: 'mas-red' },
    ];

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
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

    const currentRole = roles.find(r => r.id === role);

    return (
        <div className="min-h-screen bg-mas-black flex flex-col md:flex-row">
            {/* Left: Brand Panel */}
            <div className="hidden md:flex md:w-1/2 bg-mas-dark relative overflow-hidden items-center justify-center p-20 border-r border-mas-border">
                <div className="absolute inset-0 z-0 opacity-10">
                    <div className="grid grid-cols-12 h-full w-full gap-1">
                        {[...Array(144)].map((_, i) => (
                            <div key={i} className="border border-white/10 aspect-square"></div>
                        ))}
                    </div>
                </div>
                
                <div className="relative z-10 text-center">
                    <img src="/logo_mas.png" alt="MAS Logo" className="h-24 w-auto mx-auto mb-12 filter brightness-100" />
                    <h1 className="text-white uppercase mb-4">MAS ACCESS</h1>
                    <p className="text-mas-text-dim uppercase">Change is Courage</p>
                    
                    <div className="mt-24 max-w-sm mx-auto">
                        <div className="h-[1px] w-12 bg-mas-red mx-auto mb-8"></div>
                        <p className="text-gray-400 uppercase">
                            Enterprise Visitation & Security Management Core
                        </p>
                    </div>
                </div>

                <div className="absolute bottom-12 left-12 flex items-center gap-4 text-mas-text-dim">
                    <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_10px_#22c55e]"></div>
                    <span className="uppercase">System Node: Operational</span>
                </div>
            </div>

            {/* Right: Login Form Panel */}
            <div className="flex-1 flex items-center justify-center p-8 md:p-24 relative overflow-hidden">
                {/* Background Pattern for Mobile */}
                <div className="md:hidden absolute inset-0 z-0 opacity-5">
                     <div className="grid grid-cols-6 h-full w-full gap-1">
                        {[...Array(36)].map((_, i) => (
                            <div key={i} className="border border-white/20 aspect-square"></div>
                        ))}
                    </div>
                </div>

                <div className="w-full max-w-md relative z-10">
                    <div className="mas-glass p-12 border-mas-border relative">
                        {/* Focus Glow Accent */}
                        <div className={`absolute top-0 left-0 w-full h-[2px] ${role === 'visitor' ? 'bg-mas-red shadow-[0_0_15px_#C8102E]' : 'bg-mas-border'} transition-all duration-500`}></div>
                        
                        <div className="mb-12">
                            <h2 className="text-white uppercase mb-2">Login Portal</h2>
                            <p className="text-mas-text-dim uppercase">Secure Access Entry</p>
                        </div>

                        {/* Role Selector */}
                        <div className="mb-12">
                            <div className="grid grid-cols-2 gap-2 mb-6">
                                {roles.map((r) => (
                                    <button
                                        key={r.id}
                                        onClick={() => setRole(r.id)}
                                        className={`flex items-center justify-center gap-3 py-4 border transition-all duration-300 ${ role === r.id ? 'bg-mas-red text-white border-mas-red shadow-[0_0_20px_rgba(200,16,46,0.3)]' : 'bg-white/[0.02] text-mas-text-dim border-mas-border hover:border-white/20' }`}
                                    >
                                        <r.icon size={16} strokeWidth={role === r.id ? 2.5 : 2} />
                                        <span className="uppercase">{r.label}</span>
                                    </button>
                                ))}
                            </div>
                            <div className="min-h-[20px] text-center">
                                <p className="text-mas-red uppercase animate-fade-in transition-all">
                                    {currentRole.desc}
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                                    <div className="space-y-2 group">
                                        <label className="uppercase text-mas-text-dim group-focus-within:text-mas-red transition-colors">Email Address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="USER@COMPANY.COM"
                                            className="mas-input w-full focus:shadow-[0_0_15px_rgba(200,16,46,0.1)]"
                                        />
                                    </div>

                                    <div className="space-y-2 group">
                                        <label className="uppercase text-mas-text-dim group-focus-within:text-mas-red transition-colors">Credential Password</label>
                                        <input
                                            type="password"
                                            name="password"
                                            required
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            placeholder="••••••••"
                                            className="mas-input w-full focus:shadow-[0_0_15px_rgba(200,16,46,0.1)]"
                                        />
                                    </div>

                            {error && (
                                <div className="text-mas-red uppercase animate-pulse">
                                    {error}
                                </div>
                            )}

                            <div className="flex items-center justify-between py-2">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        name="rememberMe"
                                        checked={formData.rememberMe}
                                        onChange={handleInputChange}
                                        className="w-4 h-4 accent-mas-red border-mas-border bg-mas-black"
                                    />
                                    <span className="text-mas-text-dim uppercase group-hover:text-white transition-colors">Remember Node</span>
                                </label>
                                {role !== 'visitor' && (
                                    <button type="button" className="text-mas-red uppercase hover:text-white transition-colors">Reset Ops</button>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-mas-red text-white py-6 uppercase relative group overflow-hidden hover:shadow-[0_0_40px_rgba(200,16,46,0.4)] transition-all duration-500 transform hover:scale-[1.02] active:scale-100 disabled:opacity-50"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-3">
                                    {isLoading ? 'SYNCHRONIZING...' : role === 'visitor' ? 'Access Portal' : 'Initialize Session'}
                                    {!isLoading && <ArrowRight size={16} />}
                                </span>
                                <div className="absolute inset-0 bg-white/10 translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
                            </button>
                        </form>
                    </div>

                    <div className="mt-12 text-center">
                        <p className="text-mas-text-dim uppercase">
                            Security Protocol 2.4.1 Active <br />
                            © 2026 MAS HOLDINGS. WORLD-WIDE OPS.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
