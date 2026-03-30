import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, ArrowRight, Activity, Zap } from 'lucide-react';

const WelcomeSection = () => {
    const navigate = useNavigate();

    return (
        <section className="relative min-h-[90vh] flex items-center pt-10 overflow-hidden bg-mas-dark-900 border-b border-white/[0.03]">
            {/* Background elements */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-mas-red/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-mas-red/5 blur-[100px] rounded-full" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] grayscale" />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="text-left">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-mas-red/[0.07] border border-mas-red/20 mb-8"
                    >
                        <Zap size={14} className="text-mas-red animate-pulse" />
                        <span className="text-[10px] font-black tracking-[0.2em] text-mas-red uppercase italic">Next-Gen Facility Access</span>
                    </motion.div>

                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[clamp(40px,8vw,80px)] font-black text-white leading-[0.95] tracking-tighter mb-8 uppercase"
                    >
                        Secure <span className="text-transparent bg-clip-text bg-gradient-to-r from-mas-red to-[#FF4D6D]">Digital</span> <br /> 
                        Gateway System
                    </motion.h1>

                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-400 text-lg md:text-xl font-medium leading-relaxed max-w-xl mb-12"
                    >
                        Experience frictionless, high-security access management for <span className="text-white">MAS Holdings</span> global manufacturing hubs. Clean, secure, and fully automated.
                    </motion.p>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex flex-col sm:flex-row gap-4"
                    >
                        <button 
                            onClick={() => navigate('/request-step-1')}
                            className="group relative px-10 py-5 bg-mas-red text-white font-black uppercase text-xs tracking-widest rounded-2xl shadow-[0_20px_40px_rgba(200,16,46,0.2)] hover:shadow-[0_20px_50px_rgba(200,16,46,0.4)] hover:-translate-y-1 transition-all flex items-center justify-center gap-3 overflow-hidden"
                        >
                            <span className="relative z-10">Start Registration</span>
                            <ArrowRight size={18} className="relative z-10 group-hover:translate-x-2 transition-transform" />
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                        </button>

                        <button 
                            onClick={() => navigate('/status')}
                            className="px-10 py-5 bg-white/[0.03] border border-white/10 text-white font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-white/[0.07] transition-all flex items-center justify-center gap-3 backdrop-blur-md"
                        >
                            Track Status
                        </button>
                    </motion.div>

                    <div className="mt-16 flex items-center gap-8 grayscale opacity-40">
                        {/* Placeholder for trusted partner logos or tech badges */}
                        <div className="flex items-center gap-2">
                            <Shield size={20} className="text-white" />
                            <span className="text-[10px] font-bold text-white tracking-[0.2em] uppercase">AES-256 SECURED</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Activity size={20} className="text-white" />
                            <span className="text-[10px] font-bold text-white tracking-[0.2em] uppercase">24/7 MONITORING</span>
                        </div>
                    </div>
                </div>

                {/* Right Visual Element */}
                <motion.div 
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="relative hidden lg:block"
                >
                    <div className="relative z-10 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
                        <img 
                            src="/main.jpeg" 
                            alt="MAS Facility" 
                            className="w-full aspect-[4/5] object-cover filter brightness-75 scale-110 hover:scale-100 transition-transform duration-1000"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-mas-dark-900 via-transparent to-transparent" />
                    </div>
                    
                    {/* Floating Tech Card */}
                    <motion.div 
                        animate={{ y: [0, -20, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute -bottom-10 -left-10 p-6 bg-mas-dark-800/80 backdrop-blur-2xl border border-white/10 rounded-3xl z-20 shadow-2xl max-w-[240px]"
                    >
                        <div className="w-12 h-12 bg-mas-red/10 rounded-2xl flex items-center justify-center mb-4 border border-mas-red/20 text-mas-red">
                            <Shield size={24} />
                        </div>
                        <h4 className="text-white font-bold text-sm mb-2 uppercase italic tracking-widest">Global Safety</h4>
                        <p className="text-gray-500 text-[10px] leading-relaxed uppercase font-medium">Standardized security protocols across all global manufacturing facilities.</p>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default WelcomeSection;
