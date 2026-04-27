import React, { useState } from 'react';
import ApprovedTable from './ApprovedTable';
import QuickViewPanel from './QuickViewPanel';

const ApprovedRequestsMain = () => {
    const [selectedVisitor, setSelectedVisitor] = useState(null);
    const [isPanelOpen, setIsPanelOpen] = useState(false);

    const requests = [];

    const handleQuickView = (visitor) => {
        setSelectedVisitor(visitor);
        setIsPanelOpen(true);
    };

    return (
        <div className="flex-1 flex flex-col min-w-0 bg-[var(--color-bg-default)]/50">
            <div className="p-4 md:p-8 animate-fade-in-slow relative max-w-[1600px] mx-auto w-full">
                <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/[0.03] pb-6 gap-6 relative z-10">
                    <div>
                        <h2 className="text-white text-2xl font-bold tracking-tight uppercase">Approved Forms</h2>
                        <p className="text-white/50 text-[11px] font-bold uppercase tracking-[0.2em] mt-1">View cleared visitor applications</p>
                    </div>
                    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-4 bg-black/40 border border-white/10 p-3 px-5 rounded-xl shadow-sm">
                        <div className="text-right">
                            <p className="text-white/50 text-[10px] uppercase font-bold tracking-widest mb-0.5">Total Verified</p>
                            <span className="text-base font-black text-white">{requests.length}</span>
                        </div>
                    </div>
                </header>

                <ApprovedTable requests={requests} onQuickView={handleQuickView} />
            </div>

            <QuickViewPanel
                isOpen={isPanelOpen}
                onClose={() => setIsPanelOpen(false)}
                visitor={selectedVisitor}
            />
        </div>
    );
};

export default ApprovedRequestsMain;
