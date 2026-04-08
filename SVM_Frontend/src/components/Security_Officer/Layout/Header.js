import React from 'react';
import { Shield, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { toggleMobileMenu } from '../../../reducers/uiSlice';
import { Menu, X } from 'lucide-react';
import ThemeToggleButton from '../../common/ThemeToggleButton';

const Header = ({ title }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isMobile = useSelector(state => state.ui.isMobile);
    const isMobileMenuOpen = useSelector(state => state.ui.isMobileMenuOpen);
    return (
        <header className="flex-none h-14 md:h-16 border-b border-white/5 bg-mas-dark/95 backdrop-blur-sm flex items-center justify-between px-4 md:px-8 transition-all duration-300 relative">
            {/* Global Node Aura */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-50"></div>

            <div className="flex items-center gap-4 md:gap-10 truncate mr-4 relative z-10">
                {isMobile ? (
                    <button
                        onClick={() => dispatch(toggleMobileMenu())}
                        className="p-2 text-primary transition-all bg-mas-dark/90 border border-primary/20 rounded-lg hover:bg-primary/10 active:scale-95"
                    >
                        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                ) : (
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2.5 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-all bg-mas-dark/90 border border-white/5 group rounded-lg hover:border-primary/40 hover:bg-primary/10"
                        title="BACK_TO_PREVIOUS_NODE"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                )}

                <div className="flex items-center gap-6">
                    <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 relative group cursor-pointer">
                        <Shield size={18} className="text-primary group-hover:rotate-12 transition-transform duration-500" />
                        <motion.div
                            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="absolute inset-0 rounded-xl border-2 border-primary/40 blur-[3px]"
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <h2 className="uppercase text-[var(--color-text-primary)] text-sm md:text-sm font-semibold tracking-[0.18em] truncate group-hover:text-primary transition-colors">{title}</h2>
                    </div>
                </div>
            </div>

            <div className="relative z-10">
                <ThemeToggleButton />
            </div>

        </header>
    );
};

export default Header;
