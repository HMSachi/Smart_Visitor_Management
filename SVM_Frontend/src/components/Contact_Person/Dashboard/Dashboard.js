import React from 'react';
import MetricsGrid from './MetricsGrid';

const DashboardMain = () => {
    return (
        <div className="flex-1 p-4 sm:p-8 lg:p-4 md:p-10 space-y-6 md:space-y-10 animate-fade-in-slow overflow-y-auto min-h-full bg-[var(--color-bg-default)]">
            <div className="max-w-[1600px] mx-auto space-y-10">
                <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-4">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_8px_var(--color-primary)] animate-pulse"></div>
                            <span className="text-gray-300 text-[13px] font-medium uppercase tracking-[0.3em]">Contact Portal</span>
                        </div>
                        <p className="text-gray-300 text-xs uppercase tracking-widest opacity-90">Action center and visitor relationship oversight</p>
                    </div>

                    <div className="flex items-center gap-6 bg-white/[0.02] border border-white/5 p-4 px-6 rounded-2xl backdrop-blur-md shadow-2xl">
                        <div className="text-right">
                            <p className="text-gray-300 text-[12px] uppercase font-medium tracking-widest mb-1 opacity-80">Node Status</p>
                            <div className="flex items-center justify-end gap-2">
                                <div className="w-1 h-1 bg-green-500 rounded-full shadow-[0_0_5px_#22c55e]"></div>
                                <span className="text-green-500 text-[13px] font-medium uppercase tracking-widest">OPERATIONAL</span>
                            </div>
                        </div>
                        <div className="h-10 w-[1px] bg-white/10"></div>
                        <div className="text-right">
                            <p className="text-gray-300 text-[12px] uppercase font-medium tracking-widest mb-1 opacity-80">System Time</p>
                            <span className="text-white text-[13px] font-medium uppercase tracking-widest">14:18:22 GMT+5:30</span>
                        </div>
                    </div>
                </header>

                <MetricsGrid />
            </div>
        </div>
    );
};

export default DashboardMain;
