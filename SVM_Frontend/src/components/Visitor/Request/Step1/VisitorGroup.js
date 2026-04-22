import React from 'react';
import { Users, User, CreditCard, Phone, Plus, X } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

const VisitorGroup = ({ visitors, onAdd, onRemove, onChange }) => {
    return (
        <section className="animate-fade-in stagger-item">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="text-primary">
                        <Users size={16} />
                    </div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-[0.2em] mb-0">Visitor Group</h3>
                </div>
                <button 
                    type="button" 
                    onClick={onAdd} 
                    className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 text-primary rounded-none hover:bg-primary hover:text-white transition-all text-[11px] font-bold uppercase tracking-[0.2em] group"
                >
                    <Plus size={14} className="group-hover:scale-110 transition-transform" />
                    Add Visitor
                </button>
            </div>

            <div className="space-y-8">
                <AnimatePresence mode="popLayout">
                    {visitors.map((visitor, index) => (
                        <div 
                            key={visitor.id}
                            className="relative grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6 pt-6 border-t border-white/5 first:border-0 first:pt-0"
                        >
                            {visitors.length > 0 && (
                                <button 
                                    type="button" 
                                    onClick={() => onRemove(visitor.id)} 
                                    className="absolute -right-2 top-0 p-2 text-gray-500 hover:text-primary transition-all md:top-6"
                                    title="Remove Visitor"
                                >
                                    <X size={16} />
                                </button>
                            )}

                            {/* Full Name */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2 px-1">
                                    VISITOR NAME
                                </label>
                                <div className="relative">
                                    <input 
                                        type="text"
                                        name="fullName"
                                        value={visitor.fullName}
                                        onChange={(e) => onChange(visitor.id, 'fullName', e.target.value)}
                                        placeholder="E.G. JOHN DOE"
                                        className="w-full bg-white/[0.03] border border-white/20 rounded-none px-4 py-4 text-[13px] text-white/90 focus:outline-none focus:border-primary/60 transition-all placeholder:text-gray-600 font-medium"
                                    />
                                </div>
                            </div>

                            {/* NIC / Passport */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2 px-1">
                                    VISITOR NIC
                                </label>
                                <div className="relative">
                                    <input 
                                        type="text"
                                        name="nic"
                                        value={visitor.nic}
                                        onChange={(e) => onChange(visitor.id, 'nic', e.target.value)}
                                        placeholder="ENTER NIC / PASSPORT"
                                        className="w-full bg-white/[0.03] border border-white/20 rounded-none px-4 py-4 text-[13px] text-white/90 focus:outline-none focus:border-primary/60 transition-all placeholder:text-gray-600 font-medium"
                                    />
                                </div>
                            </div>

                            {/* Contact Number */}
                            <div className="space-y-2 pr-6 md:pr-8">
                                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2 px-1">
                                    PHONE NUMBER
                                </label>
                                <div className="relative">
                                    <input 
                                        type="tel"
                                        name="contact"
                                        value={visitor.contact}
                                        onChange={(e) => onChange(visitor.id, 'contact', e.target.value)}
                                        placeholder="E.G. +94 7X XXX XXXX"
                                        className="w-full bg-white/[0.03] border border-white/20 rounded-none px-4 py-4 text-[13px] text-white/90 focus:outline-none focus:border-primary/60 transition-all placeholder:text-gray-600 font-medium"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </AnimatePresence>

                {visitors.length === 0 && (
                    <div className="p-8 border-2 border-dashed border-white/10 rounded-none flex flex-col items-center justify-center text-center mt-4">
                        <Users size={24} className="text-gray-600 mb-3" />
                        <p className="text-gray-500 text-[11px] font-bold uppercase tracking-[0.2em] mb-4">No additional visitors.</p>
                        <button 
                            type="button" 
                            onClick={onAdd}
                            className="px-6 py-3 bg-white/[0.03] border border-white/20 text-white text-[11px] font-bold uppercase tracking-[0.2em] rounded-none hover:bg-primary hover:border-primary transition-all"
                        >
                            Add Visitor
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default VisitorGroup;
