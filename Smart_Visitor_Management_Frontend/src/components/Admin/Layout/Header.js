import React from 'react';
import { Search, Bell, Settings, User, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="h-20 mas-glass sticky top-0 z-40 px-8 flex items-center justify-between border-b border-white/[0.05]">
      <div className="flex-1 max-w-xl flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)} 
          className="p-3 text-mas-text-dim hover:text-white transition-colors bg-white/5 border border-white/10 group"
          title="Go Back"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        </button>
        <div className="relative group w-full">
          <Search 
            className="absolute left-4 top-1/2 -translate-y-1/2 text-mas-text-dim group-focus-within:text-mas-red transition-all duration-300" 
            size={16} 
          />
          <input
            type="text"
            placeholder="ENCRYPTED SEARCH: SYSTEM NODES..."
            className="mas-input w-full pl-12 pr-4 py-3 bg-white/[0.02] border border-white/5 focus:bg-white/[0.04] placeholder: placeholder: placeholder:"
          />
        </div>
      </div>

      <div className="flex items-center gap-8">
        <div className="flex items-center gap-4">
          <button className="relative p-2 text-mas-text-dim hover:text-white transition-all group">
            <Bell size={18} strokeWidth={2} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-mas-red animate-pulse shadow-[0_0_5px_#C8102E]"></span>
          </button>
          <button className="p-2 text-mas-text-dim hover:text-white transition-all">
            <Settings size={18} strokeWidth={2} />
          </button>
        </div>
        
        <div className="h-6 w-[1px] bg-white/10 hidden sm:block"></div>

        <button className="flex items-center gap-4 group text-left">
          <div className="hidden md:block">
            <p className="text-white uppercase mb-0.5">Samith</p>
            <p className="text-mas-red uppercase text-right">ROOT ADMIN</p>
          </div>
          <div className="w-10 h-10 bg-mas-red/10 flex items-center justify-center border border-mas-red/30 group-hover:bg-mas-red group-hover:text-white transition-all text-mas-red">
            <User size={20} strokeWidth={2.5} />
          </div>
        </button>
      </div>
    </header>
  );
};

export default Header;
