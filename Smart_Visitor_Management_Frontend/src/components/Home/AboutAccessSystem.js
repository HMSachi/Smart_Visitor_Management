import React from 'react';

const AboutAccessSystem = () => {
    const features = [
        {
            title: "DIGITAL PROTOCOL",
            description: "Encrypted registration for global visitors via our unified intelligence node.",
            icon: "01"
        },
        {
            title: "INSTANT TELEMETRY",
            description: "Real-time host notification and visitor tracking across the entire facility grid.",
            icon: "02"
        },
        {
            title: "SECURE CLEARANCE",
            description: "Automated identity verification integrated with MAS biometric security layers.",
            icon: "03"
        }
    ];

    return (
        <section id="about" className="py-32 bg-charcoal-900 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-24">
                    <div className="max-w-2xl">
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="w-8 h-[1px] bg-mas-red"></div>
                            <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-mas-red">Architecture</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-display font-black tracking-tight text-white uppercase">
                            SYSTEM <span className="text-mas-red">INTELLIGENCE</span>
                        </h2>
                    </div>
                    <p className="mt-8 md:mt-0 text-gray-300 uppercase tracking-widest text-[11px] font-bold max-w-xs leading-loose">
                        Engineered for the high-precision environments of MAS Holdings.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-1 md:grid-cols-3 bg-white/5 border border-white/5">
                    {features.map((feature, index) => (
                        <div key={index} className="group relative p-12 bg-charcoal-900 hover:bg-charcoal-800 transition-colors duration-500 border border-transparent hover:border-mas-red/20 shadow-none">
                            <div className="text-mas-red font-display text-4xl font-black opacity-20 mb-8 group-hover:opacity-100 transition-opacity">
                                {feature.icon}
                            </div>
                            <h3 className="text-lg font-bold text-white mb-4 tracking-widest uppercase">{feature.title}</h3>
                            <p className="text-gray-300 text-sm leading-relaxed font-light">{feature.description}</p>
                            
                            {/* Hover accent */}
                            <div className="absolute top-0 left-0 w-[2px] h-0 bg-mas-red group-hover:h-full transition-all duration-500"></div>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Background Text */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 text-[20vw] font-black text-white/[0.02] -z-10 select-none pointer-events-none">
                PROTOCOL
            </div>
        </section>
    );
};

export default AboutAccessSystem;
