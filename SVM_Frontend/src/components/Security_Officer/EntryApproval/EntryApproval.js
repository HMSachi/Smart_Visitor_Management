import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApprovalChecklist from './ApprovalChecklist';
import { ShieldCheck, Activity, Shield, Lock, Search, ChevronRight, User, Camera, Car, Package, ArrowLeft, FileText, CheckCircle2 } from 'lucide-react';

const pendingVisitors = [
    { 
        id: 'VER-SYNC-4291', 
        name: 'John Doe', 
        type: 'Staff_Visitor', 
        nodeOrigin: 'RECEPTION_01', 
        time: '12:34:02 PM', 
        status: 'Pending Verification', 
        company: 'Logistics Pro', 
        nic: '901234567V', 
        phone: '+94 77 111 2222', 
        purpose: 'Hardware Maintenance', 
        vehicle: 'Toyota Prius (WP CAX-1234)', 
        equipment: [{name: 'Diagnostic Toolbox', serial: 'TB-991'}, {name: 'Testing Kit', serial: 'TK-12'}], 
        initials: 'JD' 
    },
    { 
        id: 'VER-SYNC-4310', 
        name: 'Jane Smith', 
        type: 'Contractor', 
        nodeOrigin: 'GATE_02', 
        time: '01:15:00 PM', 
        status: 'Pending Verification', 
        company: 'BuildCorp', 
        nic: '852345678V', 
        phone: '+94 71 333 4444', 
        purpose: 'Site Inspection', 
        vehicle: 'N/A (Walk-in)', 
        equipment: [], 
        initials: 'JS' 
    }
];

const EntryApprovalMain = () => {
    const [view, setView] = useState('list'); // 'list', 'details', 'verification'
    const [selectedVisitor, setSelectedVisitor] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredVisitors = pendingVisitors.filter(v => 
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        v.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSelectVisitor = (visitor) => {
        setSelectedVisitor(visitor);
        setView('details');
    };

    return (
        <div className="p-6 md:p-8 space-y-6 bg-[var(--color-bg-default)] relative overflow-x-hidden min-h-full">
            {/* Tactical background elements */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[140px] pointer-events-none opacity-80"></div>

            <div className="relative z-10 h-full flex flex-col">
                <AnimatePresence mode="wait">
                    {view === 'list' && (
                        <motion.div
                            key="list"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10 border border-primary/20 shadow-[0_0_15px_rgba(200,16,46,0.1)]">
                                            <Activity size={12} className="text-primary animate-pulse sm:w-4 sm:h-4" />
                                        </div>
                                        <span className="text-primary font-medium uppercase text-[14px] sm:text-[13px] tracking-[0.4em]">Access_Control_Queue</span>
                                    </div>
                                    <h1 className="text-base sm:text-lg md:text-xl font-bold text-white tracking-tighter uppercase break-words max-w-[280px] sm:max-w-none">
                                        Pending Verification
                                    </h1>
                                </div>
                                <div className="relative w-full sm:w-80 group">
                                    <Search size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="FILTER_QUEUE..."
                                        className="w-full pl-14 pr-6 py-3 sm:py-4 bg-white/[0.02] border border-white/5 rounded-2xl text-[12px] sm:text-[13px] uppercase font-medium tracking-widest text-white placeholder:text-white/60 focus:border-primary/40 outline-none transition-all duration-500 shadow-xl"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-1 md:grid-cols-3 gap-6">
                                {filteredVisitors.map(v => (
                                    <div 
                                        key={v.id}
                                        onClick={() => handleSelectVisitor(v)}
                                        className="mas-glass p-6 sm:p-8 border-white/5 bg-[var(--color-bg-paper)]/60 backdrop-blur-3xl rounded-[28px] cursor-pointer group hover:border-primary/30 hover:bg-[var(--color-bg-paper)]/80 transition-all duration-500 shadow-[0_20px_40px_rgba(0,0,0,0.4)] overflow-hidden relative"
                                    >
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[60px] pointer-events-none group-hover:bg-primary/20 transition-all"></div>
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 relative z-10">
                                            <div className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-gray-300/80 text-[14px] font-medium uppercase tracking-widest w-fit">{v.time} via {v.nodeOrigin.split('_')[0]}</div>
                                            <div className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-[14px] font-medium uppercase tracking-widest animate-pulse w-fit">Waiting</div>
                                        </div>
                                        <div className="flex items-center gap-4 sm:gap-5 relative z-10">
                                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-mas-dark border border-white/10 flex items-center justify-center text-primary font-semibold text-sm group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all shadow-[0_0_15px_rgba(200,16,46,0.1)] shrink-0">
                                                {v.initials}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-white text-lg sm:text-2xl font-bold uppercase tracking-widest group-hover:text-primary transition-colors truncate break-words">{v.name}</h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Shield size={10} className="text-gray-300/90 sm:w-3 sm:h-3" />
                                                    <span className="text-gray-300/90 text-[12px] sm:text-[13px] font-medium uppercase tracking-[0.2em] truncate">{v.id}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {filteredVisitors.length === 0 && (
                                    <div className="col-span-full py-20 text-center">
                                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                                            <CheckCircle2 size={24} className="text-gray-300/80" />
                                        </div>
                                        <p className="text-white/80 font-medium uppercase tracking-widest text-xs">No pending verifications</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {view === 'details' && (
                        <motion.div
                            key="details"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-4 md:space-y-8"
                        >
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                                <button 
                                    onClick={() => setView('list')}
                                    className="px-6 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-gray-300 hover:text-white hover:border-white/30 transition-all flex items-center gap-3 text-[13px] font-medium uppercase tracking-widest group"
                                >
                                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Access Queue
                                </button>
                                <div className="px-5 py-2.5 bg-primary/10 border border-primary/20 rounded-xl flex items-center gap-3 shadow-[0_0_20px_rgba(200,16,46,0.1)]">
                                    <Lock size={14} className="text-primary" />
                                    <span className="text-primary text-[13px] font-medium uppercase tracking-widest">Encrypted_Profile_Sync</span>
                                </div>
                            </div>

                            <div className="mas-glass p-4 md:p-10 md:p-14 border-primary/20 bg-[var(--color-bg-paper)]/80 backdrop-blur-3xl rounded-[32px] shadow-[0_30px_60px_rgba(0,0,0,0.4)] relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
                                <div className="absolute top-0 right-0 p-8 opacity-[0.02] font-mono text-7xl md:text-8xl font-medium pointer-events-none">{selectedVisitor?.id.split('-').pop()}</div>

                                <div className="flex flex-col lg:flex-row gap-12 relative z-10 w-full">
                                    <div className="w-full lg:w-1/3 space-y-6 flex flex-col items-center lg:items-start text-center lg:text-left">
                                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-primary border border-white/10 shadow-[0_0_30px_rgba(200,16,46,0.3)] flex items-center justify-center text-white font-medium text-3xl md:text-4xl">
                                            {selectedVisitor?.initials}
                                        </div>
                                        <div className="space-y-1.5">
                                            <h2 className="text-white text-2xl font-bold uppercase tracking-widest">{selectedVisitor?.name}</h2>
                                            <div className="flex items-center justify-center lg:justify-start gap-3 mt-1 text-primary text-[12px] font-medium uppercase tracking-[0.2em]">
                                                <span>{selectedVisitor?.type}</span>
                                                <div className="w-1 h-1 rounded-full bg-primary"></div>
                                                <span>{selectedVisitor?.nodeOrigin}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="w-full lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-10">
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 text-gray-300/50 mb-1">
                                                <User size={14} /> <span className="text-[12px] font-medium uppercase tracking-[0.3em]">Identity / NIC</span>
                                            </div>
                                            <p className="text-white text-sm tracking-widest uppercase bg-white/[0.02] border border-white/5 py-3 px-4 rounded-xl">{selectedVisitor?.nic}</p>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 text-gray-300/50 mb-1">
                                                <Activity size={14} /> <span className="text-[12px] font-medium uppercase tracking-[0.3em]">Company / Org</span>
                                            </div>
                                            <p className="text-white text-sm tracking-widest uppercase bg-white/[0.02] border border-white/5 py-3 px-4 rounded-xl">{selectedVisitor?.company}</p>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 text-gray-300/50 mb-1">
                                                <FileText size={14} /> <span className="text-[12px] font-medium uppercase tracking-[0.3em]">Mission Purpose</span>
                                            </div>
                                            <p className="text-white text-sm tracking-widest uppercase bg-white/[0.02] border border-white/5 py-3 px-4 rounded-xl">{selectedVisitor?.purpose}</p>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 text-gray-300/50 mb-1">
                                                <Car size={14} /> <span className="text-[12px] font-medium uppercase tracking-[0.3em]">Vehicle Profile</span>
                                            </div>
                                            <p className="text-white text-sm tracking-widest uppercase bg-white/[0.02] border border-white/5 py-3 px-4 rounded-xl">{selectedVisitor?.vehicle}</p>
                                        </div>
                                        <div className="sm:col-span-2 space-y-4">
                                            <div className="flex items-center gap-2 text-gray-300/50 mb-1">
                                                <Package size={14} /> <span className="text-[12px] font-medium uppercase tracking-[0.3em]">Declared Assets</span>
                                            </div>
                                            {selectedVisitor?.equipment.length > 0 ? (
                                                <div className="flex flex-wrap gap-4">
                                                    {selectedVisitor.equipment.map((eq, i) => (
                                                        <div key={i} className="px-5 py-3 bg-[var(--color-bg-default)] border border-white/10 rounded-xl flex items-center gap-4">
                                                            <span className="text-white text-[14px] font-medium uppercase tracking-widest">{eq.name}</span>
                                                            <div className="h-3 w-[1px] bg-white/10"></div>
                                                            <span className="text-gray-300/90 text-[12px] font-mono tracking-widest opacity-90">S/N: {eq.serial}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="px-5 py-4 bg-white/5 border border-white/10 rounded-xl">
                                                    <p className="text-gray-300/90 text-[13px] font-medium uppercase tracking-widest">No assets declared</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mt-14 pt-10 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10 w-full">
                                    <div className="text-center md:text-left">
                                        <p className="text-[14px] font-medium uppercase tracking-[0.4em] text-gray-300/80 mb-1">Next Protocol Stage</p>
                                        <p className="text-white text-[13px] uppercase font-medium tracking-widest">Awaiting Matrix Validation</p>
                                    </div>
                                    <button 
                                        onClick={() => setView('verification')}
                                        className="w-full md:w-auto px-10 py-5 bg-primary text-white uppercase font-medium tracking-[0.3em] text-[14px] rounded-2xl shadow-[0_15px_30px_rgba(200,16,46,0.3)] hover:shadow-[0_20px_40px_rgba(200,16,46,0.5)] transition-all hover:-translate-y-1 flex items-center justify-center gap-4 group"
                                    >
                                        Initiate Verification Matrix <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {view === 'verification' && (
                        <motion.div
                            key="verification"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-transparent"
                        >
                            <ApprovalChecklist visitor={selectedVisitor} onBack={() => setView('details')} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default EntryApprovalMain;
