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
            <footer className="bg-mas-dark-900 border-t border-white/5 py-10">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                    <div className="flex flex-col items-center md:items-start gap-2">
                        <div className="flex items-center">
                            <img src="/logo_mas.png" alt="MAS Logo" className="h-4 w-auto mr-3 brightness-75" />
                            <span className="text-gray-400 font-bold tracking-tighter text-[10px] uppercase">Access <span className="text-mas-red/80">Portal</span></span>
                        </div>
                        <p className="text-gray-700 text-[8px] font-bold uppercase tracking-widest">Facility Intelligence v4.0.5</p>
                    </div>

                    <p className="text-gray-700 text-[8px] font-bold uppercase tracking-widest text-center">
                        © 2026 MAS Holdings.
                    </p>

                    <div className="flex items-center gap-6">
                        <Link to="/privacy" className="text-[8px] font-bold uppercase tracking-widest text-gray-700 hover:text-mas-red transition-colors">Privacy</Link>
                        <Link to="/terms" className="text-[8px] font-bold uppercase tracking-widest text-gray-700 hover:text-mas-red transition-colors">Terms</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HomeMain;
