import React, { useState, useEffect } from 'react';
import { Check, X, AlertCircle, Info, ChevronRight, MessageSquare, Shield, Activity, User, Fingerprint, Camera, Package, Car, FileCheck, Zap, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ApprovalChecklist = ({ visitor, onBack }) => {
    const displayVisitor = visitor || { name: 'JOHN DOE', type: 'Staff_Visitor', id: 'VER-SYNC-4291', time: '12:34:02 PM', nodeOrigin: 'Reception_01', initials: 'JD' };
    const [checks, setChecks] = useState({
        identity: false,
        vehicle: false,
        equipment: false
    });
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [authenticating, setAuthenticating] = useState(null);

    const toggleCheck = (id) => {
        if (!checks[id]) {
            setAuthenticating(id);
            setTimeout(() => {
                setChecks(prev => ({ ...prev, [id]: true }));
                setAuthenticating(null);
            }, 1000);
        } else {
            setChecks(prev => ({ ...prev, [id]: false }));
        }
    };

    const allChecked = Object.values(checks).every(v => v);

    return (
        <div className="max-w-4xl mx-auto w-full py-12 space-y-12">
            {/* Back Button */}
            <div className="mb-2 flex justify-start">
                <button 
                    onClick={onBack}
                    className="px-5 py-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-gray-300 hover:text-white hover:border-white/30 transition-all flex items-center gap-3 text-[13px] font-medium uppercase tracking-widest group"
                >
                    <ChevronRight size={14} className="group-hover:-translate-x-1 transition-transform rotate-180" /> Back to Profile Sync
                </button>
            </div>

            {/* Personnel Authorization Identity Card */}
            <div className="relative group">
                <div className="mas-glass p-8 md:p-10 border-white/5 bg-[#121214]/60 backdrop-blur-3xl rounded-[32px] shadow-[0_30px_60px_rgba(0,0,0,0.6)] border border-white/10 overflow-hidden hover:border-mas-red/20 transition-all duration-700">
                    <div className="flex flex-col md:flex-row items-center gap-10 md:gap-14">
                        {/* Profile/Biometric Node */}
                        <div className="relative">
                            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-mas-red flex items-center justify-center text-white text-2xl font-medium shadow-[0_0_30px_rgba(200,16,46,0.2)] border border-white/10 relative z-10 group-hover:rotate-6 transition-transform duration-700">
                                {displayVisitor.initials}
                            </div>
                            <div className="absolute -bottom-1 -right-1 p-2 bg-[#0D0D0E] rounded-xl border border-white/10 shadow-xl z-20">
                                <Fingerprint size={14} className="text-mas-red animate-pulse" />
                            </div>
                        </div>

                        <div className="flex-1 space-y-6 text-center md:text-left">
                            <div className="space-y-2">
                                <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
                                    <div className="px-2 py-0.5 rounded-md bg-mas-red/10 border border-mas-red/20 text-mas-red text-[14px] font-medium tracking-widest uppercase">{displayVisitor.type}</div>
                                    <div className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-gray-300 text-[14px] font-medium tracking-widest uppercase">Sync: Verified</div>
                                </div>
                                <h3 className="text-white text-3xl md:text-4xl font-bold uppercase tracking-widest group-hover:text-mas-red transition-colors duration-500">{displayVisitor.name}</h3>
                                <p className="text-gray-300/80 uppercase text-[13px] font-medium tracking-[0.4em] mt-1 underline decoration-mas-red/20 underline-offset-4">Ref: {displayVisitor.id}</p>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-4 border-t border-white/5">
                                <div className="space-y-1">
                                    <p className="text-gray-300/80 text-[7px] font-medium uppercase tracking-widest">Access_Log</p>
                                    <p className="text-white text-[14px] font-mono font-medium">{displayVisitor.time}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-gray-300/80 text-[7px] font-medium uppercase tracking-widest">Node_Origin</p>
                                    <p className="text-white text-[14px] font-medium uppercase">{displayVisitor.nodeOrigin.split('_')[0]}</p>
                                </div>
                                <div className="hidden md:block space-y-1">
                                    <p className="text-gray-300/80 text-[7px] font-medium uppercase tracking-widest">Encryption</p>
                                    <div className="flex items-center gap-1.5">
                                        <Lock size={8} className="text-mas-red" />
                                        <span className="text-white text-[12px] font-medium tracking-widest">SECURED</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Decorative corner ID element */}
                    <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none font-mono text-[100px] font-medium select-none">{displayVisitor.id.split('-').pop()}</div>
                </div>
            </div>

            {/* Authorization Matrix Protocol */}
            <div className="space-y-8">
                <div className="flex items-center gap-6 px-4">
                    <div className="flex items-center gap-3">
                        <Shield size={14} className="text-mas-red" />
                        <h4 className="text-gray-300/30 uppercase text-[12px] font-medium tracking-[0.5em]">Verification_Protocol_Matrix</h4>
                    </div>
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-white/5 via-white/10 to-transparent"></div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {[
                        { id: 'identity', label: 'Identity_Signature_Match', desc: 'Secure verification of NIC/Passport biometric signature.', icon: Camera },
                        { id: 'vehicle', label: 'Vehicle_Authorization_Check', desc: 'Spatially verify license plate against authorized entry manifest.', icon: Car },
                        { id: 'equipment', label: 'Asset_Integrity_Audit', desc: 'Authenticate all carry-on items with declared asset registry.', icon: Package }
                    ].map((item) => {
                        const isAuth = authenticating === item.id;
                        const isChecked = checks[item.id];
                        return (
                            <motion.div
                                key={item.id}
                                whileHover={{ x: 6 }}
                                onClick={() => toggleCheck(item.id)}
                                className={`mas-glass p-6 md:p-8 border-white/5 bg-[#121214]/40 flex items-center justify-between cursor-pointer transition-all duration-500 rounded-[28px] group relative overflow-hidden ${isChecked ? 'bg-mas-red/[0.04] border-mas-red/20' : 'hover:border-white/20'}`}
                            >
                                <div className="flex gap-8 items-center relative z-10">
                                    <div className="relative">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-700 border ${isChecked ? 'bg-mas-red border-mas-red text-white rotate-12 shadow-[0_0_20px_#C8102E]' : 'bg-[#0D0D0E] border-white/10 text-gray-300 group-hover:border-white'}`}>
                                            {isAuth ? <Activity size={18} className="animate-spin" /> : isChecked ? <Check size={20} strokeWidth={4} /> : <item.icon size={18} />}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3">
                                            <p className={`text-[13px] font-medium tracking-widest transition-all duration-500 uppercase ${isChecked ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>{item.label}</p>
                                            {isAuth && <span className="text-mas-red text-[7px] font-medium animate-pulse tracking-[0.3em]">PROCESSING...</span>}
                                        </div>
                                        <p className="text-gray-300/80 text-[12px] font-medium uppercase tracking-widest">{item.desc}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 relative z-10 px-4">
                                    <div className={`w-1.5 h-6 rounded-full transition-all duration-700 ${isChecked ? 'bg-mas-red shadow-[0_0_8px_#C8102E]' : 'bg-white/5'}`}></div>
                                    <Info size={14} className="text-gray-300/10 group-hover:text-gray-300 transition-colors" />
                                </div>

                                {/* Internal Scanning Visualizer */}
                                {isAuth && (
                                    <motion.div
                                        className="absolute top-0 left-0 h-full bg-mas-red/10 group-hover:bg-mas-red/20 pointer-events-none"
                                        animate={{ width: ['0%', '100%'] }}
                                        transition={{ duration: 1, ease: "easeInOut" }}
                                    />
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Tactical Action Terminal */}
            <div className="pt-12 grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-white/5">
                <button
                    onClick={() => setShowRejectModal(true)}
                    className="group relative overflow-hidden w-full py-5 rounded-xl border border-mas-red text-mas-red bg-transparent font-medium uppercase text-[14px] tracking-[0.4em] hover:bg-mas-red hover:text-white transition-all duration-700 flex items-center justify-center gap-4 shadow-xl active:scale-95"
                >
                    <X size={16} strokeWidth={4} className="group-hover:rotate-90 transition-transform duration-500" />
                    Protocol_Refusal
                </button>
                <button
                    disabled={!allChecked}
                    className={`group relative overflow-hidden w-full py-5 rounded-xl font-medium uppercase text-[14px] tracking-[0.4em] flex items-center justify-center gap-4 transition-all duration-700 shadow-2xl active:scale-95 ${allChecked ? 'bg-mas-red text-white shadow-[0_0_50px_rgba(200,16,46,0.3)] cursor-pointer' : 'bg-white/5 text-white/10 border border-white/5 cursor-not-allowed opacity-70 grayscale'}`}
                >
                    <Check size={16} strokeWidth={4} />
                    Grant_Authorization
                </button>
            </div>

            {/* Final Clearance Terminal (Rejection Modal) */}
            <AnimatePresence>
                {showRejectModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-8">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/90 backdrop-blur-md"
                            onClick={() => setShowRejectModal(false)}
                        ></motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 50, rotateX: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 50, rotateX: 20 }}
                            transition={{ type: "spring", damping: 20 }}
                            className="relative mas-glass max-w-2xl w-full p-12 md:p-16 border-mas-red bg-[#0D0D0E]/95 backdrop-blur-3xl rounded-[40px] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.8)] border border-mas-red/40"
                        >
                            {/* Terminal Scanline */}
                            <div className="absolute top-0 left-0 w-full h-[1px] bg-mas-red animate-scan z-20 opacity-80"></div>

                            <div className="space-y-12 relative z-10">
                                <div className="flex items-center gap-8">
                                    <div className="p-5 rounded-2xl bg-mas-red text-white shadow-[0_0_30px_rgba(200,16,46,0.4)] rotate-3">
                                        <AlertCircle size={28} strokeWidth={2.5} />
                                    </div>
                                    <div>
                                        <h3 className="text-white text-3xl font-bold uppercase tracking-[0.3em]">Protocol_Refusal</h3>
                                        <p className="text-mas-red uppercase text-[13px] font-medium tracking-[0.5em] mt-2 animate-pulse">Initializing_Refusal_Circuit...</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center justify-between px-4">
                                        <label className="text-gray-300/80 uppercase text-[12px] font-medium tracking-[0.4em]">Breach_Description_Input</label>
                                        <MessageSquare size={14} className="text-mas-red opacity-50" />
                                    </div>
                                    <div className="relative group">
                                        <textarea
                                            value={rejectionReason}
                                            onChange={(e) => setRejectionReason(e.target.value)}
                                            placeholder="ENTER_PROTOCOL_BREACH_DETAILS_HERE..."
                                            className="w-full min-h-[200px] bg-white/[0.02] border-2 border-white/10 rounded-3xl p-8 text-white uppercase font-mono text-sm tracking-widest placeholder:text-white/5 focus:border-mas-red/50 focus:bg-mas-red/[0.02] outline-none transition-all duration-500 resize-none"
                                        ></textarea>
                                        <div className="absolute bottom-4 right-6 text-gray-300/10 text-[14px] font-medium tracking-widest group-hover:text-mas-red/40 transition-colors">TERMINAL_REF: ERR_PROT_404</div>
                                    </div>
                                </div>

                                <div className="flex flex-col md:flex-row gap-6">
                                    <button
                                        onClick={() => setShowRejectModal(false)}
                                        className="flex-1 py-5 rounded-2xl bg-white/[0.02] border border-white/10 text-gray-300 uppercase text-[14px] font-medium tracking-[0.4em] hover:text-white hover:bg-white/5 transition-all duration-300"
                                    >
                                        Abort_Refusal
                                    </button>
                                    <button
                                        disabled={!rejectionReason}
                                        className="flex-[2] py-5 rounded-2xl bg-mas-red text-white uppercase text-[14px] font-medium tracking-[0.4em] shadow-[0_0_40px_rgba(200,16,46,0.4)] disabled:opacity-30 disabled:grayscale transition-all duration-500 hover:scale-[1.02] active:scale-95"
                                    >
                                        Confirm_System_Refusal
                                    </button>
                                </div>
                            </div>

                            {/* Background decoration */}
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-mas-red/5 rounded-full blur-[60px] pointer-events-none"></div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ApprovalChecklist;
