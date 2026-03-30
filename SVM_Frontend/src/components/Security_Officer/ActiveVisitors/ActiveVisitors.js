import React, { useState, useEffect } from 'react';
import { Users, Clock, Search, ExternalLink, Shield, Activity, Zap, MapPin, Target, RefreshCw, Filter, MoreHorizontal, ChevronRight, Globe, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ActiveVisitorsMain = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isSyncing, setIsSyncing] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);
        return () => clearInterval(timer);
    }, []);

    const triggerSync = () => {
        setIsSyncing(true);
        setTimeout(() => setIsSyncing(false), 1500);
    };

    const activeVisitors = [
        { id: 1, name: 'Malith Gunawardena', entryTime: '08:45:12 AM', areas: ['Alpha_Production', 'Storage_Beta'], status: 'Active', ref: 'SEC-4291', node: 'GATE_01', urgency: 'Low' },
        { id: 2, name: 'Sahan Perera', entryTime: '09:20:44 AM', areas: ['Main_Operations'], status: 'Active', ref: 'SEC-4310', node: 'GATE_02', urgency: 'Med' },
        { id: 3, name: 'James Wilson', entryTime: '10:15:02 AM', areas: ['B_Sector_Prod'], status: 'Active', ref: 'SEC-4402', node: 'WEST_ENTRY', urgency: 'Low' },
        { id: 4, name: 'Emma Watson', entryTime: '11:05:33 AM', areas: ['HQ_Admin', 'Operations'], status: 'Active', ref: 'SEC-4415', node: 'GATE_01', urgency: 'High' },
    ];

    const filteredVisitors = activeVisitors.filter(v =>
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.ref.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-8 md:p-12 space-y-10 min-h-full bg-[#0A0A0B]">
            {/* Tactical Monitor Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-mas-red/10 border border-mas-red/20 shadow-[0_0_15px_rgba(200,16,46,0.1)]">
                            <Activity size={16} className="text-mas-red animate-pulse" />
                        </div>
                        <span className="text-mas-red font-black uppercase text-[10px] tracking-[0.4em] italic">Real-Time_Operational_Monitor</span>
                        <div className="h-[1px] w-12 bg-gradient-to-r from-mas-red/50 to-transparent"></div>
                    </div>
                    <div className="flex items-center gap-8">
                        <h1 className="text-5xl font-black text-white italic tracking-tighter uppercase">
                            Active_Visitors
                        </h1>
                        <div className="px-5 py-2 mas-glass border-mas-red/30 bg-mas-red/5 text-mas-red text-xs font-black italic shadow-[0_0_30px_rgba(200,16,46,0.1)] rounded-xl border flex items-center gap-3">
                            <Users size={14} />
                            {activeVisitors.length} SENSORS_ACTIVE
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="relative w-full sm:w-80 group">
                        <Search size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-mas-text-dim group-focus-within:text-mas-red transition-colors" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="FILTER_SENSORS (NAME/REF)..."
                            className="w-full pl-14 pr-6 py-4 bg-white/[0.02] border border-white/5 rounded-2xl text-[10px] uppercase font-black tracking-widest text-white placeholder:text-white/10 focus:border-mas-red/50 focus:bg-mas-red/[0.02] outline-none transition-all duration-500 italic"
                        />
                    </div>
                    <button
                        onClick={triggerSync}
                        className={`p-4 mas-glass border-white/5 text-mas-text-dim hover:text-mas-red hover:border-mas-red/40 transition-all rounded-2xl group ${isSyncing ? 'rotate-180' : ''}`}
                    >
                        <RefreshCw size={18} className={`${isSyncing ? 'animate-spin' : 'group-hover:scale-110'} transition-transform duration-700`} />
                    </button>
                    <div className="hidden lg:flex flex-col text-right">
                        <p className="text-mas-text-dim/20 text-[8px] font-black uppercase tracking-widest">Global_Sync_Time</p>
                        <p className="text-white text-sm font-mono font-bold tracking-widest">{currentTime}</p>
                    </div>
                </div>
            </div>

            {/* Personnel Active Matrix */}
            <div className="relative group">
                {/* Decorative background pulse */}
                <div className="absolute -inset-4 bg-mas-red/5 rounded-[40px] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

                <div className="relative mas-glass border-white/5 bg-[#121214]/60 backdrop-blur-3xl rounded-[32px] overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.4)] border border-white/10">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/[0.02] border-b border-white/5">
                                    <th className="px-10 py-7 uppercase text-mas-text-dim/30 text-[9px] font-black tracking-[0.4em] italic">Unit_Identification</th>
                                    <th className="px-10 py-7 uppercase text-mas-text-dim/30 text-[9px] font-black tracking-[0.4em] italic">Node_Sync_Entry</th>
                                    <th className="px-10 py-7 uppercase text-mas-text-dim/30 text-[9px] font-black tracking-[0.4em] italic">Operational_Grid</th>
                                    <th className="px-10 py-7 uppercase text-mas-text-dim/30 text-[9px] font-black tracking-[0.4em] italic text-center">Live_Pulse</th>
                                    <th className="px-10 py-7 uppercase text-mas-text-dim/30 text-[9px] font-black tracking-[0.4em] italic text-right">Control</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.03]">
                                <AnimatePresence mode='popLayout'>
                                    {filteredVisitors.map((v) => (
                                        <motion.tr
                                            key={v.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            whileHover={{ backgroundColor: 'rgba(200, 16, 46, 0.02)' }}
                                            className="group transition-all"
                                        >
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-6">
                                                    <div className="relative">
                                                        <div className="w-12 h-12 rounded-xl bg-mas-dark border border-white/10 flex items-center justify-center text-mas-red text-sm font-black italic group-hover:border-mas-red group-hover:shadow-[0_0_20px_rgba(200,16,46,0.2)] transition-all duration-500">
                                                            {v.name.split(' ').map(n => n[0]).join('')}
                                                        </div>
                                                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-mas-dark shadow-[0_0_8px_#22c55e]"></div>
                                                    </div>
                                                    <div>
                                                        <p className="text-[13px] font-black text-white italic uppercase tracking-wider group-hover:text-mas-red transition-colors duration-300">{v.name}</p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <Target size={10} className="text-mas-red opacity-40" />
                                                            <p className="text-mas-text-dim/40 text-[9px] font-black tracking-widest uppercase">{v.ref}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="space-y-1.5">
                                                    <div className="flex items-center gap-2.5">
                                                        <Clock size={12} className="text-mas-red opacity-50" />
                                                        <span className="text-white text-[11px] font-mono font-bold tracking-widest">{v.entryTime}</span>
                                                    </div>
                                                    <p className="text-mas-text-dim/20 text-[8px] font-black uppercase tracking-widest italic ml-5">via_{v.node}</p>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex flex-wrap gap-2.5 max-w-[280px]">
                                                    {v.areas.map((area, i) => (
                                                        <span key={i} className="px-3 py-1 rounded-md bg-white/5 border border-white/10 text-mas-text-dim text-[8px] font-black uppercase tracking-widest group-hover:border-mas-red/20 group-hover:text-white transition-all duration-300">
                                                            {area}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex flex-col items-center gap-2">
                                                    <div className="relative">
                                                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_12px_#22c55e]"></div>
                                                        <div className="absolute inset-x-[-8px] inset-y-[-8px] border border-green-500/20 rounded-full scale-150 animate-ping opacity-30"></div>
                                                    </div>
                                                    <span className="text-green-500/60 text-[8px] font-black uppercase tracking-widest italic">INSIDE_DOME</span>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8 text-right">
                                                <button className="p-3 mas-glass border-white/5 text-mas-text-dim hover:text-white hover:border-mas-red/40 hover:bg-mas-red/5 transition-all rounded-xl group/btn active:scale-95">
                                                    <ExternalLink size={14} className="group-hover/btn:scale-110 group-hover/btn:rotate-12 transition-transform duration-500" />
                                                </button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Tactical Analytics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                    { label: 'Latest_Entry_Node', val: 'SEC-4415 | Emma W.', detail: 'GATE_01 | 11:05:33', icon: Zap, color: 'mas-red' },
                    { label: 'Zone_Operations', val: '04 Units_Sync', detail: '3 SECTORS_COVERED', icon: Shield, color: 'white' },
                    { label: 'System_Integrity', val: 'Active_Sync: 100%', detail: 'NODE_HEALTH: EXCELLENT', icon: RefreshCw, color: 'white' },
                    { label: 'Global_Visibility', val: 'Encrypted_Stream', detail: 'PROTOCOL_V2_ACTIVE', icon: Globe, color: 'mas-red' }
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        whileHover={{ y: -5 }}
                        className="p-8 mas-glass border-white/5 bg-[#121214]/40 rounded-[28px] space-y-5 group hover:border-mas-red/20 transition-all duration-500"
                    >
                        <div className="flex items-center justify-between">
                            <p className="text-mas-text-dim/20 text-[9px] font-black uppercase tracking-[0.3em] italic">{stat.label}</p>
                            <stat.icon size={16} className={stat.color === 'mas-red' ? 'text-mas-red' : 'text-mas-text-dim/40'} />
                        </div>
                        <div className="space-y-1">
                            <p className="text-white text-sm font-black italic uppercase tracking-wider">{stat.val}</p>
                            <p className="text-mas-text-dim/40 text-[9px] font-black tracking-widest uppercase">{stat.detail}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default ActiveVisitorsMain;
