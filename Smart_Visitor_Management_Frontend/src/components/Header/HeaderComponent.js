import React, { useState } from "react";
import { Link } from "react-router-dom";

const HeaderComponent = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="fixed top-0 left-0 w-full z-50 bg-charcoal-900/60 backdrop-blur-xl border-b border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link to="/" className="flex-shrink-0 flex items-center group">
                        <img 
                            src="/logo_mas.png" 
                            alt="MAS Logo" 
                            className="h-10 w-auto mr-3 filter brightness-100 group-hover:brightness-125 transition-all"
                        />
                        <span className="text-xl font-bold text-white tracking-[0.2em] uppercase">
                            MAS <span className="text-mas-red opacity-80 font-light">Access</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex space-x-12 items-center">
                        <Link to="/home" className="text-[11px] uppercase tracking-widest font-semibold text-gray-400 hover:text-mas-red transition-all">Home</Link>
                        <Link to="/access" className="text-[11px] uppercase tracking-widest font-semibold text-gray-400 hover:text-mas-red transition-all">Access Control</Link>
                        <Link to="/status" className="text-[11px] uppercase tracking-widest font-semibold text-gray-400 hover:text-mas-red transition-all">Status</Link>
                        
                        <div className="h-4 w-px bg-white/10 ml-4"></div>
                        
                        <Link to="/request-step-1" className="ml-4 px-8 py-3 bg-mas-red text-white text-[11px] uppercase tracking-[0.2em] font-bold hover:shadow-[0_0_25px_rgba(200,16,46,0.3)] transition-all relative overflow-hidden group">
                           <span className="relative z-10">Request Visit</span>
                           <div className="absolute inset-0 bg-white/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                        </Link>
                    </nav>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button 
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 text-gray-400 hover:text-mas-red transition-colors focus:outline-none"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8h16M4 16h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
                <div className="md:hidden bg-charcoal-900 border-t border-white/5 animate-fade-in">
                    <div className="px-4 pt-4 pb-8 space-y-4">
                        <Link to="/home" className="block text-sm font-semibold text-gray-400 uppercase tracking-widest px-2" onClick={() => setIsMenuOpen(false)}>Home</Link>
                        <Link to="/access" className="block text-sm font-semibold text-gray-400 uppercase tracking-widest px-2" onClick={() => setIsMenuOpen(false)}>Access Control</Link>
                        <Link to="/status" className="block text-sm font-semibold text-gray-400 uppercase tracking-widest px-2" onClick={() => setIsMenuOpen(false)}>Status Check</Link>
                        <Link 
                            to="/request-step-1" 
                            className="block w-full mt-6 bg-mas-red text-white py-4 font-bold uppercase tracking-widest text-center"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Request Visit
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
};

export default HeaderComponent;