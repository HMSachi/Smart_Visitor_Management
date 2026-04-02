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
        <div className="max-w-5xl mx-auto px-6 pt-2 pb-12 bg-mas-dark-900 min-h-screen">
            {/* Header Section */}
            <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-[1px] bg-mas-red/50" />
                        <span className="text-mas-red font-bold uppercase tracking-widest text-[12px]">Operational Protocol</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white uppercase tracking-tight">
                        Security <span className="text-mas-red">Guidelines</span>
                    </h1>
                    <p className="text-gray-600 text-[13px] font-bold uppercase tracking-widest mt-1">Facility Rules [V.2.0]</p>
                </div>
            </header>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {categories.map((cat, idx) => (
                    <InstructionSection key={idx} title={cat.title} items={cat.items} type={cat.type} icon={cat.icon} delay={idx * 0.1} />
                ))}
            </div>

            {/* Agreement Section */}
            <div 
                className={`p-8 md:p-10 border rounded-xl transition-all duration-300 ${
                    agreed ? 'bg-white/[0.02] border-mas-red/30' : 'bg-white/[0.01] border-white/5'
                }`}
            >
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    <label className="flex items-start space-x-5 cursor-pointer group flex-1">
                        <div className="mt-0.5">
                            <input 
                                type="checkbox" 
                                checked={agreed}
                                onChange={(e) => setAgreed(e.target.checked)}
                                className="peer opacity-0 absolute w-6 h-6 cursor-pointer z-10"
                            />
                            <div className={`w-6 h-6 border rounded transition-all flex items-center justify-center ${
                                agreed ? 'bg-mas-red border-mas-red' : 'border-gray-700'
                            }`}>
                                <CheckSquare size={12} className={`text-white transform transition-transform ${agreed ? 'scale-100' : 'scale-0'}`} />
                            </div>
                        </div>
                        <div>
                            <span className={`text-[13px] font-bold uppercase tracking-widest block mb-1 ${
                                agreed ? 'text-white' : 'text-gray-500'
                            }`}>
                                Acknowledgment of Terms
                            </span>
                            <span className="text-[13px] text-gray-600 font-bold uppercase tracking-widest leading-relaxed block max-w-xl">
                                I confirm that I have read the <span className="text-mas-red">Security Protocol</span>. I agree to follow guidelines.
                            </span>
                        </div>
                    </label>

                    <button 
                        disabled={!agreed}
                        onClick={() => window.location.href='/home'}
                        className={`compact-btn !px-10 !py-4 ${!agreed ? '!bg-white/5 !border-white/5 !text-gray-700 !cursor-not-allowed' : ''}`}
                    >
                        Finalize <ArrowRight size={14} className="ml-2" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InstructionsMain;
