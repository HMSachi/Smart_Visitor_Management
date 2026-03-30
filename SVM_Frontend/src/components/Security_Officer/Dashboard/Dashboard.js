import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import SecurityMetrics from './SecurityMetrics';
import { Shield, Zap, Activity, Clock, Cpu, Server, Globe, Lock } from 'lucide-react';

const DashboardMain = () => {
    const { commandStatus, stationId } = useSelector(state => state.security);
    const [scanPulse, setScanPulse] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setScanPulse(prev => !prev);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="p-4 sm:p-8 md:p-12 space-y-8 md:space-y-12 animate-fade-in-slow bg-[#0A0A0B] relative overflow-hidden min-h-full">
            {/* Tactical background elements */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-mas-red/5 rounded-full blur-[140px] pointer-events-none opacity-40"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none opacity-20"></div>

            {/* Strategic Hero Matrix */}
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
                            <span className="text-mas-red uppercase text-[10px] font-black tracking-[0.5em] italic">Primary_Enforcement_Node_01</span>
                            <div className="h-[1px] w-24 bg-gradient-to-r from-mas-red to-transparent"></div>
                        </div>
                    </div>

                    <div className="relative group">
                        <h1 className="text-white text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-widest italic leading-none flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                            Dashboard
                            <div className="hidden md:block h-12 w-[2px] bg-white/10 mx-2"></div>
                            <span className="text-mas-text-dim/10 font-light text-3xl sm:text-4xl md:text-5xl tracking-[0.2em] italic group-hover:text-mas-red/20 transition-colors duration-700 underline decoration-mas-red/10 decoration-4 underline-offset-8">NODE_ALPHA</span>
                        </h1>
                        <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-1 h-20 bg-mas-red rounded-full shadow-[0_0_20px_#C8102E] hidden xl:block"></div>
                    </div>

                    <div className="flex gap-4">
                        {['SYSTEM_ARMED', 'NODAL_SYNC:OK', 'ENFORCEMENT_MODE'].map((tag, i) => (
                            <div key={i} className="px-5 py-2.5 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center gap-3 group hover:border-mas-red/30 transition-all cursor-crosshair shadow-lg">
                                <div className="w-1.5 h-1.5 rounded-full bg-mas-red group-hover:scale-125 transition-transform shadow-[0_0_8px_#C8102E] flex-shrink-0"></div>
                                <span className="text-mas-text-dim/40 uppercase text-[9px] font-black tracking-widest italic group-hover:text-white transition-colors truncate">{tag}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative group">
                    {/* Status Console Glass */}
                    <div className="mas-glass p-10 md:p-12 border-white/5 bg-[#121214]/60 backdrop-blur-3xl rounded-[40px] shadow-[0_30px_60px_rgba(0,0,0,0.5)] border border-white/10 relative z-10 hover:border-mas-red/20 transition-all duration-700">
                        <div className="flex gap-12 md:gap-20">
                            <div className="space-y-4">
                                <p className="text-mas-text-dim/30 uppercase text-[9px] font-black tracking-[0.4em] italic mb-2">Command_Protocol</p>
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse shadow-[0_0_15px_#22c55e]"></div>
                                        <motion.div
                                            animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                                            transition={{ repeat: Infinity, duration: 1.5 }}
                                            className="absolute inset-0 bg-green-500 rounded-full"
                                        />
                                    </div>
                                    <p className="text-white text-2xl font-black italic tracking-widest">{commandStatus}</p>
                                </div>
                            </div>

                            <div className="w-px h-16 bg-white/10 self-center"></div>

                            <div className="space-y-4">
                                <p className="text-mas-text-dim/30 uppercase text-[9px] font-black tracking-[0.4em] italic mb-2">Station_Identity</p>
                                <div className="flex items-center gap-5">
                                    <div className="p-3 rounded-2xl bg-mas-red/10 border border-mas-red/20">
                                        <Server size={18} className="text-mas-red" />
                                    </div>
                                    <p className="text-white text-2xl font-mono font-black tracking-[0.1em]">{stationId}</p>
                                </div>
                            </div>
                        </div>

                        {/* Scanner Pulse Visualizer Overlay */}
                        <div className="absolute -inset-2 border-mas-red/5 border-2 rounded-[45px] pointer-events-none opacity-20"></div>
                        <AnimatePresence>
                            {scanPulse && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.05 }}
                                    className="absolute inset-0 border border-mas-red/10 rounded-[40px] pointer-events-none"
                                />
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Strategic Intelligence Metrics Grid */}
            <div className="relative z-10">
                <div className="flex items-center gap-6 mb-12">
                    <h3 className="text-mas-text-dim/30 uppercase text-[11px] font-black tracking-[0.4em] italic">Real_Time_Intelligence_Feed</h3>
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-white/5 via-white/10 to-transparent"></div>
                </div>
                <SecurityMetrics />
            </div>

            {/* Tactical Detail Visualizer */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10 relative z-10 border-t border-white/5 pt-12">
                {[
                    { label: 'NODE_TRAFFIC', icon: Activity, val: 'HIGH_LATENCY', sync: '99.9%' },
                    { label: 'GLOBAL_SYNC', icon: Globe, val: 'ACTIVE_LINK', sync: 'STABLE' },
                    { label: 'CORE_VITAL', icon: Cpu, val: 'OPERATIONAL', sync: 'OPTIMAL' },
                ].map((item, idx) => (
                    <div key={idx} className="bg-white/[0.01] border border-white/5 p-8 rounded-3xl flex items-center justify-between group hover:border-mas-red/40 transition-all duration-500 shadow-2xl relative overflow-hidden cursor-crosshair">
                        <div className="flex items-center gap-6 relative z-10">
                            <div className="p-4 rounded-2xl bg-[#121214] border border-white/5 group-hover:text-mas-red group-hover:border-mas-red/40 transition-all">
                                <item.icon size={22} className="group-hover:scale-110 transition-transform" />
                            </div>
                            <div>
                                <p className="text-mas-text-dim/20 uppercase text-[9px] font-black tracking-widest mb-1">{item.label}</p>
                                <p className="text-white text-md font-black italic tracking-widest group-hover:text-mas-red transition-colors">{item.val}</p>
                            </div>
                        </div>
                        <div className="text-right relative z-10">
                            <p className="text-mas-red text-[10px] font-mono font-black italic">{item.sync}</p>
                            <p className="text-mas-text-dim/10 text-[8px] uppercase tracking-widest mt-1">STATUS</p>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-br from-mas-red/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DashboardMain;
