import React, { useState } from 'react';
import RejectionTable from './RejectionTable';
import RejectionAlertPanel from './RejectionAlertPanel';
import { XCircle } from 'lucide-react';
import { useThemeMode } from '../../../theme/ThemeModeContext';

const RejectedRequestsMain = () => {
    const { themeMode } = useThemeMode();
    const isLight = themeMode === "light";
    const [selectedVisitor, setSelectedVisitor] = useState(null);

    const requests = [
        { 
            id: 'VR-2024-004', 
            name: 'Robert Brown', 
            date: 'Oct 27, 2024', 
            reason: 'Invalid Identification Protocol', 
            comments: 'Passport verification failed at primary node. Expired documentation detected.' 
        },
        { 
            id: 'VR-2024-005', 
            name: 'Emma Wilson', 
            date: 'Oct 26, 2024', 
            reason: 'Access Range Restriction', 
            comments: 'Visitor requested access to restricted Production Area 08 without Tier-1 clearance.' 
        },
        { 
            id: 'VR-2024-006', 
            name: 'Michael Davis', 
            date: 'Oct 25, 2024', 
            reason: 'Duplicate System Node Entry', 
            comments: 'Active session already exists for this NIC. Suspected duplicate registration attempt.' 
        },
    ];

    return (
        <div className={`p-6 md:p-12 space-y-6 md:space-y-12 animate-fade-in transition-colors duration-500`}>
            <header className={`mb-8 flex flex-col md:flex-row justify-between items-start md:items-end border-b pb-6 gap-6 relative ${isLight ? "border-gray-100" : "border-white/[0.03]"}`}>
                <div>
                  <h2 className={`text-lg font-bold tracking-tight uppercase ${isLight ? "text-[#1A1A1A]" : "text-white"}`}>Rejected Requests</h2>
                  <p className={`text-[11px] font-bold uppercase tracking-[0.2em] mt-1 opacity-90 ${isLight ? "text-gray-500" : "text-white/40"}`}>View denied visitor applications</p>
                </div>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-1 md:grid-cols-3 gap-12 items-start">
                <div className="xl:col-span-2">
                     <RejectionTable requests={requests} onSelect={setSelectedVisitor} />
                </div>
                <div>
                     <RejectionAlertPanel visitor={selectedVisitor} />
                </div>
            </div>
        </div>
    );
};

export default RejectedRequestsMain;
