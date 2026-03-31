import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, CheckSquare, ArrowRight, ShieldCheck, FileText } from 'lucide-react';
import InstructionSection from './InstructionSection';

const InstructionsMain = () => {
    const [agreed, setAgreed] = useState(false);

    const categories = [
        {
            title: "RULES",
            icon: FileText,
            items: [
                "Always display digital or printed pass at security checkpoints.",
                "Professional conduct is required at all manufacturing zones.",
                "Non-disclosure of proprietary manufacturing processes is mandatory.",
                "Adhere to facility-specific visitation hours (08:00 - 17:00)."
            ]
        },
        {
            title: "ALLOWED ITEMS",
            icon: ShieldCheck,
            items: [
                "Laptops and necessary professional equipment (Declared).",
                "Personal identification documents.",
                "Official business documentation.",
                "Digital devices with disabled photography in restricted zones."
            ]
        },
        {
            title: "SAFETY",
            icon: ShieldAlert,
            items: [
                "Follow all floor marking and illuminated exit signs.",
                "Mandatory PPE must be worn in designated factory zones.",
                "Strict adherence to emergency evacuation protocols.",
                "Report any facility anomalies to MAS Security Nodes immediately."
            ]
        },
        {
            title: "WARNINGS",
            icon: ShieldAlert,
            items: [
                "Unauthorized photography or videography is strictly prohibited.",
                "No entry into Red Zones without high-level security clearance.",
                "Carrying prohibited materials will result in immediate detention.",
                "Strict zero-tolerance policy for facility safety violations."
            ],
            type: "warning"
        }
    ];

    return (
        <div className="max-w-6xl mx-auto px-6 py-12 bg-mas-dark-900 min-h-screen">
            {/* Header Section */}
            <motion.header 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6"
            >
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-[2.5px] bg-mas-red" />
                        <span className="text-mas-red font-medium uppercase tracking-[0.4em] text-[10px]">Operational Protocol</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-white uppercase tracking-tighter leading-none italic">
                        Security <span className="text-mas-red">Guidelines</span>
                    </h1>
                    <p className="text-gray-500 text-[10px] uppercase font-medium tracking-[0.2em] mt-2">Facility Rules & Regulations [V.2.0]</p>
                </div>
            </motion.header>

            {/* Content Grid */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20"
            >
                {categories.map((cat, idx) => (
                    <InstructionSection key={idx} title={cat.title} items={cat.items} type={cat.type} icon={cat.icon} delay={idx * 0.1} />
                ))}
            </motion.div>

            {/* Agreement Section */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className={`relative p-10 md:p-14 border rounded-[2.5rem] overflow-hidden transition-all duration-500 shadow-2xl ${
                    agreed ? 'bg-white/[0.04] border-mas-red/40 shadow-[0_20px_60px_rgba(200,16,46,0.15)]' : 'bg-white/[0.02] border-white/5'
                }`}
            >
                {/* Glow Effect */}
                <div className={`absolute -right-32 -bottom-32 w-80 h-80 rounded-full blur-[100px] transition-colors duration-1000 ${
                    agreed ? 'bg-mas-red/20' : 'bg-white/5'
                }`} />

                <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
                    <label className="flex items-start space-x-6 cursor-pointer group flex-1">
                        <div className="relative mt-1">
                            <input 
                                type="checkbox" 
                                checked={agreed}
                                onChange={(e) => setAgreed(e.target.checked)}
                                className="peer opacity-0 absolute inset-0 w-8 h-8 cursor-pointer z-10"
                            />
                            <div className={`w-8 h-8 border-2 rounded-lg transition-all flex items-center justify-center ${
                                agreed ? 'bg-mas-red border-mas-red' : 'border-gray-600 peer-hover:border-mas-red/50 peer-focus:border-mas-red'
                            }`}>
                                <CheckSquare size={16} className={`text-white transform transition-transform ${agreed ? 'scale-100' : 'scale-0'}`} />
                            </div>
                        </div>
                        <div>
                            <span className={`text-[11px] font-medium uppercase tracking-widest transition-colors mb-2 block ${
                                agreed ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'
                            }`}>
                                Acknowledgment of Terms
                            </span>
                            <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider leading-relaxed block max-w-2xl">
                                I confirm that I have read and understood the <span className="text-mas-red italic">MAS Security Protocol</span>. I agree to follow the facility guidelines and acknowledge that any violation may result in immediate clearance revocation.
                            </span>
                        </div>
                    </label>

                    <button 
                        disabled={!agreed}
                        onClick={() => window.location.href='/home'}
                        className={`flex items-center justify-center gap-4 px-12 py-6 rounded-2xl text-[10px] font-medium uppercase tracking-widest whitespace-nowrap transition-all duration-300 ${
                            agreed 
                            ? 'bg-mas-red text-white hover:bg-[#A60D26] hover:shadow-[0_15px_30px_rgba(200,16,46,0.4)] transform hover:scale-105 active:scale-95' 
                            : 'bg-white/[0.03] border border-white/10 text-gray-600 cursor-not-allowed'
                        }`}
                    >
                        Finalize Clearance <ArrowRight size={16} />
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default InstructionsMain;
