import React from 'react';
import SentTable from './SentTable';
import { Send, Target } from 'lucide-react';

const SentToAdminMain = () => {
    const requests = [
        { id: 'FWD-900', name: 'John Doe', status: 'Under Review' },
        { id: 'FWD-901', name: 'Sarah Smith', status: 'Approved' },
        { id: 'FWD-902', name: 'Michael Chen', status: 'Under Review' },
        { id: 'FWD-903', name: 'James Wilson', status: 'Rejected' },
    ];

    return (
        <div className="p-6 md:p-12 space-y-6 md:space-y-12 animate-fade-in">
            <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end border-b border-gray-100 pb-6 gap-6 relative">
                <div>
                  <h2 className="text-lg font-bold tracking-tight text-[#1A1A1A] uppercase">Sent to Admin</h2>
                  <p className="text-gray-500 text-[11px] font-bold uppercase tracking-[0.2em] mt-1 opacity-90">View requests escalated for final authorization</p>
                </div>
            </header>

            <div className="space-y-6">
                <div className="flex items-center gap-4 px-6 py-4 bg-white border border-gray-200 rounded-xl shadow-sm">
                     <span className="uppercase text-[#1A1A1A] text-[11px] font-bold tracking-[0.15em]">Total Escalated: {requests.length}</span>
                </div>
                <SentTable requests={requests} />
            </div>
        </div>
    );
};

export default SentToAdminMain;
