import React from 'react';
import { History, Search, Download, ChevronRight, Filter } from 'lucide-react';

const LogsHistoryMain = () => {
    const logs = [
        { id: 1, name: 'Malith Gunawardena', entry: '08:45:01', exit: '16:30:45', status: 'Completed', date: 'Oct 26, 2024' },
        { id: 2, name: 'Sahan Perera', entry: '09:20:12', exit: '17:05:30', status: 'Completed', date: 'Oct 26, 2024' },
        { id: 3, name: 'James Wilson', entry: '10:15:55', exit: '--:--:--', status: 'Active', date: 'Oct 26, 2024' },
        { id: 4, name: 'Emma Watson', entry: '11:05:22', exit: '14:20:10', status: 'Completed', date: 'Oct 26, 2024' },
        { id: 5, name: 'John Doe', entry: '12:34:02', exit: '--:--:--', status: 'Active', date: 'Oct 26, 2024' },
    ];

    return (
        <div className="p-12 space-y-12 animate-fade-in">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-mas-border pb-12">
                <div>
                    <div className="flex items-center gap-4 mb-4">
                        <History size={14} className="text-mas-red" />
                        <span className="text-mas-red uppercase">Movement Archives</span>
                        <div className="h-[1px] w-12 bg-mas-red"></div>
                    </div>
                    <h1 className="uppercase text-white">Log Registry</h1>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-mas-text-dim" />
                        <input 
                            type="text"
                            placeholder="SEARCH LOGS..."
                            className="mas-input w-80 pl-12 bg-white/[0.02] border-white/5 focus:border-mas-red uppercase"
                        />
                    </div>
                    <button className="flex items-center gap-3 px-6 py-3 mas-glass border-white/5 text-mas-text-dim hover:text-white transition-all uppercase">
                        <Filter size={14} />
                        Filter
                    </button>
                    <button className="flex items-center gap-3 px-6 py-3 bg-mas-red text-white uppercase shadow-[0_0_20px_rgba(200,16,46,0.2)]">
                        <Download size={14} />
                        Export
                    </button>
                </div>
            </div>

            <div className="mas-glass border-mas-border overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white/[0.02] border-b border-white/5">
                            <th className="px-10 py-6 uppercase text-mas-text-dim"> personnel</th>
                            <th className="px-10 py-6 uppercase text-mas-text-dim">entry protocol</th>
                            <th className="px-10 py-6 uppercase text-mas-text-dim">exit protocol</th>
                            <th className="px-10 py-6 uppercase text-mas-text-dim">validation</th>
                            <th className="px-10 py-6 uppercase text-mas-text-dim text-right">registry</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.03]">
                        {logs.map((log) => (
                            <tr key={log.id} className="group hover:bg-white/[0.01] transition-all">
                                <td className="px-10 py-8">
                                    <div>
                                        <p className="uppercase text-white mb-1">{log.name}</p>
                                        <p className="text-mas-text-dim uppercase">{log.date}</p>
                                    </div>
                                </td>
                                <td className="px-10 py-8">
                                    <span className="text-white">{log.entry}</span>
                                </td>
                                <td className="px-10 py-8">
                                    <span className={`${log.exit === '--:--:--' ? 'text-mas-text-dim opacity-30' : 'text-white'}`}>{log.exit}</span>
                                </td>
                                <td className="px-10 py-8">
                                    <span className={`px-4 py-1.5 border uppercase ${log.status === 'Active' ? 'border-mas-red text-mas-red bg-mas-red/5 animate-pulse' : 'border-mas-text-dim/20 text-mas-text-dim bg-white/[0.02]'}`}>
                                        {log.status}
                                    </span>
                                </td>
                                <td className="px-10 py-8 text-right">
                                    <button className="text-mas-text-dim hover:text-mas-red transition-all">
                                        <ChevronRight size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LogsHistoryMain;
