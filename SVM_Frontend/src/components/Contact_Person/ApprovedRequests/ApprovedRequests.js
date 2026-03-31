import React, { useState } from 'react';
import ApprovedTable from './ApprovedTable';
import QuickViewPanel from './QuickViewPanel';
import { CheckCircle } from 'lucide-react';

const ApprovedRequestsMain = () => {
    const [selectedVisitor, setSelectedVisitor] = useState(null);
    const [isPanelOpen, setIsPanelOpen] = useState(false);

    const requests = [
        { id: 'VR-2026-001', name: 'ADITHYA BANDARA', date: 'Mar 25, 2026', adminStatus: 'Pending Dispatch' },
        { id: 'VR-2026-002', name: 'KASUN PERERA', date: 'Mar 25, 2026', adminStatus: 'Pending Dispatch' },
        { id: 'VR-2026-003', name: 'SARAH JENKINS', date: 'Mar 24, 2026', adminStatus: 'Dispatched to Visitor' },
    ];

    const handleQuickView = (visitor) => {
        setSelectedVisitor(visitor);
        setIsPanelOpen(true);
    };

    return (
        <div className="flex-1 flex flex-col min-w-0 bg-[#0A0A0B]/50">
            <div className="p-10 space-y-10 animate-fade-in-slow">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.5)] animate-pulse"></div>
                            <span className="text-green-500 text-[10px] font-medium uppercase tracking-[0.3em]">Validation Success</span>
                        </div>
                        <p className="text-gray-300 text-xs uppercase tracking-widest opacity-90">Verified Personnel Registry & Archive</p>
                    </div>
                    <div className="flex items-center gap-4 bg-white/[0.02] border border-white/5 p-3 px-5 rounded-2xl backdrop-blur-sm">
                        <div className="text-right">
                            <p className="text-gray-300 text-[9px] uppercase font-medium tracking-wider mb-0.5 opacity-80">Total Verified</p>
                            <span className="text-xl font-medium text-white">1,284</span>
                        </div>
                    </div>
                </div>

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
