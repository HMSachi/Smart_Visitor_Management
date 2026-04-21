import React from 'react';
import MetricsGrid from './MetricsGrid';

const DashboardMain = () => {
    return (
        <div className="p-4 md:p-8 animate-fade-in-slow relative max-w-[1600px] mx-auto w-full">
            <div className="space-y-10">
                <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/[0.03] pb-6 gap-6 relative z-10">
                    <div className="bg-[var(--color-surface-1)] border-l-4 border-primary p-6 py-4 rounded-r-2xl backdrop-blur-sm w-full md:w-auto">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-2 h-2 bg-primary rounded-full shadow-[0_0_10px_var(--color-primary)]"></div>
                            <span className="text-[var(--color-text-primary)] text-[14px] font-bold uppercase tracking-[0.4em]">Management Overview</span>
                        </div>
                        <p className="text-[var(--color-text-secondary)] text-[11px] uppercase font-bold tracking-[0.25em] opacity-80 leading-relaxed">
                            Monitor and Authorize Facility Access Requests
                        </p>
                    </div>
                </header>

                <MetricsGrid />
            </div>
        </div>
    );
};

export default DashboardMain;
