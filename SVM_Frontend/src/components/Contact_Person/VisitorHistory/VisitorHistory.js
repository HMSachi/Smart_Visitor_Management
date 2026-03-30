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
        <div className="p-10 space-y-10 animate-fade-in-slow">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-2">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-1.5 h-1.5 bg-mas-text-dim rounded-full opacity-40 shadow-[0_0_8px_rgba(255,255,255,0.3)]"></div>
                        <span className="text-mas-text-dim text-[10px] font-black uppercase tracking-[0.3em]">Historical Ledger</span>
                    </div>
                    <p className="text-mas-text-dim text-xs uppercase tracking-widest opacity-60">Verified personnel archive and entry logs</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-mas-text-dim group-focus-within:text-mas-red transition-colors" size={14} />
                        <input
                            type="text"
                            placeholder="SEARCH ARCHIVES..."
                            className="bg-white/[0.03] border border-white/5 text-[10px] font-black uppercase tracking-widest text-white placeholder:text-white/20 w-80 pl-12 py-3 rounded-xl focus:outline-none focus:border-mas-red focus:bg-white/[0.05] transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-2 px-5 py-3 bg-white/[0.03] border border-white/5 rounded-xl cursor-pointer hover:border-mas-red group transition-all">
                        <Filter size={14} className="text-mas-text-dim group-hover:text-mas-red" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-mas-text-dim group-hover:text-white">Filters</span>
                    </div>
                    <button className="flex items-center gap-3 px-6 py-3 bg-mas-red text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-mas-red-dark transition-all shadow-[0_4px_20px_rgba(200,16,46,0.2)]">
                        <Download size={14} />
                        Export Ledger
                    </button>
                </div>
            </div>

            <HistoryTable history={historyData} />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-4">
                {[
                    { label: 'Fiscal Log', val: '1,492', color: 'text-white' },
                    { label: 'Approved Entries', val: '1,120', color: 'text-green-500' },
                    { label: 'Breach Events', val: '00', color: 'text-mas-red' },
                    { label: 'Pending Sync', val: '12', color: 'text-mas-text-dim' }
                ].map((stat, i) => (
                    <div key={i} className="p-6 rounded-3xl bg-[#121214] border border-white/5 shadow-xl group hover:border-white/10 transition-all">
                        <p className="text-mas-text-dim text-[9px] font-black uppercase tracking-[0.2em] mb-4 opacity-40 group-hover:opacity-100 transition-opacity">{stat.label}</p>
                        <p className={`text-2xl font-bold tracking-tight ${stat.color}`}>{stat.val}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VisitorHistoryMain;
