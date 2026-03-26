import React from 'react';
import { Link } from 'react-router-dom';

const SafetyFeatures = () => {
    const categories = [
        {
            name: "SAFETY OPERATIONS",
            items: ["Dynamic Protocol Briefing", "Real-time Compliance Tracking", "Emergency Response Node"]
        },
        {
            name: "DATA SOVEREIGNTY",
            items: ["Deep Encryption Infrastructure", "Unified Privacy Gateway", "Regulatory Audit Logging"]
        },
        {
            name: "SECURE PERIMETER",
            items: ["Advanced ID Verification", "Multi-zone Access Logic", "Integrated Guest Grid"]
        }
    ];

    return (
        <section id="safety" className="py-32 bg-charcoal-900 border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-24 gap-12">
                    <div className="max-w-xl">
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="w-8 h-[1px] bg-mas-red"></div>
                            <span className="uppercase text-mas-red">Security First</span>
                        </div>
                        <h2 className="md: text-white uppercase mb-6">
                            ELITE <span className="text-mas-red">PROTECTION</span>
                        </h2>
                        <p className="text-gray-200">
                            A commitment to the highest security standards, ensuring absolute integrity of the MAS corporate perimeter.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    {categories.map((category, index) => (
                        <div key={index} className="glass-panel p-12 border-mas-red/10 hover:border-mas-red/40 transition-all duration-500 overflow-hidden relative group">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-mas-red/5 -mr-12 -mt-12 group-hover:bg-mas-red/10 transition-colors"></div>
                            <span className="text-mas-red uppercase mb-8 inline-block">{category.name}</span>
                            <ul className="space-y-6">
                                {category.items.map((item, idx) => (
                                    <li key={idx} className="flex items-start text-white">
                                        <div className="w-1.5 h-1.5 bg-mas-red mt-1.5 mr-4 flex-shrink-0"></div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                
                {/* CTA Banner */}
                <div className="mt-24 p-1 bg-gradient-to-r from-mas-red/40 via-mas-red/10 to-transparent">
                    <div className="bg-charcoal-900 p-12 md:p-16 flex flex-col md:flex-row items-center justify-between text-white relative">
                        <div className="relative z-10 text-center md:text-left mb-12 md:mb-0 max-w-lg">
                            <h3 className="uppercase mb-4">Access Clearance Required?</h3>
                            <p className="text-gray-200">Initiate your digital clearance request for secure entry to MAS Holdings facilities.</p>
                        </div>
                        <Link to="/request-step-1" className="relative z-10 px-16 py-6 bg-mas-red text-white uppercase hover:bg-[#A60D26] shadow-[0_0_30px_rgba(200,16,46,0.2)] transition-all transform active:scale-95 text-center">
                            Request Visit
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SafetyFeatures;
