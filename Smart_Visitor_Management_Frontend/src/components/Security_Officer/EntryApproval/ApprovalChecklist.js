import React, { useState } from 'react';
import { Check, X, ShieldCheck, AlertCircle, Info, ChevronRight, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ApprovalChecklist = () => {
    const [checks, setChecks] = useState({
        identity: false,
        vehicle: false,
        equipment: false
    });
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');

    const toggleCheck = (id) => {
        setChecks(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const allChecked = Object.values(checks).every(v => v);

    return (
        <div className="max-w-4xl mx-auto w-full py-12 space-y-12">
            {/* Summary Card */}
            <div className="mas-glass p-8 border-white/5 bg-white/[0.01] flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <div className="w-16 h-16 bg-mas-red flex items-center justify-center text-white shadow-[0_0_20px_rgba(200,16,46,0.3)]">
                        JD
                    </div>
                    <div>
                        <h3 className="uppercase text-white mb-2">John Doe</h3>
                        <p className="text-mas-text-dim uppercase">Ref: VER-SYNC-4291 | VIS-01</p>
                    </div>
                </div>
                <div className="flex items-center gap-8 pr-8">
                    <div className="text-right">
                        <p className="text-mas-text-dim uppercase mb-1">Time Logged</p>
                        <p className="text-white">12:34:02</p>
                    </div>
                    <ChevronRight className="text-mas-text-dim" size={20} />
                </div>
            </div>

            {/* Checklist Section */}
            <div className="space-y-6">
                <h4 className="text-mas-red uppercase px-2">Verification Protocol Checklist</h4>
                
                <div className="grid grid-cols-1 gap-4">
                    {[
                        { id: 'identity', label: 'Personnel Identity Verified', desc: 'NIC/Passport matches physical person and Step 2 record.' },
                        { id: 'vehicle', label: 'Vehicle Number Synchronized', desc: 'Physical license plate matches authorized entry manifest.' },
                        { id: 'equipment', label: 'Equipment List Authenticated', desc: 'All carry-on items match the declared asset registry.' }
                    ].map((item) => (
                        <div 
                            key={item.id}
                            onClick={() => toggleCheck(item.id)}
                            className={`mas-glass p-8 border-mas-border flex items-center justify-between cursor-pointer transition-all hover:bg-white/[0.03] active:scale-[0.99] ${checks[item.id] ? 'bg-mas-red/[0.03] border-mas-red shadow-[inset_0_0_30px_rgba(200,16,46,0.05)]' : ''}`}
                        >
                            <div className="flex gap-8 items-center">
                                    <div className={`w-8 h-8 flex items-center justify-center border transition-all ${checks[item.id] ? 'bg-mas-red border-mas-red text-white' : 'bg-black border-white/20 text-mas-text-dim group-hover:border-white'}`}>
                                        {checks[item.id] && <Check size={16} strokeWidth={4} />}
                                    </div>
                                    <div>
                                        <p className={`uppercase transition-colors ${checks[item.id] ? 'text-white' : 'text-mas-text-dim hover:text-white'}`}>{item.label}</p>
                                        <p className="text-mas-text-dim uppercase mt-1">{item.desc}</p>
                                    </div>
                            </div>
                            <Info size={14} className="text-mas-text-dim opacity-30" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-12 grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-mas-border">
                <button 
                    onClick={() => setShowRejectModal(true)}
                    className="w-full py-5 border-2 border-mas-red text-mas-red uppercase hover:bg-mas-red hover:text-white transition-all flex items-center justify-center gap-4"
                >
                    <X size={18} strokeWidth={3} />
                    Reject Entry
                </button>
                <button 
                    disabled={!allChecked}
                    className={`w-full py-5 uppercase flex items-center justify-center gap-4 transition-all ${allChecked ? 'bg-mas-red text-white shadow-[0_0_50px_rgba(200,16,46,0.3)] hover:scale-[1.02]' : 'bg-white/5 text-white/20 border border-white/5 cursor-not-allowed'}`}
                >
                    <Check size={18} strokeWidth={3} />
                    Approve Entry
                </button>
            </div>

            {/* Rejection Modal */}
            <AnimatePresence>
                {showRejectModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-8">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/95 backdrop-blur-sm"
                            onClick={() => setShowRejectModal(false)}
                        ></motion.div>
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative mas-glass max-w-lg w-full p-12 border-mas-red bg-mas-black overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-mas-red"></div>
                            <div className="space-y-8">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-mas-red text-white">
                                        <AlertCircle size={20} />
                                    </div>
                                    <div>
                                        <h3 className="uppercase text-white">Entry Refusal</h3>
                                        <p className="text-mas-text-dim uppercase mt-1">Initiating Rejection Protocol</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between px-2">
                                        <label className="text-mas-text-dim uppercase">Reason for Rejection</label>
                                        <MessageSquare size={12} className="text-mas-red" />
                                    </div>
                                    <textarea 
                                        value={rejectionReason}
                                        onChange={(e) => setRejectionReason(e.target.value)}
                                        placeholder="DESCRIBE PROTOCOL BREACH IN DETAIL..."
                                        className="mas-input w-full min-h-[150px] bg-white/[0.02] border-white/10 p-6 uppercase placeholder:text-white/10"
                                    ></textarea>
                                </div>

                                <div className="flex gap-4">
                                    <button 
                                        onClick={() => setShowRejectModal(false)}
                                        className="flex-1 py-4 mas-glass border-white/5 text-mas-text-dim uppercase hover:text-white transition-all appearance-none"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        disabled={!rejectionReason}
                                        className="flex-1 py-4 bg-mas-red text-white uppercase shadow-[0_0_30px_rgba(200,16,46,0.3)] disabled:opacity-50 appearance-none"
                                    >
                                        Confirm Rejection
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ApprovalChecklist;
