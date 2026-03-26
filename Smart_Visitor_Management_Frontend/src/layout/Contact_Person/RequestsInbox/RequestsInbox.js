import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../../components/Contact_Person/Layout/Sidebar';
import Header from '../../../components/Contact_Person/Layout/Header';
import InboxFilters from '../../../components/Contact_Person/Inbox/InboxFilters';
import RequestsTable from '../../../components/Contact_Person/Inbox/RequestsTable';

const RequestsInbox = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    const requests = [
        { id: 'VR-2024-001', name: 'John Doe', type: 'Business Visit', step: 'Step 2', status: 'Pending', time: '2 mins ago', date: 'Oct 28, 2024' },
        { id: 'VR-2024-002', name: 'Sarah Smith', type: 'Facility Tour', step: 'Step 1', status: 'Approved', time: '15 mins ago', date: 'Oct 29, 2024' },
        { id: 'VR-2024-003', name: 'Michael Chen', type: 'Maintenance', step: 'Step 2', status: 'Pending', time: '45 mins ago', date: 'Oct 28, 2024' },
        { id: 'VR-2024-004', name: 'Emma Wilson', type: 'VIP Visit', step: 'Step 1', status: 'In Review', time: '1 hour ago', date: 'Oct 30, 2024' },
        { id: 'VR-2024-005', name: 'Robert Brown', type: 'Audit', step: 'Step 2', status: 'Rejected', time: '3 hours ago', date: 'Oct 27, 2024' },
        { id: 'VR-2024-006', name: 'Alice Wong', type: 'Interview', step: 'Step 1', status: 'Pending', time: '5 hours ago', date: 'Oct 31, 2024' },
    ];

    return (
        <div className="flex min-h-screen bg-mas-black overflow-x-hidden text-white">
            <Sidebar />
            
            <main className="flex-1 ml-72 flex flex-col min-w-0 bg-[#0A0A0B]">
                <Header title="Requests Inbox" />

                <div className="p-12 space-y-8 animate-fade-in">
                    <InboxFilters searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                    <RequestsTable requests={requests} onReview={() => navigate('/contact_person/request-review')} />

                    {/* Pagination */}
                    <div className="flex items-center justify-between px-2">
                        <p className="text-mas-text-dim uppercase">Displaying 1-6 of 142 Active Records</p>
                        <div className="flex items-center gap-2">
                             {[1, 2, 3, '...', 12].map((p, i) => (
                                 <button key={i} className={`w-8 h-8 flex items-center justify-center border transition-all ${p === 1 ? 'bg-mas-red text-white border-mas-red shadow-[0_0_10px_#C8102E]' : 'bg-transparent text-mas-text-dim border-mas-border hover:border-white/20'}`}>
                                     {p}
                                 </button>
                             ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default RequestsInbox;
