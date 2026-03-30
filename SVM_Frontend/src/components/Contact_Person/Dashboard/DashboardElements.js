import React from 'react';

export const PerformanceAnalytics = () => (
    <div className="flex items-end justify-between border-b border-mas-border pb-8">
        <div>
            <div className="flex items-center gap-4 mb-4">
                <span className="text-mas-red uppercase">Operational Analytics</span>
                <div className="h-[1px] w-12 bg-mas-red"></div>
            </div>
            <h1 className="uppercase">System Performance</h1>
        </div>
        <div className="text-right">
            <p className="text-mas-text-dim uppercase mb-2">Cycle Efficiency</p>
            <span className="text-mas-red">98.4%</span>
        </div>
    </div>
);

export const NodeConfiguration = () => (
    <div className="space-y-8">
        <div className="border-b border-mas-border pb-4">
            <h3 className="uppercase">Node Configuration</h3>
        </div>
        
        <div className="p-8 mas-glass border-mas-border relative group overflow-hidden text-white">
            <div className="absolute top-0 right-0 w-32 h-32 bg-mas-red/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            <h4 className="text-mas-red uppercase mb-4">Security Level: Prime</h4>
            <p className="text-gray-400 mb-8">
                All visitor encryption protocols are active. Internal routing is synchronized with MAS-HQ nodes.
            </p>
            <button className="w-full py-4 border border-mas-red text-mas-red uppercase hover:bg-mas-red hover:text-white transition-all shadow-[0_0_20px_rgba(200,16,46,0.1)]">
                Refresh Matrix
            </button>
        </div>

        <div className="space-y-4">
            <div className="text-mas-text-dim uppercase mb-2 px-2">System Health</div>
            <div className="bg-white/5 h-1 w-full overflow-hidden">
                <div className="bg-mas-red h-full w-[85%]"></div>
            </div>
            <div className="flex justify-between text-mas-text-dim uppercase px-1">
                <span>Sync Status: 85%</span>
                <span>Latency: 12ms</span>
            </div>
        </div>
    </div>
);
