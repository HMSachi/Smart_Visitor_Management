import React, { useState, useEffect } from 'react';
import { ClipboardList, Briefcase, AlertTriangle, Check, ShieldCheck, ShieldAlert, Activity, Package, Camera, Laptop, RefreshCw, ChevronRight, Info, Zap, Lock, Terminal, Fingerprint, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ExitVerificationMain = () => {
    const [checks, setChecks] = useState({
        equipment: false,
        noItems: false,
        clearance: false
    });
    const [authenticating, setAuthenticating] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);
        return () => clearInterval(timer);
    }, []);

    const equipmentList = [
        { id: 1, name: 'MacBook_Pro_16_M3', category: 'Computing', status: 'Verified', sn: 'SN-4291-AAPL' },
        { id: 2, name: 'DSLR_Canon_EOS_R5', category: 'Optics', status: 'Missing', mismatch: true, sn: 'SN-4310-CANO' },
        { id: 3, name: 'Technical_ID_Badge', category: 'Credentials', status: 'Verified', sn: 'ID-8822-MAS' },
    ];

    const toggleCheck = (id) => {
        if (!checks[id]) {
            setAuthenticating(id);
            setTimeout(() => {
                setChecks(prev => ({ ...prev, [id]: true }));
                setAuthenticating(null);
            }, 800);
        } else {
            setChecks(prev => ({ ...prev, [id]: false }));
        }
    };

    const hasMismatch = equipmentList.some(item => item.mismatch);
    const allChecked = Object.values(checks).every(v => v);

    return (
        <div className="p-8 md:p-12 space-y-12 bg-[var(--color-bg-default)] min-h-full">
            {/* Tactical Protocol Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 border-b border-white/5 pb-10">
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 shadow-[0_0_15px_rgba(200,16,46,0.1)]">
                            <ClipboardList size={16} className="text-primary" />
                        </div>
                        <span className="text-primary font-medium uppercase text-[13px] tracking-[0.4em]">Operational_Exit_Protocol</span>
                        <div className="h-[1px] w-12 bg-gradient-to-r from-primary/50 to-transparent"></div>
                    </div>
                    <div className="flex items-center gap-8">
                        <h1 className="text-5xl font-bold text-white tracking-tighter uppercase">
                            Exit_Verification
                        </h1>
                        <div className="px-5 py-2 mas-glass border-primary/30 bg-primary/5 text-primary text-xs font-medium shadow-[0_0_30px_rgba(200,16,46,0.1)] rounded-xl border flex items-center gap-3">
                            <ShieldAlert size={14} className={hasMismatch ? 'animate-pulse' : ''} />
                            NODE_VIS_4291_EXIT
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-8">
                    <div className="hidden sm:flex flex-col text-right">
                        <p className="text-gray-300/80 text-[14px] font-medium uppercase tracking-widest">Protocol_Sync_Time</p>
                        <p className="text-white text-sm font-mono font-medium tracking-widest">{currentTime}</p>
                    </div>
                    <div className="w-[1px] h-12 bg-white/5 hidden sm:block"></div>
                    <div className="flex flex-col text-right">
                        <p className="text-gray-300/80 text-[14px] font-medium uppercase tracking-widest">Security_Level</p>
                        <p className="text-primary text-sm font-medium tracking-widest">ENFORCED</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                {/* Declared Asset Matrix */}
                <div className="space-y-8">
                    <div className="flex items-center gap-6 px-4">
                        <div className="flex items-center gap-3">
                            <Briefcase size={14} className="text-primary" />
                            <h4 className="text-gray-300/30 uppercase text-[12px] font-medium tracking-[0.5em]">Declared_Asset_Matrix</h4>
                        </div>
                        <div className="h-[1px] flex-1 bg-gradient-to-r from-white/5 via-white/10 to-transparent"></div>
                    </div>

                    <div className="mas-glass border-white/5 bg-[var(--color-bg-paper)]/60 backdrop-blur-3xl rounded-[32px] overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.4)] border border-white/10 relative">
                        <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none font-mono text-[100px] font-medium select-none">ASSET_MTRX</div>

                        <div className="p-10 space-y-6">
                            {equipmentList.map((item) => (
                                <motion.div
                                    key={item.id}
                                    whileHover={{ x: 6 }}
                                    className={`p-6 border group flex items-center justify-between transition-all duration-500 rounded-2xl relative overflow-hidden ${item.mismatch ? 'bg-primary/[0.03] border-primary/20 shadow-[0_0_30px_rgba(200,16,46,0.05)]' : 'bg-white/[0.01] border-white/5 hover:border-white/20'}`}
                                >
                                    <div className="flex items-center gap-8 relative z-10">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 border-2 ${item.mismatch ? 'bg-primary border-primary text-white shadow-[0_0_20px_var(--color-primary)] animate-pulse' : 'bg-[#0D0D0E] border-white/10 text-gray-300 group-hover:border-white/40'}`}>
                                            {item.mismatch ? <AlertTriangle size={20} strokeWidth={3} /> : <Check size={20} strokeWidth={4} />}
                                        </div>
                                        <div className="space-y-1">
                                            <p className={`text-sm font-medium tracking-widest transition-all duration-300 uppercase ${item.mismatch ? 'text-primary' : 'text-white'}`}>{item.name}</p>
                                            <div className="flex items-center gap-3">
                                                <span className="text-gray-300/30 text-[12px] font-medium uppercase tracking-widest">{item.category}</span>
                                                <span className="w-1 h-1 bg-white/10 rounded-full"></span>
                                                <span className="text-gray-300/30 text-[12px] font-mono tracking-widest uppercase">{item.sn}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6 relative z-10">
                                        <span className={`text-[13px] font-medium uppercase tracking-widest transition-all duration-300 ${item.mismatch ? 'text-primary animate-bounce' : 'text-gray-300/80 group-hover:text-white'}`}>{item.status}</span>
                                        <ChevronRight size={14} className="text-white/5 group-hover:text-primary transition-all" />
                                    </div>

                                    {item.mismatch && (
                                        <div className="absolute top-0 left-0 h-full bg-primary/5 animate-shimmer pointer-events-none"></div>
                                    )}
                                </motion.div>
                            ))}
                        </div>

                        {hasMismatch && (
                            <div className="mx-10 mb-10 p-8 bg-primary/10 border border-primary/20 rounded-2xl relative group/warning cursor-help">
                                <div className="absolute -inset-1 bg-primary/5 blur-lg opacity-50 group-hover/warning:opacity-100 transition-opacity"></div>
                                <div className="relative z-10 flex items-start gap-6">
                                    <div className="p-3 rounded-xl bg-primary text-white shadow-[0_0_20px_rgba(200,16,46,0.3)]">
                                        <ShieldAlert size={20} className="animate-pulse" />
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="text-white text-sm font-medium uppercase tracking-widest group-hover/warning:text-primary transition-colors">Asset_Mismatch_Protocol_Engaged</h4>
                                        <p className="text-gray-300/90 text-[13px] font-medium uppercase tracking-widest leading-6">
                                            Registered OPTICS_GEAR (SN-4310) not detected at exit node. Clearance restricted until incident reporting or manual verification.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Exit Integrity Protocol Matrix */}
                <div className="space-y-8">
                    <div className="flex items-center gap-6 px-4">
                        <div className="flex items-center gap-3">
                            <Activity size={14} className="text-primary" />
                            <h4 className="text-gray-300/30 uppercase text-[12px] font-medium tracking-[0.5em]">Integrity_Verification_Matrix</h4>
                        </div>
                        <div className="h-[1px] flex-1 bg-gradient-to-r from-white/5 via-white/10 to-transparent"></div>
                    </div>

                    <div className="mas-glass p-10 border-white/5 bg-[var(--color-bg-paper)]/40 backdrop-blur-3xl rounded-[32px] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.4)] border border-white/10 space-y-6">
                        {[
                            { id: 'equipment', label: 'Registered_Assets_Sync', desc: 'Secure physical audit match for all declared personnel units.' },
                            { id: 'noItems', label: 'Prohibited_Material_Sanitized', desc: 'Cross-check for unauthorized digital or physical company assets.' },
                            { id: 'clearance', label: 'Operational_Approval_Verified', desc: 'Confirm final exit clearance from the respective department node.' }
                        ].map((item) => {
                            const isAuth = authenticating === item.id;
                            const isChecked = checks[item.id];
                            return (
                                <motion.div
                                    key={item.id}
                                    whileHover={{ x: 6 }}
                                    onClick={() => toggleCheck(item.id)}
                                    className={`mas-glass p-6 border-white/5 bg-[var(--color-bg-paper)]/60 flex items-center justify-between cursor-pointer transition-all duration-500 rounded-2xl group relative overflow-hidden ${isChecked ? 'bg-primary/[0.04] border-primary/20' : 'hover:border-white/20'}`}
                                >
                                    <div className="flex gap-6 items-center relative z-10">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-700 border ${isChecked ? 'bg-primary border-primary text-white rotate-12 shadow-[0_0_20px_var(--color-primary)]' : 'bg-[#0D0D0E] border-white/10 text-gray-300 group-hover:border-white'}`}>
                                            {isAuth ? <RefreshCw size={18} className="animate-spin" /> : isChecked ? <Check size={20} strokeWidth={4} /> : <Zap size={18} />}
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-3">
                                                <p className={`text-[12px] font-medium tracking-widest transition-all duration-500 uppercase ${isChecked ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>{item.label}</p>
                                                {isAuth && <span className="text-primary text-[14px] font-medium animate-pulse tracking-[0.3em]">SYNCING...</span>}
                                            </div>
                                            <p className="text-gray-300/80 text-[12px] font-medium uppercase tracking-widest">{item.desc}</p>
                                        </div>
                                    </div>
                                    <div className={`w-1.5 h-6 rounded-full transition-all duration-700 ${isChecked ? 'bg-primary shadow-[0_0_8px_var(--color-primary)]' : 'bg-white/5'}`}></div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Exit Authorization Terminal */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <button className="group relative overflow-hidden w-full py-5 rounded-2xl border border-primary text-primary bg-transparent font-medium uppercase text-[14px] tracking-[0.4em] hover:bg-primary hover:text-white transition-all duration-700 flex items-center justify-center gap-4 shadow-xl active:scale-95">
                            <ShieldAlert size={18} strokeWidth={2.5} className="group-hover:rotate-12 transition-transform duration-500" />
                            Report_Breach
                        </button>
                        <button
                            disabled={!allChecked}
                            className={`group relative overflow-hidden w-full py-5 rounded-2xl font-medium uppercase text-[14px] tracking-[0.4em] flex items-center justify-center gap-4 transition-all duration-700 shadow-2xl active:scale-95 ${allChecked ? 'bg-primary text-white shadow-[0_0_50px_rgba(200,16,46,0.3)] cursor-pointer' : 'bg-white/5 text-white/10 border border-white/5 cursor-not-allowed opacity-70 grayscale'}`}
                        >
                            <Fingerprint size={18} strokeWidth={2.5} className={allChecked ? 'animate-pulse' : ''} />
                            Final_Clearance
                        </button>
                    </div>

                    {/* Guardian Node Log Footer */}
                    <div className="mas-glass p-8 border-primary/10 bg-[var(--color-bg-paper)]/60 backdrop-blur-3xl rounded-[28px] border text-center flex flex-col items-center gap-3 group/footer hover:border-primary/30 transition-all">
                        <div className="flex items-center gap-3">
                            <Lock size={12} className="text-primary animate-pulse" />
                            <span className="uppercase text-primary font-medium text-[13px] tracking-[0.4em]">Guardian_Node_Registry_Active</span>
                        </div>
                        <p className="text-gray-300/80 text-[12px] font-medium tracking-widest uppercase max-w-xs leading-5">
                            All exit telemetry recorded via Secure_Core_08. Transmission to MAS_Command encrypted and logged in vault_331.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExitVerificationMain;
