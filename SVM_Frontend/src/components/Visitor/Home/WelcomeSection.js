import React from 'react';
import { useNavigate } from 'react-router-dom';

const WelcomeSection = () => {
    const navigate = useNavigate();

    return (
        <section className="relative min-h-[90vh] flex items-start overflow-hidden pt-20 md:pt-32">
            {/* Background Layer with Overlay */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: `url('/main.jpeg')`,
                    backgroundSize: 'cover',
                    backgroundPosition: '50% 30%',
                    backgroundRepeat: 'no-repeat'
                }}
            >
                <div className="absolute inset-0 bg-black/65"></div>
                <div className="absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-black via-black/40 to-transparent"></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
                <div className="w-full">
                    <div className="mb-8">
                        <span className="text-mas-red font-black uppercase tracking-[0.4em] text-[12px]">Facility Intelligence</span>
                    </div>

                    <div className="mb-10">
                        <h1 className="text-4xl md:text-6xl lg:text-[4vw] font-black text-white leading-tight tracking-[-0.03em] uppercase m-0 p-0 drop-shadow-2xl">
                            Visitor
                        </h1>
                        <h1 className="text-3xl md:text-5xl lg:text-[3vw] font-black leading-tight tracking-[-0.03em] uppercase m-0 p-0 drop-shadow-2xl">
                            <span className="text-mas-red mr-3">Access</span>
                            <span className="text-white">Portal</span>
                        </h1>
                    </div>

                    <div className="space-y-10 mb-14">
                        <div className="relative">
                            <div className="mt-1">
                                <p className="text-white text-sm md:text-lg font-medium max-w-3xl leading-relaxed drop-shadow-md">
                                    Secure, streamlined, and enterprise-grade access management <br className="hidden md:block" />
                                    for <span className="text-mas-red font-black underline underline-offset-4 decoration-2">MAS Holdings</span> world-class manufacturing facilities.
                                </p>
                            </div>
                        </div>

                        <p className="text-white/90 text-sm md:text-lg font-medium max-w-2xl leading-relaxed drop-shadow-md">
                            Experience the next generation of facility access. A seamless, high-security digital gateway designed for the modern enterprise.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-6  ">
                        <button
                            onClick={() => navigate('/request-step-1')}
                            className="w-full sm:w-auto px-8 py-3 bg-mas-red text-white font-black uppercase text-[10px] tracking-[0.2em] border border-mas-red hover:bg-[#A60D26] transition-all rounded-xl shadow-lg shadow-mas-red/20"
                        >
                            Request a Visit
                        </button>

                        <button
                            onClick={() => navigate('/access')}
                            className="w-full sm:w-auto px-8 py-3 bg-transparent text-white font-black uppercase text-[10px] tracking-[0.2em] border border-white/20 hover:bg-white/5 transition-all text-center rounded-xl"
                        >
                            About Access
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WelcomeSection;
