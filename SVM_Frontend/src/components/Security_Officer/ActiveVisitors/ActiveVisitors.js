import React, { useState, useEffect } from 'react';
import { Users, Clock, Search, ExternalLink, Shield, Activity, Zap, MapPin, Target, RefreshCw, Filter, MoreHorizontal, ChevronRight, Globe, AlertCircle, ChevronDown, ChevronUp, Car, Phone, Building, FileText, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ActiveVisitorsMain = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isSyncing, setIsSyncing] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
    const [expandedVisitor, setExpandedVisitor] = useState(null);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);
        return () => clearInterval(timer);
    }, []);

    const triggerSync = () => {
        setIsSyncing(true);
        setTimeout(() => setIsSyncing(false), 1500);
    };

    const toggleExpand = (id) => {
        setExpandedVisitor(expandedVisitor === id ? null : id);
    };

    const activeVisitors = [
        { id: 1, name: 'Malith Gunawardena', date: '2026-03-31', entryTime: '08:45:12 AM', areas: ['Alpha_Production', 'Storage_Beta'], status: 'Active', ref: 'SEC-4291', node: 'GATE_01', urgency: 'Low', vehicle: 'Toyota Prius (WP CAX-1234)', phone: '+94 77 123 4567', company: 'TechNova Solutions', purpose: 'Hardware Maintenance' },
        { id: 2, name: 'Sahan Perera', date: '2026-03-31', entryTime: '09:20:44 AM', areas: ['Main_Operations'], status: 'Active', ref: 'SEC-4310', node: 'GATE_02', urgency: 'Med', vehicle: 'Honda Civic (WP CB-5678)', phone: '+94 71 987 6543', company: 'LogiCorp', purpose: 'Delivery' },
        { id: 3, name: 'James Wilson', date: '2026-03-31', entryTime: '10:15:02 AM', areas: ['B_Sector_Prod'], status: 'Active', ref: 'SEC-4402', node: 'WEST_ENTRY', urgency: 'Low', vehicle: 'N/A (Walk-in)', phone: '+44 7911 123456', company: 'Global Audit Inc', purpose: 'Annual Audit' },
        { id: 4, name: 'Emma Watson', date: '2026-03-31', entryTime: '11:05:33 AM', areas: ['HQ_Admin', 'Operations'], status: 'Active', ref: 'SEC-4415', node: 'GATE_01', urgency: 'High', vehicle: 'Range Rover (WP KIA-9999)', phone: '+1 555 0198', company: 'VIP Guest', purpose: 'Executive Visit' },
    ];

    const filteredVisitors = activeVisitors.filter(v =>
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.ref.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-8 md:p-12 space-y-10 min-h-full bg-[var(--color-bg-default)]">
            {/* Tactical Monitor Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                <div className="space-y-4">
                    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-4">
                        <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 shadow-[0_0_15px_rgba(200,16,46,0.1)]">
                            <Activity size={16} className="text-primary animate-pulse" />
                        </div>
                        <span className="text-primary font-medium uppercase text-[13px] tracking-[0.4em]">Real-Time_Operational_Monitor</span>
                        <div className="h-[1px] w-12 bg-gradient-to-r from-primary/50 to-transparent"></div>
                    </div>
                    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
                        <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tighter uppercase">
                            Active_Visitors
                        </h1>
                        <div className="px-5 py-2 mas-glass border-primary/30 bg-primary/5 text-primary text-xs font-medium shadow-[0_0_30px_rgba(200,16,46,0.1)] rounded-xl border flex flex-col md:flex-row items-center gap-4 md:gap-3">
                            <Users size={14} />
                            {activeVisitors.length} SENSORS_ACTIVE
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="relative w-full sm:w-80 group">
                        <Search size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="FILTER_SENSORS (NAME/REF)..."
                            className="w-full pl-14 pr-6 py-4 bg-white/[0.02] border border-white/5 rounded-2xl text-[13px] uppercase font-medium tracking-widest text-white placeholder:text-white/80 focus:border-primary/40 outline-none transition-all duration-500"
                        />
                    </div>
                    <button
                        onClick={triggerSync}
                        className={`p-4 mas-glass border-white/5 text-gray-300 hover:text-primary hover:border-primary/40 transition-all rounded-2xl group ${isSyncing ? 'rotate-180' : ''}`}
                    >
                        <RefreshCw size={18} className={`${isSyncing ? 'animate-spin' : 'group-hover:scale-110'} transition-transform duration-700`} />
                    </button>
                    <div className="hidden lg:flex flex-col text-right">
                        <p className="text-gray-300/80 text-[14px] font-medium uppercase tracking-widest">Global_Sync_Time</p>
                        <p className="text-white text-sm font-mono font-medium tracking-widest">{currentTime}</p>
                    </div>
                </div>
            </div>

            {/* Personnel Active Matrix */}
            <div className="relative group">
                {/* Decorative background pulse */}
                <div className="absolute -inset-4 bg-primary/5 rounded-[40px] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

                <div className="relative mas-glass border-white/5 bg-[var(--color-bg-paper)]/60 backdrop-blur-3xl rounded-[32px] overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.4)] border border-white/10">
                    <div className="overflow-x-auto">
                        
<div className="overflow-x-auto w-full max-w-full pb-4">
<table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/[0.02] border-b border-white/5">
                                    <th className="px-10 py-7 uppercase text-white/90 text-[13px] font-medium tracking-[0.4em]">Unit_Identification</th>
                                    <th className="px-10 py-7 uppercase text-white/90 text-[13px] font-medium tracking-[0.4em]">Node_Sync_Entry</th>
                                    <th className="px-10 py-7 uppercase text-white/90 text-[13px] font-medium tracking-[0.4em]">Operational_Grid</th>
                                    <th className="px-10 py-7 uppercase text-white/90 text-[13px] font-medium tracking-[0.4em] text-center">Live_Pulse</th>
                                    <th className="px-10 py-7 uppercase text-white/90 text-[13px] font-medium tracking-[0.4em] text-right">Control</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.03]">
                                <AnimatePresence mode='popLayout'>
                                    {filteredVisitors.map((v) => (
                                        <React.Fragment key={v.id}>
                                            <motion.tr
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                whileHover={{ backgroundColor: 'rgba(200, 16, 46, 0.02)' }}
                                                className={`group transition-all cursor-pointer ${expandedVisitor === v.id ? 'bg-primary/[0.04]' : ''}`}
                                                onClick={() => toggleExpand(v.id)}
                                            >
                                                <td className="px-10 py-8">
                                                    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
                                                        <div className="relative overflow-visible">
                                                            <div className="w-12 h-12 rounded-xl bg-mas-dark border border-white/10 flex items-center justify-center text-primary text-sm font-medium group-hover:border-primary group-hover:shadow-[0_0_20px_rgba(200,16,46,0.2)] transition-all duration-500">
                                                                {v.name.split(' ').map(n => n[0]).join('')}
                                                            </div>
                                                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-mas-dark shadow-[0_0_8px_#22c55e]"></div>
                                                        </div>
                                                        <div>
                                                            <p className="text-[13px] font-medium text-white uppercase tracking-wider group-hover:text-primary transition-colors duration-300">{v.name}</p>
                                                            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-2 mt-1">
                                                                <Target size={10} className="text-primary opacity-90" />
                                                                <p className="text-white/90 text-[12px] font-medium tracking-widest uppercase">{v.ref}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8">
                                                    <div className="space-y-1.5">
                                                        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-2.5">
                                                            <Calendar size={12} className="text-primary opacity-70" />
                                                            <span className="text-white text-[13px] font-mono font-medium tracking-widest">{v.date}</span>
                                                        </div>
                                                        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-2.5 ml-2">
                                                            <Clock size={10} className="text-primary opacity-50" />
                                                            <span className="text-white/70 text-[13px] font-mono font-medium tracking-widest">{v.entryTime}</span>
                                                        </div>
                                                        <p className="text-white/80 text-[13px] font-medium uppercase tracking-widest ml-5">via_{v.node}</p>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8">
                                                    <div className="flex flex-wrap gap-2.5 max-w-[280px]">
                                                        {v.areas.map((area, i) => (
                                                            <span key={i} className="px-3 py-1 rounded-md bg-white/5 border border-white/10 text-white/70 text-[13px] font-medium uppercase tracking-widest group-hover:border-primary/40 group-hover:text-white transition-all duration-300">
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
                                                        <span className="text-green-500/80 text-[13px] font-medium uppercase tracking-widest">INSIDE_DOME</span>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8 text-right">
                                                    <button onClick={(e) => { e.stopPropagation(); toggleExpand(v.id); }} className={`p-3 mas-glass border-white/5 text-white/70 hover:text-white hover:border-primary/40 transition-all rounded-xl shadow-lg ${expandedVisitor === v.id ? 'bg-primary border-primary text-white' : 'hover:bg-primary/5'}`}>
                                                        {expandedVisitor === v.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                                    </button>
                                                </td>
                                            </motion.tr>
                                            {expandedVisitor === v.id && (
                                                <motion.tr
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="bg-[var(--color-bg-default)] border-b border-primary/20"
                                                >
                                                    <td colSpan="5" className="px-0 py-0">
                                                        <div className="p-4 md:p-10 pl-24 bg-gradient-to-br from-[var(--color-bg-default)] to-[#0E0E10] shadow-inner relative overflow-hidden">
                                                            {/* Detailed View Decorations */}
                                                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
                                                            <div className="w-1 h-12 bg-primary rounded-full absolute left-10 top-10 shadow-[0_0_10px_var(--color-primary)]"></div>

                                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                                                                <div className="space-y-2">
                                                                    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-2 text-gray-300/90 mb-2">
                                                                        <Car size={14} className="text-primary/80" />
                                                                        <span className="text-[12px] font-medium uppercase tracking-[0.3em]">Vehicle Details</span>
                                                                    </div>
                                                                    <p className="text-white text-sm font-medium tracking-widest">{v.vehicle}</p>
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-2 text-gray-300/90 mb-2">
                                                                        <Phone size={14} className="text-primary/80" />
                                                                        <span className="text-[12px] font-medium uppercase tracking-[0.3em]">Contact Protocol</span>
                                                                    </div>
                                                                    <p className="text-white text-sm font-mono tracking-widest">{v.phone}</p>
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-2 text-gray-300/90 mb-2">
                                                                        <Building size={14} className="text-primary/80" />
                                                                        <span className="text-[12px] font-medium uppercase tracking-[0.3em]">Organization</span>
                                                                    </div>
                                                                    <p className="text-white text-sm font-medium tracking-widest">{v.company}</p>
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-2 text-gray-300/90 mb-2">
                                                                        <FileText size={14} className="text-primary/80" />
                                                                        <span className="text-[12px] font-medium uppercase tracking-[0.3em]">Mission/Purpose</span>
                                                                    </div>
                                                                    <p className="text-white text-sm font-medium tracking-widest">{v.purpose}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
</div>

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
                        className="p-8 mas-glass border-white/5 bg-[var(--color-bg-paper)]/40 rounded-[28px] space-y-5 group hover:border-primary/20 transition-all duration-500"
                    >
                        <div className="flex items-center justify-between">
                            <p className="text-gray-300/80 text-[12px] font-medium uppercase tracking-[0.3em]">{stat.label}</p>
                            <stat.icon size={16} className={stat.color === 'mas-red' ? 'text-primary' : 'text-gray-300/80'} />
                        </div>
                        <div className="space-y-1">
                            <p className="text-white text-sm font-medium uppercase tracking-wider">{stat.val}</p>
                            <p className="text-gray-300/80 text-[12px] font-medium tracking-widest uppercase">{stat.detail}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default ActiveVisitorsMain;
