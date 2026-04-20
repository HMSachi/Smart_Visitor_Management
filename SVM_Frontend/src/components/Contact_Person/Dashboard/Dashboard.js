import React from 'react';
import MetricsGrid from './MetricsGrid';

const DashboardMain = () => {
    return (
        <div className="flex-1 p-4 sm:p-8 lg:p-4 md:p-10 space-y-6 md:space-y-10 animate-fade-in-slow overflow-y-auto min-h-full bg-[var(--color-bg-default)]">
            <div className="max-w-[1600px] mx-auto space-y-10">
                <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-4">
                    <div>
                    <div className="bg-white/[0.02] border-l-4 border-primary p-6 py-4 rounded-r-2xl backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-2 h-2 bg-primary rounded-full shadow-[0_0_10px_var(--color-primary)]"></div>
                            <span className="text-white text-[14px] font-bold uppercase tracking-[0.4em]">Management Overview</span>
                        </div>
                        <p className="text-gray-400 text-[11px] uppercase font-bold tracking-[0.25em] opacity-80 leading-relaxed">
                            Monitor and Authorize Facility Access Requests
                        </p>
                    </div>
                    </div>

                </header>

                <MetricsGrid />
            </div>
        </div>
    );
};

export default DashboardMain;
