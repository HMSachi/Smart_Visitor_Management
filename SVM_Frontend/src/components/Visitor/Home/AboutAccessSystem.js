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
        <section id="about" className="py-12 md:py-24 bg-mas-dark-900 border-t border-white/5">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row items-baseline justify-between mb-12 gap-4">
                    <div className="max-w-xl">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-6 h-[1px] bg-mas-red/50"></div>
                            <span className="text-mas-red uppercase tracking-widest text-[9px] font-bold">Facility Grid</span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-tight leading-none">
                            Digital <span className="text-mas-red">Ecosystem</span>
                        </h2>
                    </div>
                    <p className="max-w-xs text-gray-600 text-[10px] uppercase tracking-widest leading-relaxed font-semibold">
                        Precision Access for MAS Holdings Facilities.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {features.map((feature, index) => (
                        <div 
                            key={index}
                            onClick={() => navigate(feature.path)}
                            className="group relative p-6 bg-white/[0.02] border border-white/5 rounded-xl cursor-pointer hover:border-mas-red/20 transition-all duration-300"
                        >
                            <div className="flex items-start gap-4 h-full">
                                <div className="w-10 h-10 bg-white/[0.03] border border-white/10 rounded-lg flex items-center justify-center text-mas-red group-hover:bg-mas-red group-hover:text-white transition-all">
                                    <feature.icon size={18} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-white text-sm font-bold mb-2 uppercase tracking-tight">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-500 text-[11px] leading-relaxed mb-4 group-hover:text-gray-300">
                                        {feature.description}
                                    </p>
                                    <div className="flex items-center gap-2 text-mas-red text-[10px] font-bold uppercase tracking-widest">
                                        <span>Initialize</span>
                                        <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default AboutAccessSystem;
