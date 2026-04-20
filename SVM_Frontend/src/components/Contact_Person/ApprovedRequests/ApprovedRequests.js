import React, { useState } from 'react';
import ApprovedTable from './ApprovedTable';
import QuickViewPanel from './QuickViewPanel';
import { CheckCircle } from 'lucide-react';

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
            <div className="p-4 md:p-10 space-y-10 animate-fade-in-slow">
                <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end border-b border-gray-100 pb-6 gap-6 relative">
                    <div>
                      <h2 className="text-lg font-bold tracking-tight text-[#1A1A1A] uppercase">Approved Forms</h2>
                      <p className="text-gray-500 text-[11px] font-bold uppercase tracking-[0.2em] mt-1 opacity-90">View cleared visitor applications</p>
                    </div>
                    <div className="flex items-center gap-4 bg-white border border-gray-200 p-3 px-5 rounded-xl shadow-sm">
                        <div className="text-right">
                            <p className="text-gray-400 text-[10px] uppercase font-bold tracking-widest mb-0.5">Total Verified</p>
                            <span className="text-base font-black text-[#1A1A1A]">{requests.length}</span>
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
