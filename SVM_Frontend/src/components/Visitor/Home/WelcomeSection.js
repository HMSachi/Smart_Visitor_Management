import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const WelcomeSection = () => {
    const navigate = useNavigate();

    return (
        <section className="relative min-h-[90vh] flex items-center overflow-hidden">
            {/* Background Image */}
            <div 
                className="absolute inset-0 bg-cover bg-center z-0 transform scale-105" 
                style={{ backgroundImage: "url('/main.jpeg')" }}
            >
                <div className="absolute inset-0 bg-black/60 bg-gradient-to-r from-black/90 via-black/60 to-transparent"></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
                <div className="max-w-3xl">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-4 mb-8"
                    >
                        <div className="w-12 h-[2px] bg-mas-red"></div>
                        <span className="text-mas-red uppercase text-[10px] font-medium tracking-[0.4em]">Facility Intelligence</span>
                    </motion.div>

                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-[clamp(60px,10vw,120px)] font-medium text-white leading-[0.9] tracking-tighter mb-8 uppercase"
                    >
                        Visitor<br />
                        <span className="text-mas-red">Access</span> Portal
                    </motion.h1>

                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="border-t border-white/20 pt-8 max-w-xl mb-12"
                    >
                        <p className="text-gray-300 text-lg sm:text-xl font-medium leading-relaxed mb-6">
                            Secure, streamlined, and enterprise-grade access management for <span className="text-white">MAS Holdings</span> world-class manufacturing facilities.
                        </p>
                        <p className="text-gray-400 text-base font-medium leading-relaxed">
                            Experience the next generation of facility access. A seamless, high-security digital gateway designed for the modern enterprise.
                        </p>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col sm:flex-row gap-6"
                    >
                        <button 
                            onClick={() => navigate('/request-step-1')}
                            className="px-10 py-5 bg-mas-red text-white font-medium uppercase text-xs tracking-[0.2em] hover:bg-[#A00D25] transition-colors shadow-2xl"
                        >
                            Request a Visit
                        </button>

                        <button 
                            onClick={() => navigate('/status')}
                            className="px-10 py-5 bg-black text-white font-medium uppercase text-xs tracking-[0.2em] border border-white/10 hover:bg-white/5 transition-all shadow-xl"
                        >
                            About Access
                        </button>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default WelcomeSection;
