import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Cpu, Network, ArrowRight, CheckCircle2 } from 'lucide-react';

const SafetyFeatures = () => {
    const navigate = useNavigate();
    const categories = [
        {
            name: "Safety Operations",
            icon: Cpu,
            items: ["Dynamic Protocol Briefing", "Compliance Tracking", "Emergency Response"]
        },
        {
            name: "Data Sovereignty",
            icon: Network,
            items: ["AES-256 Encryption", "Unified Privacy Gateway", "Audit Logging"]
        },
        {
            name: "Secure Perimeter",
            icon: ShieldCheck,
            items: ["Advanced ID Verification", "Multi-zone Logic", "Integrated Guest Grid"]
        }
    ];

    return (
        <section id="safety" className="py-20 md:py-32 bg-mas-dark-900 border-t border-white/[0.03] relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-mas-red/[0.03] rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-20 gap-12">
                    <div className="max-w-xl text-left">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-[2px] bg-mas-red" />
                            <span className="text-mas-red uppercase tracking-[0.3em] text-[10px] font-black">Security Infrastructure</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none mb-8">
                            Elite <span className="text-mas-red">Compliance</span>
                        </h2>
                        <p className="text-gray-400 text-lg leading-relaxed font-medium">
                            Our architecture ensures absolute integrity of the MAS corporate perimeter through advanced data encryption and real-time telemetry.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {categories.map((category, index) => (
                        <motion.div 
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="group p-8 md:p-10 bg-white/[0.02] border border-white/5 rounded-[2rem] hover:border-mas-red/20 transition-all duration-500"
                        >
                            <div className="flex items-center justify-between mb-10">
                                <div className="w-12 h-12 bg-mas-red/5 rounded-xl flex items-center justify-center text-mas-red">
                                    <category.icon size={22} />
                                </div>
                                <span className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">Layer 0{index + 1}</span>
                            </div>

                            <h3 className="text-white text-lg font-black mb-8 uppercase tracking-widest group-hover:text-mas-red transition-colors">
                                {category.name}
                            </h3>
                            
                            <ul className="space-y-5">
                                {category.items.map((item, idx) => (
                                    <li key={idx} className="flex items-center gap-3">
                                        <CheckCircle2 size={14} className="text-mas-red opacity-40" />
                                        <span className="text-gray-500 text-xs font-bold uppercase tracking-wider group-hover:text-gray-300 transition-colors">
                                            {item}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>
                
                {/* Visual Banner */}
                <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-24 md:mt-32 p-8 md:p-16 rounded-[2.5rem] bg-gradient-to-br from-mas-red to-mas-dark-800 border border-white/10 relative overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 blur-[80px] rounded-full group-hover:bg-white/20 transition-all duration-700" />
                    
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                        <div className="max-w-2xl text-center md:text-left">
                            <h3 className="text-3xl md:text-4xl font-black text-white mb-6 uppercase tracking-tighter leading-none">
                                Registration Protocol Required?
                            </h3>
                            <p className="text-white/70 uppercase text-[10px] font-black tracking-[0.2em] leading-relaxed max-w-lg">
                                Initiate your secure entry request for MAS Holdings facilities. Our automated protocol ensures rapid authorization across all zones.
                            </p>
                        </div>

                        <button 
                            onClick={() => navigate('/request-step-1')}
                            className="px-10 py-5 bg-white text-mas-red font-black uppercase text-xs tracking-[0.3em] rounded-2xl hover:bg-mas-dark-900 hover:text-white shadow-2xl transition-all flex items-center gap-4 active:scale-95"
                        >
                            Request Visit
                            <ArrowRight size={18} />
                        </button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default SafetyFeatures;
