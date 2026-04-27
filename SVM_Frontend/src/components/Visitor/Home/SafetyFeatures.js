import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ShieldCheck, Cpu, Network, CheckCircle2 } from 'lucide-react';

const SafetyFeatures = () => {
    const navigate = useNavigate();
    const { visitRequestsByVis } = useSelector((state) => state.visitRequestsState);
    const hasExistingVisitRequest = Array.isArray(visitRequestsByVis)
        ? visitRequestsByVis.length > 0
        : false;
    const categories = [
        {
            name: "Compliance",
            icon: Cpu,
            items: ["Dynamic Briefing", "Tracking", "Protocol Response"]
        },
        {
            name: "Data Security",
            icon: Network,
            items: ["AES-256 Auth", "Privacy Gateway", "Audit Logs"]
        },
        {
            name: "Perimeter",
            icon: ShieldCheck,
            items: ["ID Verification", "Multi-zone Control", "Guest Grid"]
        }
    ];

    return (
        <section id="safety" className="py-12 md:py-24 bg-background border-t border-white/5">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row items-baseline justify-between mb-12 gap-12">
                    <div className="max-w-xl text-left">
                        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-2 mb-3">
                            <div className="w-6 h-[1px] bg-primary/50"></div>
                            <span className="text-primary uppercase tracking-widest text-[12px] font-bold">Infrastructure</span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-tight mb-4">
                            Elite <span className="text-primary">Compliance</span>
                        </h2>
                        <p className="text-gray-500 text-sm leading-relaxed font-medium">
                            Advanced encryption and real-time telemetry protocols.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {categories.map((category, index) => (
                        <div 
                            key={index}
                            className="p-6 bg-white/[0.02] border border-white/5 rounded-xl hover:border-primary/20 transition-all duration-300"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="w-9 h-9 bg-primary/5 rounded-lg flex items-center justify-center text-primary">
                                    <category.icon size={16} />
                                </div>
                                <span className="text-[12px] font-bold text-gray-700 uppercase tracking-widest">LAYER 0{index + 1}</span>
                            </div>

                            <h3 className="text-white text-base font-bold mb-6 uppercase tracking-wider">
                                {category.name}
                            </h3>
                            
                            <ul className="space-y-3">
                                {category.items.map((item, idx) => (
                                    <li key={idx} className="flex flex-col md:flex-row items-center gap-4 md:gap-2">
                                        <CheckCircle2 size={12} className="text-primary/60" />
                                        <span className="text-gray-500 text-[14px] font-semibold uppercase tracking-wider group-hover:text-gray-300 transition-colors">
                                            {item}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                
                {/* Minimal CTA Banner */}
                <div className="mt-16 p-8 md:p-10 rounded-xl bg-gradient-to-br from-primary/20 to-mas-dark-800 border border-primary/10 group">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="text-center md:text-left">
                            <h3 className="text-xl md:text-2xl font-bold text-white mb-3 uppercase tracking-tight">
                                Access Protocol Initialized?
                            </h3>
                            <p className="text-gray-400 uppercase text-[13px] font-bold tracking-widest leading-relaxed max-w-lg">
                                Automated high-security authorization for all MAS facilities.
                            </p>
                        </div>

                        <button 
                            onClick={() =>
                                navigate(
                                    hasExistingVisitRequest
                                        ? '/visitor/my-requests'
                                        : '/request-step-1'
                                )
                            }
                            className="compact-btn !px-10"
                        >
                            {hasExistingVisitRequest ? 'My Requests' : 'Request Visit'}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SafetyFeatures;
