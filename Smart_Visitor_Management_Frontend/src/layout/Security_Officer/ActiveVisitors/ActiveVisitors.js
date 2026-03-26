import React from 'react';
import Sidebar from '../../../components/Security_Officer/Layout/Sidebar';
import Header from '../../../components/Security_Officer/Layout/Header';
import { Users, MapPin, Clock, Search, ExternalLink } from 'lucide-react';

const ActiveVisitors = () => {
    const activeVisitors = [
        { id: 1, name: 'Malith Gunawardena', entryTime: '08:45 AM', areas: ['Production A', 'Store'], status: 'Inside', ref: 'SEC-4291' },
        { id: 2, name: 'Sahan Perera', entryTime: '09:20 AM', areas: ['Office Block'], status: 'Inside', ref: 'SEC-4310' },
        { id: 3, name: 'James Wilson', entryTime: '10:15 AM', areas: ['Production B'], status: 'Inside', ref: 'SEC-4402' },
        { id: 4, name: 'Emma Watson', entryTime: '11:05 AM', areas: ['Main Office', 'Canteen'], status: 'Inside', ref: 'SEC-4415' },
    ];

    return (
        <div className="flex min-h-screen bg-mas-black overflow-x-hidden text-white">
            <Sidebar />
            
            <main className="flex-1 ml-72 flex flex-col min-w-0 bg-[#0A0A0B]">
                <Header title="Live Personnel Tracking" />

                <div className="p-12 space-y-12 animate-fade-in">
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-mas-border pb-12">
                        <div>
                            <div className="flex items-center gap-4 mb-4">
                                <Users size={14} className="text-mas-red" />
                                <span className="text-mas-red uppercase">Real-Time Monitor</span>
                                <div className="h-[1px] w-12 bg-mas-red"></div>
                            </div>
                            <h1 className="uppercase text-white flex items-center gap-6">
                                Active Visitors
                                <span className="px-4 py-2 mas-glass border-mas-red/30 text-mas-red inline-flex shadow-[0_0_20px_rgba(200,16,46,0.1)]">
                                    {activeVisitors.length} Registered
                                </span>
                            </h1>
                        </div>

                        <div className="relative w-full lg:w-96">
                            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-mas-text-dim" />
                            <input 
                                type="text"
                                placeholder="FILTER BY NAME OR REF ID..."
                                className="mas-input w-full pl-12 bg-white/[0.02] border-white/5 focus:border-mas-red uppercase placeholder:text-white/10"
                            />
                        </div>
                    </div>

                    <div className="mas-glass border-mas-border overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/[0.02] border-b border-white/5">
                                    <th className="px-10 py-6 uppercase text-mas-text-dim">Unit Identification</th>
                                    <th className="px-10 py-6 uppercase text-mas-text-dim">Entry Sync</th>
                                    <th className="px-10 py-6 uppercase text-mas-text-dim">Operational Areas</th>
                                    <th className="px-10 py-6 uppercase text-mas-text-dim">Live Status</th>
                                    <th className="px-10 py-6 uppercase text-mas-text-dim text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.03]">
                                {activeVisitors.map((v) => (
                                    <tr key={v.id} className="group transition-all hover:bg-mas-red/[0.01]">
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-5">
                                                <div className="w-10 h-10 bg-mas-dark border border-white/5 flex items-center justify-center text-mas-red group-hover:border-mas-red group-hover:shadow-[0_0_15px_rgba(200,16,46,0.1)] transition-all">
                                                    {v.name.split(' ').map(n=>n[0]).join('')}
                                                </div>
                                                <div>
                                                    <p className="uppercase text-white mb-1.5 decoration-mas-red/20 group-hover:underline underline-offset-4">{v.name}</p>
                                                    <p className="text-mas-text-dim uppercase">{v.ref}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-4">
                                                <Clock size={12} className="text-mas-text-dim" />
                                                <span className="text-white">{v.entryTime}</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex flex-wrap gap-2">
                                                {v.areas.map((area, i) => (
                                                    <span key={i} className="px-3 py-1 bg-white/[0.02] border border-white/5 text-mas-text-dim uppercase group-hover:text-white group-hover:border-white/10 transition-colors">
                                                        {area}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-3">
                                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]"></div>
                                                <span className="text-green-500 uppercase">{v.status}</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8 text-right">
                                            <button className="p-3 mas-glass border-white/5 text-mas-text-dim hover:text-white hover:border-mas-red transition-all group/btn">
                                                <ExternalLink size={14} className="group-hover/btn:scale-110" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Timeline Tracker (Preview) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-mas-border">
                         <div className="p-8 mas-glass border-white/5 bg-mas-red/5 space-y-4">
                             <p className="text-mas-red uppercase">Latest Entry</p>
                             <p className="text-white">SEC-4415 | Emma Watson</p>
                             <p className="text-mas-text-dim uppercase">11:05:22 AM @ MAIN GATE 01</p>
                         </div>
                         <div className="p-8 mas-glass border-white/5 bg-white/[0.01] space-y-4">
                             <p className="text-mas-text-dim uppercase">Production Access</p>
                             <p className="text-white">03 Units Active</p>
                             <p className="text-mas-text-dim uppercase">MONITORED VIA NODE 08</p>
                         </div>
                         <div className="p-8 mas-glass border-white/5 bg-white/[0.01] space-y-4">
                             <p className="text-mas-text-dim uppercase">System Status</p>
                             <p className="text-white">Tactical Node Sync 100%</p>
                             <p className="text-mas-text-dim uppercase">LAST SYNC: 2 SECONDS AGO</p>
                         </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ActiveVisitors;
