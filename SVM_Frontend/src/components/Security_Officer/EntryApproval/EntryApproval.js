import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApprovalChecklist from './ApprovalChecklist';
import { ShieldCheck, Zap, Activity, Clock, Shield, Lock, Cpu, Server } from 'lucide-react';

const EntryApprovalMain = () => {
    const [nodeSync, setNodeSync] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setNodeSync(prev => !prev);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="p-10 md:p-16 space-y-16 animate-fade-in-slow bg-[#0A0A0B] relative overflow-hidden min-h-full">
            {/* Tactical background elements */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-mas-red/5 rounded-full blur-[140px] pointer-events-none opacity-40"></div>

            {/* Hero Protocol Section */}
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-12 border-b border-white/5 pb-16">
                <div className="space-y-10">
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <div className="p-3 bg-mas-red/10 border border-mas-red/20 rounded-xl relative z-10">
                                <Zap size={14} className="text-mas-red animate-pulse" />
                            </div>
                            <div className="absolute inset-0 bg-mas-red/20 blur-lg rounded-full"></div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-mas-red uppercase text-[10px] font-black tracking-[0.5em] italic">Final_Clearance_Node_Alpha_01</span>
                            <div className="h-[1px] w-32 bg-gradient-to-r from-mas-red to-transparent"></div>
                        </div>
                    </div>

                    <div className="relative group">
                        <h1 className="text-white text-5xl md:text-6xl font-black uppercase tracking-widest italic leading-none flex flex-col md:flex-row md:items-center gap-6">
                            Entry
                            <div className="hidden md:block h-10 w-[2px] bg-white/10 mx-2"></div>
                            <span className="text-mas-text-dim/10 font-light text-3xl md:text-4xl tracking-[0.2em] italic group-hover:text-mas-red/20 transition-colors duration-700 underline decoration-mas-red/10 decoration-4 underline-offset-8">AUTHORIZATION</span>
                        </h1>
                        <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-1 h-16 bg-mas-red rounded-full shadow-[0_0_20px_#C8102E] hidden xl:block"></div>
                    </div>

                    <div className="flex gap-4">
                        {['AUTH_PROTOCOL:V3', 'LEVEL_02_ACCESS', 'REAL_TIME_SYNC:OK'].map((tag, i) => (
                            <div key={i} className="px-5 py-2.5 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center gap-3 group hover:border-mas-red/30 transition-all cursor-crosshair">
                                <div className="w-1.5 h-1.5 rounded-full bg-mas-red group-hover:scale-125 transition-transform shadow-[0_0_8px_#C8102E]"></div>
                                <span className="text-mas-text-dim/40 uppercase text-[9px] font-black tracking-widest italic group-hover:text-white transition-colors">{tag}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-10">
                    <div className="px-8 py-5 mas-glass border-white/5 bg-[#121214]/40 rounded-2xl flex gap-10">
                        <div className="space-y-1.5">
                            <p className="text-mas-text-dim/20 text-[8px] font-black uppercase tracking-widest">Protocol_State</p>
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></div>
                                <span className="text-white text-sm font-black italic tracking-widest">ENFORCING</span>
                            </div>
                        </div>
                        <div className="w-px h-8 bg-white/5 self-center"></div>
                        <div className="space-y-1.5">
                            <p className="text-mas-text-dim/20 text-[8px] font-black uppercase tracking-widest">Nodal_Sync</p>
                            <div className="flex items-center gap-3">
                                <Server size={12} className="text-mas-red" />
                                <span className="text-white text-sm font-mono font-black">99.9%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative z-10">
                <ApprovalChecklist />
            </div>

            {/* Strategic Background Pulsars */}
            <AnimatePresence>
                {nodeSync && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 0.05, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        className="absolute inset-0 border-[2px] border-mas-red/10 m-32 rounded-[60px] pointer-events-none"
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default EntryApprovalMain;
