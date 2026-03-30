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
        <div className="flex-1 flex flex-col min-w-0 bg-[#0A0A0B]">
            <div className="p-12 space-y-12 animate-fade-in">
                <div className="flex items-end justify-between border-b border-mas-border pb-8">
                    <div>
                        <div className="flex items-center gap-4 mb-4">
                            <CheckCircle size={14} className="text-green-500" />
                            <span className="text-green-500 uppercase">Validation Success</span>
                            <div className="h-[1px] w-12 bg-green-500"></div>
                        </div>
                        <h1 className="uppercase">Verified Registry</h1>
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
