import React from 'react';
import { Globe } from 'lucide-react';

export const PerformanceAnalytics = () => (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 animate-fade-in">
        <div>
            <div className="flex items-center gap-3 mb-1">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                <span className="text-primary text-[11px] font-bold uppercase tracking-[0.3em]">Operational Intel</span>
            </div>
            <p className="text-gray-400 text-[10px] uppercase tracking-widest leading-relaxed">Real-time visitor traffic and authorization metrics</p>
        </div>
        <div className="flex items-center gap-3 sm:gap-6 bg-white border border-gray-200 p-2.5 sm:p-3 px-4 sm:px-5 rounded-2xl shadow-sm">
            <div className="text-right border-r border-gray-100 pr-6">
                <p className="text-gray-400 text-[10px] uppercase font-bold tracking-widest mb-0.5">Cycle Efficiency</p>
                <div className="flex items-center gap-2 justify-end">
                    <span className="text-lg font-bold text-[#1A1A1A]">98.4%</span>
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                </div>
            </div>
            <div className="text-right">
                <p className="text-gray-400 text-[10px] uppercase font-bold tracking-widest mb-0.5">Active Nodes</p>
                <span className="text-lg font-bold text-primary">12</span>
            </div>
        </div>
    </div>
);

export const NodeConfiguration = () => (
    <div className="space-y-6 h-full flex flex-col animate-fade-in" style={{ animationDelay: '0.3s' }}>
        <div className="flex items-center justify-between px-1">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]">Security Protocol</h3>
            <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.3)]"></div>
                <span className="text-[10px] text-green-500 font-bold uppercase tracking-widest">Node Optimal</span>
            </div>
        </div>

        <div className="p-6 bg-white border border-gray-200 rounded-3xl relative group overflow-hidden flex-1 shadow-xl shadow-gray-200/50">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl opacity-50"></div>

            <div className="relative z-10 flex flex-col h-full">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-5">
                    <Globe size={20} />
                </div>
                <h4 className="text-[#1A1A1A] text-[12px] font-bold uppercase tracking-wide mb-2">Encryption: PRIME</h4>
                <p className="text-gray-500 text-[11px] font-medium leading-relaxed mb-6 flex-1 uppercase tracking-widest">
                    System synchronization with MAS-HQ active. All entry points are secured.
                </p>
                <button className="w-full py-3 rounded-xl bg-gray-50 border border-gray-100 text-[#1A1A1A] text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 shadow-sm">
                    Sync Matrix
                </button>
            </div>
        </div>

        <div className="p-5 bg-gray-50 border border-gray-100 rounded-2xl">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3 px-1">
                <span>Core Health</span>
                <span className="text-[#1A1A1A]">85%</span>
            </div>
            <div className="bg-gray-200 h-1 w-full rounded-full overflow-hidden">
                <div className="bg-primary h-full w-[85%] rounded-full shadow-[0_0_8px_var(--color-primary)]"></div>
            </div>
        </div>
    </div>
);
