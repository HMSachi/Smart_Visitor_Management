import React, { useState } from 'react';
import Sidebar from '../../../components/Contact_Person/Layout/Sidebar';
import Header from '../../../components/Contact_Person/Layout/Header';
import HistoryTable from '../../../components/Contact_Person/History/HistoryTable';
import { Search, Calendar, Download, Filter, Database } from 'lucide-react';

const VisitorHistory = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const historyData = [
        { id: '1', visitor: 'Michael Brown', date: 'Oct 20, 2024', category: 'Maintenance', status: 'Approved' },
        { id: '2', visitor: 'Emma Watson', date: 'Oct 15, 2024', category: 'Interview', status: 'Approved' },
        { id: '3', visitor: 'David Clark', date: 'Oct 12, 2024', category: 'Vendor', status: 'Rejected' },
        { id: '4', visitor: 'Olivia Green', date: 'Oct 08, 2024', category: 'VIP Visit', status: 'Approved' },
        { id: '5', visitor: 'Samuel Lee', date: 'Oct 05, 2024', category: 'Facility Tour', status: 'Approved' },
    ];

    return (
        <div className="flex min-h-screen bg-mas-black overflow-x-hidden text-white">
            <Sidebar />
            
            <main className="flex-1 ml-72 flex flex-col min-w-0 bg-[#0A0A0B]">
                <Header title="Archived Records" />

                <div className="p-12 space-y-12 animate-fade-in">
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-mas-border pb-12">
                        <div>
                            <div className="flex items-center gap-4 mb-4">
                                <Database size={14} className="text-mas-text-dim" />
                                <span className="text-mas-text-dim uppercase">Historical Ledger</span>
                                <div className="h-[1px] w-12 bg-white/10"></div>
                            </div>
                            <h1 className="uppercase text-white">Visitor History</h1>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="relative w-80">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-mas-text-dim" size={16} />
                                <input
                                    type="text"
                                    placeholder="SEARCH ARCHIVES..."
                                    className="mas-input w-full pl-12 pr-4 bg-white/[0.02] border-white/5"
                                />
                            </div>
                            <div className="flex items-center gap-2 p-3 bg-white/[0.02] border border-white/10 cursor-pointer hover:border-mas-red group transition-all">
                                <Filter size={16} className="text-mas-text-dim group-hover:text-mas-red" />
                                <span className="uppercase text-mas-text-dim group-hover:text-white">Filters</span>
                            </div>
                            <button className="flex items-center gap-3 px-8 py-3 bg-white text-black uppercase hover:bg-mas-red hover:text-white transition-all shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                                <Download size={14} />
                                Export Ledger
                            </button>
                        </div>
                    </div>

                    <HistoryTable history={historyData} />

                    {/* Footer Stats */}
                    <div className="pt-12 grid grid-cols-1 md:grid-cols-4 gap-8">
                       {[
                           { label: 'Fiscal Month Log', val: '1,492' },
                           { label: 'Approved Entries', val: '1,120' },
                           { label: 'Breach Detections', val: '42' },
                           { label: 'Pending Archival', val: '12' }
                       ].map((stat, i) => (
                           <div key={i} className="p-8 border border-white/5 bg-white/[0.01]">
                               <p className="text-mas-text-dim uppercase mb-4">{stat.label}</p>
                               <p className="text-white">{stat.val}</p>
                           </div>
                       ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default VisitorHistory;
