import React from 'react';
import { Link } from 'react-router-dom';
import WelcomeSection from '../../components/Home/WelcomeSection';
import AboutAccessSystem from '../../components/Home/AboutAccessSystem';
import SafetyFeatures from '../../components/Home/SafetyFeatures';

const Home = () => {
    return (
        <div className="bg-white">
            <WelcomeSection />
            <AboutAccessSystem />
            <SafetyFeatures />

            {/* Simple Footer */}
            <footer className="bg-charcoal-900 border-t border-white/5 py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between">
                    <div className="flex items-center group mb-8 md:mb-0">
                        <div className="w-6 h-6 bg-mas-red mr-3"></div>
                        <span className="text-sm font-bold text-white tracking-widest uppercase">MAS ACCESS</span>
                    </div>
                    <p className="text-gray-500 text-[10px] uppercase tracking-widest font-bold">© 2026 MAS Holdings. All rights reserved.</p>
                    <div className="flex space-x-12 mt-8 md:mt-0">
                        <Link to="/privacy" className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 hover:text-mas-red transition-colors">PrivacyNode</Link>
                        <Link to="/terms" className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 hover:text-mas-red transition-colors">ClearanceTerms</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
