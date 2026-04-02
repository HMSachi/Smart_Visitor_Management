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
        <div className="p-12 space-y-12 animate-fade-in">
            <div className="flex items-end justify-between border-b border-mas-border pb-8">
                <div>
                    <div className="flex items-center gap-4 mb-4">
                        <Send size={14} className="text-primary" />
                        <span className="text-primary uppercase">Forwarded Node Tracking</span>
                        <div className="h-[1px] w-12 bg-primary"></div>
                    </div>
                    <h1 className="uppercase text-white flex items-center gap-6">
                        Sent to Admin
                        <div className="p-3 mas-glass border-white/10 bg-white/5 inline-flex">
                            <Target size={24} className="text-gray-300" />
                        </div>
                    </h1>
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex items-center gap-4 px-8 py-5 bg-white/[0.02] border-l-4 border-primary relative overflow-hidden">
                     <div className="absolute right-0 top-0 h-full w-32 bg-primary/5 blur-2xl"></div>
                     <span className="uppercase text-white">Active Forwarding Nodes: 4</span>
                     <div className="h-4 w-px bg-white/10 mx-4"></div>
                     <span className="uppercase text-gray-300">Synchronization Status: Primary</span>
                </div>
                <SentTable requests={requests} />
            </div>
        </div>
    );
};

export default SentToAdminMain;
