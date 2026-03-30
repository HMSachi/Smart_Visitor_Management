import React, { useState } from 'react';
import InstructionSection from './InstructionSection';

const InstructionsMain = () => {
    const [agreed, setAgreed] = useState(false);

    const categories = [
        {
            title: "RULES",
            items: [
                "Always display digital or printed pass at security checkpoints.",
                "Professional conduct is required at all manufacturing zones.",
                "Non-disclosure of proprietary manufacturing processes is mandatory.",
                "Adhere to facility-specific visitation hours (08:00 - 17:00)."
            ]
        },
        {
            title: "ALLOWED ITEMS",
            items: [
                "Laptops and necessary professional equipment (Declared).",
                "Personal identification documents.",
                "Official business documentation.",
                "Digital devices with disabled photography in restricted zones."
            ]
        },
        {
            title: "SAFETY",
            items: [
                "Follow all floor marking and illuminated exit signs.",
                "Mandatory PPE must be worn in designated factory zones.",
                "Strict adherence to emergency evacuation protocols.",
                "Report any facility anomalies to MAS Security Nodes immediately."
            ]
        },
        {
            title: "WARNINGS",
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
        <div className="max-w-6xl mx-auto">
            <header className="mb-20 animate-slide-down">
                <span className="uppercase text-mas-red block mb-4">Operational Protocol</span>
                <h1 className="text-white uppercase mb-8">Security Guidelines</h1>
                <div className="w-12 h-1 bg-mas-red"></div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20 animate-fade-in">
                {categories.map((cat, idx) => (
                    <InstructionSection key={idx} title={cat.title} items={cat.items} type={cat.type} />
                ))}
            </div>

            <div className="glass-panel p-12 border-mas-red/10 animate-fade-in stagger-item">
                <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                    <label className="flex items-start space-x-6 cursor-pointer group flex-1">
                        <div className="relative mt-1">
                            <input 
                                type="checkbox" 
                                checked={agreed}
                                onChange={(e) => setAgreed(e.target.checked)}
                                className="peer opacity-0 absolute inset-0 w-8 h-8 cursor-pointer z-10"
                            />
                            <div className="w-8 h-8 border-2 border-white/20 peer-checked:bg-mas-red peer-checked:border-mas-red transition-all flex items-center justify-center">
                                <svg className={`w-4 h-4 text-white transform transition-transform ${agreed ? 'scale-100' : 'scale-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>
                        <span className="text-gray-300 uppercase group-hover:text-white transition-colors">
                            I confirm that I have read and understood the <span className="text-mas-red">MAS Security Protocol</span>. I agree to follow the facility guidelines and acknowledge that any violation may result in clearance revocation.
                        </span>
                    </label>
                    <button 
                        disabled={!agreed}
                        onClick={() => window.location.href='/home'}
                        className="px-20 py-6 bg-mas-red text-white uppercase hover:bg-[#A60D26] disabled:opacity-20 transition-all hover:shadow-[0_0_40px_rgba(200,16,46,0.3)] whitespace-nowrap"
                    >
                        Finalize Clearance
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InstructionsMain;
