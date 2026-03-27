import React from 'react';
import { Link } from 'react-router-dom';

const WelcomeSection = () => {
    return (
        <section className="relative min-h-screen flex items-center pt-20 overflow-hidden text-white">
            {/* Background Image */}
            <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
                <img
                    src="/main.jpeg"
                    alt="Background Facility"
                    className="absolute w-full h-full object-cover object-[center_10%]"
                />
                {/* Dark Overlay (Shade) - Fades from dark on left (for text readability) to transparent on right (to show colorful image) */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0b] via-[#0a0a0b]/60 to-transparent z-10"></div>
                {/* Optional: Subtle colorful gradient on the right side */}
                <div className="absolute inset-0 bg-gradient-to-l from-mas-red/10 to-transparent mix-blend-overlay z-20"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full">
                <div className="max-w-5xl">
                    <div className="flex items-center space-x-6 mb-8">
                        <div className="w-12 h-[2px] bg-mas-red"></div>
                        <span className="uppercase text-mas-red tracking-[0.3em] text-xs font-bold font-mono">Facility Intelligence</span>
                    </div>

                    <div
                        role="heading"
                        aria-level="1"
                        className="mb-10 font-black"
                        style={{
                            fontFamily: '"Arial Black", "Montserrat", "Inter", sans-serif',
                            fontSize: 'clamp(60px, 9vw, 80px)',
                            lineHeight: '0.95',
                            letterSpacing: '-0.04em',
                            textTransform: 'uppercase'
                        }}
                    >
                        <span className="text-white block">VISITOR</span>
                        <span className="text-mas-red">ACCESS</span> <span className="text-white">PORTAL</span>
                    </div>

                    <div className="max-w-2xl border-l-[3px] border-white/10 space-y-8 mb-16 relative">
                        <p className="text-gray-200 text-lg md:text-xl font-medium leading-relaxed">
                            Secure, streamlined, and enterprise-grade access management for MAS Holdings world-class manufacturing facilities.
                        </p>
                        <p className="text-gray-400 text-base md:text-lg leading-relaxed animate-fade-in stagger-item">
                            Experience the next generation of facility access. A seamless, high-security digital gateway designed for the modern enterprise.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 animate-fade-in stagger-item">
                        <Link to="/request-step-1" className="w-full sm:w-auto px-10 py-4 bg-mas-red text-white uppercase text-sm tracking-widest font-bold hover:bg-[#A60D26] shadow-[0_0_30px_rgba(200,16,46,0.3)] transition-all transform active:scale-95 text-center">
                            Request a Visit
                        </Link>

                        <button className="px-10 py-4 bg-transparent text-white uppercase text-sm tracking-widest font-bold border border-white/10 hover:border-white transition-all">
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
