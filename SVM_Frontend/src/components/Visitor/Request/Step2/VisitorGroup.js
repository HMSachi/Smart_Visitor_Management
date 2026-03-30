import React from 'react';
import { Users, UserPlus, X, CreditCard, Phone, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const VisitorGroup = ({ visitors, onAdd, onRemove, onChange }) => {
    return (
        <section className="animate-fade-in stagger-item">
            <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-mas-red/10 border border-mas-red/20 text-mas-red">
                        <Users size={20} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-white uppercase tracking-tight">Visitor Group</h2>
                        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em]">Secondary Node Identification</p>
                    </div>
                </div>
                <button 
                    type="button" 
                    onClick={onAdd} 
                    className="flex items-center gap-2 px-5 py-3 bg-mas-red/10 border border-mas-red/20 text-mas-red rounded-xl hover:bg-mas-red hover:text-white transition-all text-[10px] font-black uppercase tracking-widest group"
                >
                    <UserPlus size={16} className="group-hover:scale-110 transition-transform" />
                    Add Node
                </button>
            </div>

            <div className="space-y-6">
                <AnimatePresence mode="popLayout">
                    {visitors.map((visitor, index) => (
                        <motion.div 
                            key={visitor.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            layout
                            className="relative grid grid-cols-1 md:grid-cols-3 gap-6 p-8 bg-white/[0.02] border border-white/5 rounded-[2rem] hover:border-white/10 transition-colors"
                        >
                            {visitors.length > 0 && (
                                <button 
                                    type="button" 
                                    onClick={() => onRemove(visitor.id)} 
                                    className="absolute -top-3 -right-3 w-8 h-8 flex items-center justify-center bg-mas-dark-800 border border-white/10 text-gray-500 hover:text-mas-red hover:border-mas-red/40 rounded-full transition-all shadow-xl z-10"
                                >
                                    <X size={14} />
                                </button>
                            )}

                            {/* Node Label */}
                            <div className="absolute top-4 left-6 flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-mas-red/40 animate-pulse" />
                                <span className="text-[8px] font-bold text-gray-600 uppercase tracking-[0.3em]">Node 0{index + 1}</span>
                            </div>

                            <div className="space-y-3 pt-4">
                                <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 block">Full Name</label>
                                <div className="relative">
                                    <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700" />
                                    <input
                                        type="text"
                                        placeholder="Enter Name"
                                        value={visitor.fullName}
                                        onChange={(event) => onChange(visitor.id, 'fullName', event.target.value)}
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-white text-xs focus:outline-none focus:border-mas-red/40 transition-all placeholder-gray-700"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3 pt-4">
                                <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 block">NIC / Passport</label>
                                <div className="relative">
                                    <CreditCard size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700" />
                                    <input
                                        type="text"
                                        placeholder="ID Number"
                                        value={visitor.nic}
                                        onChange={(event) => onChange(visitor.id, 'nic', event.target.value)}
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-white text-xs focus:outline-none focus:border-mas-red/40 transition-all placeholder-gray-700"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3 pt-4">
                                <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 block">Contact</label>
                                <div className="relative">
                                    <Phone size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700" />
                                    <input
                                        type="tel"
                                        placeholder="Mobile"
                                        value={visitor.contact}
                                        onChange={(event) => onChange(visitor.id, 'contact', event.target.value)}
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-white text-xs focus:outline-none focus:border-mas-red/40 transition-all placeholder-gray-700"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {visitors.length === 0 && (
                    <div className="p-16 border-2 border-dashed border-white/5 rounded-[2.5rem] flex flex-col items-center justify-center text-center group hover:border-mas-red/20 transition-all">
                        <Users size={40} className="text-gray-800 mb-6 group-hover:text-mas-red/20 transition-colors" />
                        <p className="text-gray-600 text-[10px] font-bold uppercase tracking-[0.2em] mb-8 max-w-[200px] leading-relaxed">No secondary visitors declared in current protocol.</p>
                        <button 
                            type="button" 
                            onClick={onAdd}
                            className="px-8 py-4 bg-white/[0.03] border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-mas-red hover:border-mas-red transition-all"
                        >
                            Declare Visitor
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default VisitorGroup;
