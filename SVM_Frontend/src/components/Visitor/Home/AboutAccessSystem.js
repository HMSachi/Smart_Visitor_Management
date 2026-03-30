import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, ClipboardList, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AboutAccessSystem = () => {
    const navigate = useNavigate();
    const features = [
        {
            title: "Visitor Registration",
            description: "Secure, digital self-registration for all global visitors and contractors.",
            icon: UserPlus,
            path: "/request-step-1",
            accent: "from-[#C8102E] to-[#8B0A1E]"
        },
        {
            title: "Access Control",
            description: "High-security facility clearance protocols powered by MAS intelligence.",
            icon: ShieldCheck,
            path: "/access",
            accent: "from-[#1A1A1C] to-[#0A0A0B]"
        },
        {
            title: "Real-time Status",
            description: "Instantly track your approval status and visitor history in real-time.",
            icon: ClipboardList,
            path: "/status",
            accent: "from-[#1A1A1C] to-[#0A0A0B]"
        }
    ];

    return (
        <section id="about" className="py-20 md:py-32 bg-mas-dark-900 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-mas-red/[0.02] blur-[150px] rounded-full" />
            
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-8">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-[2px] bg-mas-red" />
                            <span className="text-mas-red uppercase tracking-[0.3em] text-[10px] font-black">Service Grid</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none">
                            Our Digital <span className="text-mas-red">Ecosystem</span>
                        </h2>
                    </div>
                    <p className="max-w-xs text-gray-500 text-xs uppercase tracking-[0.2em] leading-relaxed font-bold">
                        Engineered for the high-precision environments of MAS Holdings.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <motion.div 
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => navigate(feature.path)}
                            className={`group relative p-8 md:p-10 bg-white/[0.03] border border-white/10 rounded-[2rem] cursor-pointer hover:border-mas-red/30 transition-all duration-500 overflow-hidden`}
                        >
                            {/* Gradient Background on Hover */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${feature.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
                            
                            <div className="relative z-10">
                                <div className="w-14 h-14 bg-white/[0.05] rounded-2xl flex items-center justify-center mb-10 group-hover:bg-white/10 group-hover:scale-110 transition-all duration-500 text-mas-red group-hover:text-white">
                                    <feature.icon size={28} />
                                </div>
                                
                                <h3 className="text-white text-xl md:text-2xl font-black mb-4 uppercase tracking-tight">
                                    {feature.title}
                                </h3>
                                
                                <p className="text-gray-500 text-sm leading-relaxed tracking-wide group-hover:text-white/80 transition-all duration-500 mb-8 max-w-[240px]">
                                    {feature.description}
                                </p>

                                <div className="flex items-center gap-2 text-mas-red group-hover:text-white transition-colors">
                                    <span className="text-[10px] font-black uppercase tracking-widest">Learn More</span>
                                    <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </div>
                            </div>

                            {/* Decorative Edge Glow */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-mas-red/10 blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default AboutAccessSystem;
