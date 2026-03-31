import React from 'react';
import { Link } from 'react-router-dom';
import WelcomeSection from './WelcomeSection';
import AboutAccessSystem from './AboutAccessSystem';
import SafetyFeatures from './SafetyFeatures';

const HomeMain = () => {
    return (
        <div className="bg-mas-dark-900">
            <WelcomeSection />
            <div className="space-y-0">
                <AboutAccessSystem />
                <SafetyFeatures />
            </div>

            {/* Premium Footer */}
            <footer className="bg-mas-dark-900 border-t border-white/[0.03] py-20 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-mas-red/20 to-transparent" />
                
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
                    <div className="flex flex-col items-center md:items-start gap-4">
                        <div className="flex items-center group">
                            <img src="/logo_mas.png" alt="MAS Logo" className="h-6 w-auto mr-4 brightness-90" />
                            <span className="text-white font-medium tracking-tighter text-sm uppercase">Access <span className="text-mas-red">Portal</span></span>
                        </div>
                        <p className="text-gray-600 text-[10px] font-medium uppercase tracking-[0.3em]">Facility Intelligence v4.0.5</p>
                    </div>

                    <p className="text-gray-500 text-[10px] font-medium uppercase tracking-widest text-center">
                        © 2026 MAS Holdings. All rights reserved.
                    </p>

                    <div className="flex items-center gap-8">
                        <Link to="/privacy" className="text-[10px] font-medium uppercase tracking-widest text-gray-500 hover:text-mas-red transition-colors">Privacy</Link>
                        <Link to="/terms" className="text-[10px] font-medium uppercase tracking-widest text-gray-500 hover:text-mas-red transition-colors">Terms</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HomeMain;
