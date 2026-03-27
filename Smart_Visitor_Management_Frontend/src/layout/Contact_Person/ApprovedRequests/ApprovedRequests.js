import React, { useState } from 'react';
import Sidebar from '../../../components/Contact_Person/Layout/Sidebar';
import Header from '../../../components/Contact_Person/Layout/Header';
import ApprovedTable from '../../../components/Contact_Person/Approved/ApprovedTable';
import QuickViewPanel from '../../../components/Contact_Person/Approved/QuickViewPanel';
import { CheckCircle } from 'lucide-react';

const ApprovedRequests = () => {
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
        <div className="flex min-h-screen bg-mas-black overflow-x-hidden text-white">
            <Sidebar />
            
            <main className="flex-1 ml-72 flex flex-col min-w-0 bg-[#0A0A0B]">
                <Header title="Approved Requests" />

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
            </main>
        </div>
    );
};

export default ApprovedRequests;
