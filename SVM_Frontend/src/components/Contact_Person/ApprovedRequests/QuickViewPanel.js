import React from 'react';
import { X, User, MapPin, Calendar, Clock, ShieldCheck, QrCode, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const QuickViewPanel = ({ isOpen, onClose, visitor }) => {
    if (!visitor) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
                    />
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-full w-full max-w-lg bg-[#0F0F10] border-l border-primary/30 z-[101] shadow-2xl p-12 overflow-y-auto"
                    >
                        <div className="flex justify-between items-center mb-12">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-primary text-white">
                                    <ShieldCheck size={20} />
                                </div>
                                <div>
                                    <h3 className="uppercase">Approved Entry</h3>
                                    <p className="text-gray-300 uppercase">Ref: #{visitor.id}</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 text-gray-300 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="space-y-12">
                            <section>
                                <label className="text-primary uppercase mb-6 block">Visitor Credentials</label>
                                <div className="space-y-6">
                                    <div className="flex items-center gap-6 p-6 bg-white/[0.02] border border-white/5">
                                        <div className="w-12 h-12 bg-white/5 flex items-center justify-center rounded-none border border-white/10 text-gray-300">
                                            <User size={20} />
                                        </div>
                                        <div>
                                            <p className="text-gray-300 uppercase mb-1">Full Identity</p>
                                            <p className="uppercase text-white">{visitor.name}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-6 bg-white/[0.02] border border-white/5">
                                            <p className="text-gray-300 uppercase mb-2">Visit Date</p>
                                            <div className="flex items-center gap-2 text-white">
                                                <Calendar size={14} className="text-primary" />
                                                <span className="">{visitor.date}</span>
                                            </div>
                                        </div>
                                        <div className="p-6 bg-white/[0.02] border border-white/5">
                                            <p className="text-gray-300 uppercase mb-2">Check-In</p>
                                            <div className="flex items-center gap-2 text-white">
                                                <Clock size={14} className="text-primary" />
                                                <span className="">09:15 AM</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <label className="text-primary uppercase mb-6 block">Node Destination</label>
                                <div className="p-6 bg-white/[0.02] border border-white/5 flex items-center gap-4">
                                    <MapPin size={18} className="text-primary" />
                                    <span className="uppercase text-white">MAS Fabric Park - Unit 08A</span>
                                </div>
                            </section>

                            <section className="pt-8 border-t border-mas-border">
                                <div className="flex items-center justify-between mb-8">
                                    <span className="uppercase text-gray-300">Admin Authorization</span>
                                    <span className="text-green-500 uppercase flex items-center gap-2">
                                        <ShieldCheck size={14} />
                                        QR Token Generated
                                    </span>
                                </div>
                                
                                <div className="bg-white/[0.02] border border-white/5 p-8 flex flex-col items-center justify-center mb-8 relative group cursor-crosshair">
                                    {/* Scanning laser animation */}
                                    <div className="absolute top-8 left-1/2 -ml-20 w-40 h-0.5 bg-primary opacity-0 group-hover:opacity-100 animate-[scan_2s_ease-in-out_infinite] shadow-[0_0_10px_var(--color-primary)] z-10 pointer-events-none"></div>
                                    
                                    <div className="w-40 h-40 bg-white p-2 mb-4 relative">
                                        <QrCode className="w-full h-full text-black stroke-[1]" />
                                        {/* Corner brackets */}
                                        <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-primary"></div>
                                        <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-primary"></div>
                                        <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-primary"></div>
                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-primary"></div>
                                    </div>
                                    <p className="text-gray-300 uppercase text-xs tracking-widest mt-2 font-mono">NODE-TOKEN: {visitor.id}</p>
                                </div>

                                <button 
                                    onClick={() => alert(`QR Token and Entry Form securely dispatched to ${visitor.name}.`)}
                                    className="w-full py-5 bg-primary text-white uppercase shadow-[0_0_30px_rgba(200,16,46,0.3)] flex items-center justify-center gap-3 hover:bg-[var(--color-primary-hover)] hover:shadow-[0_0_40px_rgba(200,16,46,0.5)] transition-all transform active:scale-[0.98]"
                                >
                                    <Send size={18} />
                                    Forward QR & Form to Visitor
                                </button>
                            </section>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default QuickViewPanel;
