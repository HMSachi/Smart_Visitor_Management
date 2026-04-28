import React from 'react';
import { Package, Hash, Plus, PencilLine, X, Save, Edit2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const EquipmentDeclaration = ({ items, onAdd, onRemove, onChange, onToggleConfirm }) => {
    return (
        <section className="animate-fade-in stagger-item pt-12 border-t border-white/5">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-8 bg-primary rounded-full" />
                    <div>
                        <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-0 flex items-center gap-2">
                            <Package size={16} className="text-primary" /> Items to Bring
                        </h2>
                    </div>
                </div>
                <button 
                    type="button" 
                    onClick={onAdd} 
                    className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 text-primary rounded-none hover:bg-primary hover:text-white transition-all text-[10px] font-black uppercase tracking-[0.2em] group"
                >
                    <Plus size={14} />
                    Add Item
                </button>
            </div>

            <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                    {items.map((item) => (
                        <div 
                            key={item.id}
                            className={`relative grid grid-cols-1 md:grid-cols-12 gap-4 p-5 rounded-none border transition-all duration-300 ${
                                item.isConfirmed 
                                ? "bg-green-500/5 border-green-500/20" 
                                : "bg-white/[0.02] border-white/5"
                            }`}
                        >
                            <div className="md:col-span-4 space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Item</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Laptop"
                                    disabled={item.isConfirmed}
                                    value={item.itemName}
                                    onChange={(e) => onChange(item.id, 'itemName', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-none px-4 py-2.5 text-[11px] text-white outline-none disabled:opacity-50"
                                />
                            </div>

                            <div className="md:col-span-2 space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Qty</label>
                                <input
                                    type="text"
                                    placeholder="e.g. 1"
                                    disabled={item.isConfirmed}
                                    value={item.quantity}
                                    onChange={(e) => onChange(item.id, 'quantity', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-none px-4 py-2.5 text-[11px] text-white outline-none disabled:opacity-50"
                                />
                            </div>

                            <div className="md:col-span-4 space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Description</label>
                                <input
                                    type="text"
                                    placeholder="Details or Serial No"
                                    disabled={item.isConfirmed}
                                    value={item.description}
                                    onChange={(e) => onChange(item.id, 'description', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-none px-4 py-2.5 text-[11px] text-white outline-none disabled:opacity-50"
                                />
                            </div>

                            <div className="md:col-span-2 flex items-end justify-end gap-1">
                                <button 
                                    type="button"
                                    onClick={() => onToggleConfirm(item.id)}
                                    className={`p-2.5 transition-all ${
                                        item.isConfirmed 
                                        ? "text-gray-500 hover:text-white" 
                                        : "text-primary hover:scale-110"
                                    }`}
                                >
                                    {item.isConfirmed ? <Edit2 size={16} /> : <Save size={18} />}
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => onRemove(item.id)} 
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

export default EquipmentDeclaration;
