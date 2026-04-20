import React from 'react';
import { Link } from 'react-router-dom';
import WelcomeSection from './WelcomeSection';

const HomeMain = () => {
    return (
        <div className="bg-background">
            <WelcomeSection />

            {/* Premium Footer */}
            <footer className="bg-background border-t border-white/5 py-10">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                    <div className="flex flex-col items-center md:items-start gap-2">
                        <div className="flex items-center">
                            <img src="/logo_mas.png" alt="MAS Logo" className="h-4 w-auto mr-3 brightness-75" />
                            <span className="text-gray-400 font-bold tracking-tighter text-[13px] uppercase">Access <span className="text-primary/80">Portal</span></span>
                        </div>
                        <p className="text-gray-700 text-[14px] font-bold uppercase tracking-widest">Facility Intelligence v4.0.5</p>
                    </div>

                    <p className="text-gray-700 text-[14px] font-bold uppercase tracking-widest text-center">
                        © 2026 MAS Holdings.
                    </p>

                    <div className="flex items-center gap-6">
                        <Link to="/privacy" className="text-[14px] font-bold uppercase tracking-widest text-gray-700 hover:text-primary transition-colors">Privacy</Link>
                        <Link to="/terms" className="text-[14px] font-bold uppercase tracking-widest text-gray-700 hover:text-primary transition-colors">Terms</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HomeMain;
