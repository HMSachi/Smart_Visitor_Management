import React from 'react';
import { Package, Hash, Trash2, Plus, PencilLine } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const EquipmentDeclaration = ({ items, onAdd, onRemove, onChange }) => {
    return (
        <section className="animate-fade-in stagger-item">
            <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-mas-red/10 border border-mas-red/20 text-mas-red">
                        <Package size={20} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-white uppercase tracking-tight">Asset Declaration</h2>
                        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em]">Equipment & Hardware Inventory</p>
                    </div>
                </div>
                <button 
                    type="button" 
                    onClick={onAdd} 
                    className="flex items-center gap-2 px-5 py-3 bg-mas-red/10 border border-mas-red/20 text-mas-red rounded-xl hover:bg-mas-red hover:text-white transition-all text-[10px] font-black uppercase tracking-widest group"
                >
                    <Plus size={16} className="group-hover:rotate-90 transition-transform" />
                    Declare Asset
                </button>
            </div>

            <div className="space-y-6">
                <AnimatePresence mode="popLayout">
                    {items.map((item, index) => (
                        <motion.div 
                            key={item.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            layout
                            className="relative bg-white/[0.02] border border-white/5 p-8 rounded-[2rem] hover:border-white/10 transition-colors"
                        >
                            <button 
                                type="button" 
                                onClick={() => onRemove(item.id)} 
                                className="absolute -top-3 -right-3 w-8 h-8 flex items-center justify-center bg-mas-dark-800 border border-white/10 text-gray-500 hover:text-mas-red hover:border-mas-red/40 rounded-full transition-all shadow-xl z-10"
                            >
                                <Trash2 size={14} />
                            </button>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 block">Asset Name</label>
                                    <div className="relative">
                                        <Package size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700" />
                                        <input
                                            type="text"
                                            placeholder="Item Name"
                                            value={item.itemName}
                                            onChange={(event) => onChange(item.id, 'itemName', event.target.value)}
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-white text-xs focus:outline-none focus:border-mas-red/40 transition-all placeholder-gray-700"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 block">Quantity</label>
                                    <div className="relative">
                                        <Hash size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700" />
                                        <input
                                            type="number"
                                            placeholder="Qty"
                                            min="1"
                                            value={item.quantity}
                                            onChange={(event) => onChange(item.id, 'quantity', event.target.value)}
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-white text-xs focus:outline-none focus:border-mas-red/40 transition-all placeholder-gray-700"
                                        />
                                    </div>
                                </div>

                                <div className="md:col-span-2 space-y-3">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 block">Specifications / Description</label>
                                    <div className="relative">
                                        <PencilLine size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700" />
                                        <input
                                            type="text"
                                            placeholder="Serial numbers, purpose, etc."
                                            value={item.description}
                                            onChange={(event) => onChange(item.id, 'description', event.target.value)}
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-white text-xs focus:outline-none focus:border-mas-red/40 transition-all placeholder-gray-700"
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {items.length === 0 && (
                    <div className="p-16 border-2 border-dashed border-white/5 rounded-[2.5rem] flex flex-col items-center justify-center text-center group hover:border-mas-red/20 transition-all">
                        <Package size={40} className="text-gray-800 mb-6 group-hover:text-mas-red/20 transition-colors" />
                        <p className="text-gray-600 text-[10px] font-bold uppercase tracking-[0.2em] mb-8 max-w-[200px] leading-relaxed">No hardware assets declared in current protocol.</p>
                        <button 
                            type="button" 
                            onClick={onAdd}
                            className="px-8 py-4 bg-white/[0.03] border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-mas-red hover:border-mas-red transition-all"
                        >
                            Log Asset
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default EquipmentDeclaration;
