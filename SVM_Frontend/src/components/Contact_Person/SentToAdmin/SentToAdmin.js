import React from 'react';
import SentTable from './SentTable';
import { Send, Target } from 'lucide-react';

const SentToAdminMain = () => {
    const requests = [
        { id: 'FWD-900', name: 'John Doe', status: 'Under Review' },
        { id: 'FWD-901', name: 'Sarah Smith', status: 'Approved' },
        { id: 'FWD-902', name: 'Michael Chen', status: 'Under Review' },
        { id: 'FWD-903', name: 'James Wilson', status: 'Declined' },
    ];

    return (
                <div className="p-6 md:p-12 space-y-6 md:space-y-12 animate-fade-in">
                        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end border-b border-[var(--color-border-soft)] pb-6 gap-6 relative">
                <div>
                                    <h2 className="text-lg font-bold tracking-tight text-[var(--color-text-primary)] uppercase">Sent to Admin</h2>
                                    <p className="text-[var(--color-text-dim)] text-[11px] font-bold uppercase tracking-[0.2em] mt-1 opacity-90">View requests escalated for final authorization</p>
                </div>
            </header>

            <div className="space-y-6">
                                <div className="flex flex-col md:flex-row items-center gap-4 md:gap-4 px-6 py-4 bg-[var(--color-bg-paper)] border border-[var(--color-border-soft)] rounded-xl shadow-sm">
                                         <span className="uppercase text-[var(--color-text-primary)] text-[11px] font-bold tracking-[0.15em]">Total Escalated: {requests.length}</span>
                </div>
                <SentTable requests={requests} />
            </div>
        </div>
    );
};

export default SentToAdminMain;
