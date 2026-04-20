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
        <div className="p-6 md:p-12 space-y-6 md:space-y-12 animate-fade-in">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-mas-border pb-12">
                <div>
                    <div className="flex items-center gap-4 mb-4">
                        <History size={14} className="text-primary" />
                        <span className="text-primary uppercase">Movement Archives</span>
                        <div className="h-[1px] w-12 bg-primary"></div>
                    </div>
                    <h1 className="uppercase text-white">Log Registry</h1>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                        <input 
                            type="text"
                            placeholder="SEARCH LOGS..."
                            className="mas-input w-80 pl-12 bg-white/[0.02] border-white/5 focus:border-primary uppercase"
                        />
                    </div>
                    <button className="flex items-center gap-3 px-6 py-3 mas-glass border-white/5 text-gray-300 hover:text-white transition-all uppercase">
                        <Filter size={14} />
                        Filter
                    </button>
                    <button className="flex items-center gap-3 px-6 py-3 bg-primary text-white uppercase shadow-[0_0_20px_rgba(200,16,46,0.2)]">
                        <Download size={14} />
                        Export
                    </button>
                </div>
            </div>

            <div className="mas-glass border-mas-border overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white/[0.02] border-b border-white/5 text-[13px]">
                            <th className="px-10 py-6 uppercase text-gray-300"> personnel</th>
                            <th className="px-10 py-6 uppercase text-gray-300">entry protocol</th>
                            <th className="px-10 py-6 uppercase text-gray-300">exit protocol</th>
                            <th className="px-10 py-6 uppercase text-gray-300">validation</th>
                            <th className="px-10 py-6 uppercase text-gray-300 text-right">registry</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.03]">
                        {logs.map((log) => (
                            <tr key={log.id} className="group hover:bg-white/[0.01] transition-all">
                                <td className="px-10 py-8">
                                    <div className="text-[13px]">
                                        <p className="uppercase text-white mb-1">{log.name}</p>
                                        <p className="text-gray-300 uppercase">{log.date}</p>
                                    </div>
                                </td>
                                <td className="px-10 py-8 text-[13px]">
                                    <span className="text-white">{log.entry}</span>
                                </td>
                                <td className="px-10 py-8 text-[13px]">
                                    <span className={`${log.exit === '--:--:--' ? 'text-gray-300 opacity-30' : 'text-white'}`}>{log.exit}</span>
                                </td>
                                <td className="px-10 py-8">
                                    <span className={`px-4 py-1.5 border uppercase text-[12px] ${log.status === 'Active' ? 'border-primary text-primary bg-primary/5 animate-pulse' : 'border-mas-text-dim/20 text-gray-300 bg-white/[0.02]'}`}>
                                        {log.status}
                                    </span>
                                </td>
                                <td className="px-10 py-8 text-right">
                                    <button className="text-gray-300 hover:text-primary transition-all">
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
