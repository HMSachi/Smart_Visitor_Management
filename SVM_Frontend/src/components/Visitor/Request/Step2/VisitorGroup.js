import React from 'react';
import { Users, Plus, X, Save, Edit2, Loader2 } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

const VisitorGroup = ({ visitors, allVisitors = [], onAdd, onRemove, onChange, onSave, savingId }) => {
    const handleNameChange = (id, value) => {
        onChange(id, 'fullName', value);
        
        // Find if the entered name matches a known visitor for autocomplete
        const matchedVisitor = allVisitors.find(v => 
            v.VV_Name?.trim().toLowerCase() === value?.trim().toLowerCase()
        );
        if (matchedVisitor) {
            // Auto-fill NIC and Contact if matched
            if (matchedVisitor.VV_NIC_Passport_NO) {
                onChange(id, 'nic', matchedVisitor.VV_NIC_Passport_NO);
            }
            if (matchedVisitor.VV_Phone) {
                onChange(id, 'contact', matchedVisitor.VV_Phone);
            } else if (matchedVisitor.VV_Designation && matchedVisitor.VV_Designation !== 'N/A') {
                 // Fallback to designation if phone number is not available
                onChange(id, 'contact', matchedVisitor.VV_Designation);
            }
        }
    };

    return (
        <section className="animate-fade-in stagger-item pt-12 border-t border-white/5">
            {/* Global datalist for visitor names */}
            <datalist id="visitor-names">
                {allVisitors.map((v, idx) => (
                    <option key={`${v.VV_Visitor_id}-${idx}`} value={v.VV_Name}>
                        {v.VV_NIC_Passport_NO ? `ID: ${v.VV_NIC_Passport_NO}` : ''}
                    </option>
                ))}
            </datalist>

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
                                    ? 'bg-green-500/5 border-green-500/20'
                                    : 'bg-white/[0.02] border-white/5'
                            }`}
                        >
                            <div className="md:col-span-4 space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Full Name</label>
                                <input
                                    type="text"
                                    placeholder="Name"
                                    list="visitor-names"
                                    disabled={visitor.isConfirmed}
                                    value={visitor.fullName}
                                    onChange={(e) => handleNameChange(visitor.id, e.target.value)}
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
                                    maxLength={12}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        onChange(visitor.id, 'nic', val);
                                    }}
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
                                    maxLength={10}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
                                        onChange(visitor.id, 'contact', val);
                                    }}
                                    className="w-full bg-white/5 border border-white/10 rounded-none px-4 py-2.5 text-[11px] text-white outline-none disabled:opacity-50"
                                />
                            </div>

                            <div className="md:col-span-2 flex items-end justify-end gap-1">
                                <button
                                    type="button"
                                    onClick={() => onSave(visitor.id)}
                                    disabled={savingId === visitor.id}
                                    title={visitor.isConfirmed ? 'Edit Visitor' : 'Save Visitor'}
                                    className={`p-2.5 transition-all disabled:opacity-50 ${
                                        visitor.isConfirmed
                                            ? 'text-green-400 hover:text-white'
                                            : 'text-primary hover:scale-110'
                                    }`}
                                >
                                    {savingId === visitor.id
                                        ? <Loader2 size={18} className="animate-spin" />
                                        : visitor.isConfirmed
                                            ? <Edit2 size={16} />
                                            : <Save size={18} />
                                    }
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
