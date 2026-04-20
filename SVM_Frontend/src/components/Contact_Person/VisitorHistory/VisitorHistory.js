import React from 'react';
import HistoryTable from './HistoryTable';
import { Search, Download, Filter, Database } from 'lucide-react';

const VisitorHistoryMain = () => {
    const historyData = [
        { id: '1', visitor: 'MICHAEL BROWN', date: 'OCT 20, 2024', category: 'MAINTENANCE', status: 'Approved' },
        { id: '2', visitor: 'EMMA WATSON', date: 'OCT 15, 2024', category: 'INTERVIEW', status: 'Approved' },
        { id: '3', visitor: 'DAVID CLARK', date: 'OCT 12, 2024', category: 'VENDOR', status: 'Rejected' },
        { id: '4', visitor: 'OLIVIA GREEN', date: 'OCT 08, 2024', category: 'VIP VISIT', status: 'Approved' },
        { id: '5', visitor: 'SAMUEL LEE', date: 'OCT 05, 2024', category: 'FACILITY TOUR', status: 'Approved' },
    ];

    return (
        <div className="p-4 md:p-10 space-y-10 animate-fade-in-slow">
            <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end border-b border-gray-100 pb-6 gap-6 relative">
                <div>
                  <h2 className="text-lg font-bold tracking-tight text-[#1A1A1A] uppercase">Visitor History</h2>
                  <p className="text-gray-500 text-[11px] font-bold uppercase tracking-[0.2em] mt-1 opacity-90">Verified personnel archive and entry logs</p>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative group flex-1 md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={14} />
                        <input
                            type="text"
                            placeholder="SEARCH ARCHIVES..."
                            className="bg-white border border-gray-200 text-[12px] font-bold uppercase tracking-widest text-[#1A1A1A] placeholder:text-gray-400 w-full pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-primary focus:shadow-sm transition-all shadow-sm"
                        />
                    </div>
                </div>
            </header>

            <HistoryTable history={historyData} />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-4">
                {[
                    { label: 'Total Logs', val: '1,492', color: 'text-[#1A1A1A]' },
                    { label: 'Approved Entries', val: '1,120', color: 'text-green-500' },
                    { label: 'Rejected Forms', val: '00', color: 'text-primary' },
                    { label: 'Pending Action', val: '12', color: 'text-gray-500' }
                ].map((stat, i) => (
                    <div key={i} className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm group hover:border-primary/20 transition-all">
                        <p className="text-gray-400 text-[11px] font-bold uppercase tracking-[0.2em] mb-4">{stat.label}</p>
                        <p className={`text-2xl font-black tracking-tight ${stat.color}`}>{stat.val}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VisitorHistoryMain;
