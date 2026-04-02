import React, { useState, useEffect } from 'react';
import { Shield, Clock, Wifi, ArrowLeft, Zap, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { toggleMobileMenu } from '../../../reducers/uiSlice';
import { Menu, X } from 'lucide-react';

const Header = ({ title }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isMobile = useSelector(state => state.ui.isMobile);
    const isMobileMenuOpen = useSelector(state => state.ui.isMobileMenuOpen);
    return (
        <header className="flex-none h-20 md:h-28 border-b border-white/5 bg-[#0D0D0E]/95 backdrop-blur-3xl flex items-center justify-between px-4 md:px-16 transition-all duration-500 shadow-2xl relative">
            {/* Global Node Aura */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-mas-red/20 to-transparent opacity-50"></div>

            <div className="flex items-center gap-4 md:gap-10 truncate mr-4 relative z-10">
                {isMobile ? (
                    <button
                        onClick={() => dispatch(toggleMobileMenu())}
                        className="p-3 text-mas-red transition-all bg-[#121214] border border-mas-red/20 rounded-xl hover:bg-mas-red/10 active:scale-95 shadow-lg"
                    >
                        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                ) : (
                    <button
                        onClick={() => navigate(-1)}
                        className="p-3.5 text-gray-300/90 hover:text-white transition-all bg-[#121214] border border-white/5 group rounded-2xl hover:border-mas-red/40 hover:bg-mas-red/10 shadow-xl"
                        title="BACK_TO_PREVIOUS_NODE"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1.5 transition-transform" />
                    </button>
                )}

                <div className="flex items-center gap-6">
                    <div className="p-4 rounded-2xl bg-mas-red/10 border border-mas-red/20 shadow-[0_0_30px_rgba(200,16,46,0.1)] relative group cursor-pointer">
                        <Shield size={22} className="text-mas-red group-hover:rotate-12 transition-transform duration-500" />
                        <motion.div
                            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="absolute inset-0 rounded-2xl border-2 border-mas-red/40 blur-[4px]"
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-[1px] bg-mas-red/60"></div>
                            <span className="text-gray-300/80 uppercase text-[12px] font-medium tracking-[0.4em]">Operational_Interface</span>
                        </div>
                        <h2 className="uppercase text-white text-base md:text-lg font-bold tracking-[0.2em] truncate group-hover:text-mas-red transition-colors">{title}</h2>
                    </div>
                </div>
            </div>


        </header>
    );
};

export default Header;
