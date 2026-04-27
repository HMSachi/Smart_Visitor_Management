import React from 'react';
import { Users, UserPlus, X, CreditCard, Phone, User } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

const VisitorGroup = ({ visitors, onAdd, onRemove, onChange }) => {
    return (
        <section className="stagger-item">
            <div className="flex items-center justify-between mb-8">
                <div className="flex flex-col md:flex-row items-center gap-4 md:gap-3">
                    <div className="text-primary">
                        <Users size={16} />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-0">Visitor Group</h2>
                        <p className="text-gray-600 text-[12px] font-bold uppercase tracking-widest">Secondary Identification</p>
                    </div>
                </div>
                <button 
                    type="button" 
                    onClick={onAdd} 
                    className="flex flex-col md:flex-row items-center gap-4 md:gap-2 px-4 py-2 bg-primary/10 border border-primary/20 text-primary rounded-lg hover:bg-primary hover:text-white transition-all text-[12px] font-bold uppercase tracking-widest group"
                >
                    <UserPlus size={14} />
                    Add Node
                </button>
            </div>

            <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                    {visitors.map((visitor, index) => (
                        <div 
                            key={visitor.id}
                            className="relative grid grid-cols-1 md:grid-cols-3 gap-4 p-5 bg-white/[0.01] border border-white/5 rounded-xl transition-colors"
                        >
                            {visitors.length > 0 && (
                                <button 
                                    type="button" 
                                    onClick={() => onRemove(visitor.id)} 
                                    className="absolute top-2 right-2 p-1 text-gray-700 hover:text-primary transition-all"
                                >
                                    <X size={12} />
                                </button>
                            )}

                            <div className="space-y-1.5">
                                <label className="text-[12px] font-bold uppercase tracking-widest text-gray-600">Full Name</label>
                                <div className="relative">
                                    <User size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-800" />
                                    <input
                                        type="text"
                                        placeholder="Name"
                                        value={visitor.fullName}
                                        onChange={(event) => onChange(visitor.id, 'fullName', event.target.value)}
                                        className="compact-input pl-9"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[12px] font-bold uppercase tracking-widest text-gray-600">NIC / Passport</label>
                                <div className="relative">
                                    <CreditCard size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-800" />
                                    <input
                                        type="text"
                                        placeholder="ID"
                                        value={visitor.nic}
                                        onChange={(event) => onChange(visitor.id, 'nic', event.target.value)}
                                        className="compact-input pl-9"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[12px] font-bold uppercase tracking-widest text-gray-600">Contact</label>
                                <div className="relative">
                                    <Phone size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-800" />
                                    <input
                                        type="tel"
                                        placeholder="Mobile"
                                        value={visitor.contact}
                                        onChange={(event) => onChange(visitor.id, 'contact', event.target.value)}
                                        className="compact-input pl-9"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </AnimatePresence>

                {visitors.length === 0 && (
                    <div className="p-6 md:p-12 border-2 border-dashed border-white/5 rounded-xl flex flex-col items-center justify-center text-center">
                        <Users size={32} className="text-gray-800 mb-4" />
                        <p className="text-gray-600 text-[13px] font-bold uppercase tracking-widest mb-6 max-w-[200px] leading-relaxed">No secondary declarations in current protocol.</p>
                        <button 
                            type="button" 
                            onClick={onAdd}
                            className="px-6 py-2.5 bg-white/[0.03] border border-white/10 text-white text-[12px] font-bold uppercase tracking-widest rounded-lg hover:bg-primary hover:border-primary transition-all"
                        >
                            Declare Member
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default VisitorGroup;
