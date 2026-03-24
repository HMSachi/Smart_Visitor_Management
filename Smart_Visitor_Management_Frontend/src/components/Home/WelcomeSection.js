import React from 'react';
import { Link } from 'react-router-dom';

const WelcomeSection = () => {
    return (
        <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-charcoal-900 text-white">
            {/* Background Architecture */}
            <div className="absolute top-0 right-0 w-3/4 h-full z-0">
                <div className="absolute inset-0 bg-gradient-to-r from-charcoal-900 via-charcoal-900/60 to-transparent z-10"></div>
                {/* Abstract line patterns */}
                <svg className="absolute right-0 top-0 h-full w-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M0 100 L100 0 M20 100 L100 20 M40 100 L100 40 M60 100 L100 60" stroke="#C8102E" strokeWidth="0.1" fill="none" />
                </svg>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full">
                <div className="max-w-4xl">
                    <div className="flex items-center space-x-4 mb-8">
                        <div className="w-12 h-[2px] bg-mas-red"></div>
                        <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-mas-red">Facility Intelligence</span>
                    </div>
                    
                    <h1 className="text-6xl md:text-8xl font-display font-black tracking-tighter leading-none mb-8">
                        VISITOR <br />
                        <span className="text-mas-red relative">
                           ACCESS
                           <span className="absolute -bottom-2 left-0 w-1/2 h-2 bg-white/10"></span>
                        </span> PORTAL
                    </h1>
                    
                    <p className="max-w-xl text-lg text-gray-300 font-light leading-relaxed mb-12 border-l border-white/10 pl-8">
                        Secure, streamlined, and enterprise-grade access management for MAS Holdings world-class manufacturing facilities.
                    </p>

                        <p className="mt-8 text-lg md:text-xl text-gray-200 font-light max-w-2xl leading-relaxed animate-fade-in stagger-item">
                            Experience the next generation of facility access. A seamless, high-security digital gateway designed for the modern enterprise.
                        </p>
                        
                        <div className="mt-12 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-8 animate-fade-in stagger-item">
                            <Link to="/request-step-1" className="w-full sm:w-auto px-12 py-5 bg-mas-red text-white text-[12px] font-black uppercase tracking-[0.3em] hover:bg-[#A60D26] shadow-[0_0_30px_rgba(200,16,46,0.2)] transition-all transform active:scale-95 text-center">
                                Request a Visit
                            </Link>
                        
                        <button className="px-12 py-5 bg-transparent text-white text-[12px] uppercase tracking-[0.3em] font-black border border-white/20 hover:border-mas-red/50 transition-all">
                            About Access
                        </button>
                    </div>
                </div>
            </div>

            {/* Decorative bottom bar */}
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        </section>
    );
};

export default WelcomeSection;
