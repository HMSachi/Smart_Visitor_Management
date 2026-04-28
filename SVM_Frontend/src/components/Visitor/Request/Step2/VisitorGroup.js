import React from 'react';
import { Users, Plus, X, CreditCard, Phone, User, Save, Edit2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const VisitorGroup = ({ visitors, onAdd, onRemove, onChange, onToggleConfirm }) => {
    return (
        <section className="animate-fade-in stagger-item pt-12 border-t border-white/5">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-8 bg-primary rounded-full" />
                    <div>
                        <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-0 flex items-center gap-2">
                            <Users size={16} className="text-primary" /> Additional Visitors
                        </h2>
                    </div>
                </div>
                <button 
                    type="button" 
                    onClick={onAdd} 
                    className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 text-primary rounded-none hover:bg-primary hover:text-white transition-all text-[10px] font-black uppercase tracking-[0.2em] group"
                >
                    <Plus size={14} />
                    Add Person
                </button>
            </div>

            <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                    {visitors.map((visitor) => (
                        <div 
                            key={visitor.id}
                            className={`relative grid grid-cols-1 md:grid-cols-12 gap-4 p-5 rounded-none border transition-all duration-300 ${
                                visitor.isConfirmed 
                                ? "bg-green-500/5 border-green-500/20" 
                                : "bg-white/[0.02] border-white/5"
                            }`}
                        >
                            <div className="md:col-span-4 space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Full Name</label>
                                <input
                                    type="text"
                                    placeholder="Name"
                                    disabled={visitor.isConfirmed}
                                    value={visitor.fullName}
                                    onChange={(e) => onChange(visitor.id, 'fullName', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-none px-4 py-2.5 text-[11px] text-white outline-none disabled:opacity-50"
                                />
                            </div>

                            <div className="md:col-span-3 space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">NIC / Passport</label>
                                <input
                                    type="text"
                                    placeholder="ID Number"
                                    disabled={visitor.isConfirmed}
                                    value={visitor.nic}
                                    onChange={(e) => onChange(visitor.id, 'nic', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-none px-4 py-2.5 text-[11px] text-white outline-none disabled:opacity-50"
                                />
                            </div>

                            <div className="md:col-span-3 space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Contact</label>
                                <input
                                    type="text"
                                    placeholder="07XXXXXXXX"
                                    disabled={visitor.isConfirmed}
                                    value={visitor.contact}
                                    onChange={(e) => onChange(visitor.id, 'contact', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-none px-4 py-2.5 text-[11px] text-white outline-none disabled:opacity-50"
                                />
                            </div>

                            <div className="md:col-span-2 flex items-end justify-end gap-1">
                                <button 
                                    type="button"
                                    onClick={() => onToggleConfirm(visitor.id)}
                                    className={`p-2.5 transition-all ${
                                        visitor.isConfirmed 
                                        ? "text-gray-500 hover:text-white" 
                                        : "text-primary hover:scale-110"
                                    }`}
                                >
                                    {visitor.isConfirmed ? <Edit2 size={16} /> : <Save size={18} />}
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => onRemove(visitor.id)} 
                                    className="p-2.5 text-gray-700 hover:text-red-500 transition-all"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </AnimatePresence>
            </div>
        </section>
    );
};

export default VisitorGroup;
