import React from 'react';
import { Search, Bell, Clock, Globe, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = ({ title }) => {
    const navigate = useNavigate();

    return (
        <header className="h-20 mas-glass sticky top-0 z-40 px-8 flex items-center justify-between border-b border-white/[0.05]">
            <div className="flex items-center gap-8 flex-1">
                <div className="flex items-center gap-4 text-white">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="p-3 text-mas-text-dim hover:text-white transition-colors bg-white/5 border border-white/10 group"
                        title="Go Back"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div className="w-1 h-6 bg-mas-red"></div>
                    <h2 className="uppercase">{title}</h2>
                </div>

                <div className="max-w-md w-full relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-mas-text-dim transition-colors group-focus-within:text-mas-red" size={16} />
                    <input
                        type="text"
                        placeholder="ENCRYPTED SEARCH: VISITOR DATABASE..."
                        className="mas-input w-full pl-12 pr-4 py-3 bg-white/[0.02] border border-white/5 focus:bg-white/[0.04] placeholder: placeholder: placeholder:"
                    />
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="flex flex-col items-end border-r border-mas-border pr-6">
                    <div className="flex items-center gap-2 text-mas-red">
                        <Globe size={12} className="animate-pulse" />
                        <span className="uppercase">MAS_NODE: 08A_COL</span>
                    </div>
                    <div className="flex items-center gap-2 text-mas-text-dim">
                        <Clock size={12} />
                        <span className="uppercase">14:18:22 GMT+5:30</span>
                    </div>
                </div>

                <div className="relative cursor-pointer group">
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-mas-red rounded-full shadow-[0_0_8px_#C8102E]"></div>
                    <Bell size={20} className="text-mas-text-dim group-hover:text-white transition-colors" />
                </div>
            </div>
        </header>
    );
};

export default Header;
