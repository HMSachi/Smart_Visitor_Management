import React from 'react';
import { Shield, Clock, Wifi, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = ({ title }) => {
    const navigate = useNavigate();

    return (
        <header className="h-24 border-b border-mas-border bg-mas-black flex items-center justify-between px-12 sticky top-0 z-40">
            <div className="flex items-center gap-6">
                <button 
                    onClick={() => navigate(-1)} 
                    className="p-3 text-mas-text-dim hover:text-white transition-colors bg-white/5 border border-white/10 group"
                    title="Go Back"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                </button>
                <div className="p-3 mas-glass border-mas-red/20 bg-mas-red/[0.03]">
                    <Shield size={18} className="text-mas-red" />
                </div>
                <h2 className="uppercase text-white">{title}</h2>
            </div>


            <div className="flex items-center gap-12">
                <div className="flex items-center gap-4 py-2 px-4 border border-white/5 bg-white/[0.02]">
                    <Clock size={14} className="text-mas-text-dim" />
                    <span className="text-white uppercase">Shift: 08:00 - 16:00</span>
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end">
                        <span className="text-mas-text-dim uppercase">Network Node</span>
                        <div className="flex items-center gap-2">
                             <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_5px_#22c55e]"></div>
                             <span className="text-white uppercase">PRIMARY ENCRYPTED</span>
                        </div>
                    </div>
                    <Wifi size={18} className="text-mas-text-dim" />
                </div>
            </div>
        </header>
    );
};

export default Header;
