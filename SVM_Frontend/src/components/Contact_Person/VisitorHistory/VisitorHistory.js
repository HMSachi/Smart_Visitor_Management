import React from 'react';
import HistoryTable from './HistoryTable';
import { Search, Download, Filter, Database } from 'lucide-react';
import { useThemeMode } from '../../../theme/ThemeModeContext';

const VisitorHistoryMain = () => {
    const { themeMode } = useThemeMode();
    const isLight = themeMode === "light";
    const historyData = [
        { id: '1', visitor: 'MICHAEL BROWN', date: 'OCT 20, 2024', category: 'MAINTENANCE', status: 'Approved' },
        { id: '2', visitor: 'EMMA WATSON', date: 'OCT 15, 2024', category: 'INTERVIEW', status: 'Approved' },
        { id: '3', visitor: 'DAVID CLARK', date: 'OCT 12, 2024', category: 'VENDOR', status: 'Declined' },
        { id: '4', visitor: 'OLIVIA GREEN', date: 'OCT 08, 2024', category: 'VIP VISIT', status: 'Approved' },
        { id: '5', visitor: 'SAMUEL LEE', date: 'OCT 05, 2024', category: 'FACILITY TOUR', status: 'Approved' },
    ];

    return (
        <div className="p-4 md:p-10 space-y-10 animate-fade-in-slow transition-colors duration-500">
            <header className={`mb-8 flex flex-col md:flex-row justify-between items-start md:items-end border-b pb-6 gap-6 relative ${isLight ? "border-gray-100" : "border-white/[0.03]"}`}>
                <div>
                  <h2 className={`text-lg font-bold tracking-tight uppercase ${isLight ? "text-[#1A1A1A]" : "text-white"}`}>Visitor History</h2>
                  <p className={`text-[11px] font-bold uppercase tracking-[0.2em] mt-1 opacity-90 ${isLight ? "text-gray-500" : "text-white/40"}`}>Verified personnel archive and entry logs</p>
                </div>
                <div className="flex flex-col md:flex-row items-center gap-4 md:gap-4 w-full md:w-auto">
                    <div className="relative group flex-1 md:w-80">
                        <Search className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isLight ? "text-gray-400" : "text-white/40"} group-focus-within:text-primary`} size={14} />
                        <input
                            type="text"
                            placeholder="SEARCH ARCHIVES..."
                            className={`text-[12px] font-bold uppercase tracking-widest placeholder:opacity-50 w-full pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-primary focus:shadow-sm transition-all shadow-sm border ${
                                isLight 
                                    ? "bg-white border-gray-200 text-[#1A1A1A] placeholder:text-gray-400" 
                                    : "bg-black/40 border-white/10 text-white placeholder:text-white/40"
                            }`}
                        />
                    </div>
                </div>
            </header>

            <HistoryTable history={historyData} />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-4">
                {[
                    { label: 'Total Logs', val: '1,492', color: isLight ? 'text-[#1A1A1A]' : 'text-white' },
                    { label: 'Approved Entries', val: '1,120', color: 'text-green-500' },
                    { label: 'Declined Forms', val: '00', color: 'text-primary' },
                    { label: 'Pending Action', val: '12', color: isLight ? 'text-gray-500' : 'text-white/40' }
                ].map((stat, i) => (
                    <div key={i} className={`p-6 rounded-2xl border shadow-sm group hover:border-primary/20 transition-all ${
                        isLight ? "bg-white border-gray-200" : "bg-black/40 border-white/10 shadow-black/50"
                    }`}>
                        <p className={`text-[11px] font-bold uppercase tracking-[0.2em] mb-4 ${isLight ? "text-gray-400" : "text-white/40"}`}>{stat.label}</p>
                        <p className={`text-2xl font-black tracking-tight ${stat.color}`}>{stat.val}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VisitorHistoryMain;
