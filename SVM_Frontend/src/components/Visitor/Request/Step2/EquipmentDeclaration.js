import React from 'react';
import { Package, Hash, Trash2, Plus, PencilLine } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

const EquipmentDeclaration = ({ items, onAdd, onRemove, onChange }) => {
    return (
        <section className="stagger-item">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="text-primary">
                        <Package size={16} />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-0">Asset Declaration</h2>
                        <p className="text-gray-600 text-[12px] font-bold uppercase tracking-widest">Hardware Inventory</p>
                    </div>
                </div>
                <button 
                    type="button" 
                    onClick={onAdd} 
                    className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 text-primary rounded-lg hover:bg-primary hover:text-white transition-all text-[12px] font-bold uppercase tracking-widest group"
                >
                    <Plus size={14} />
                    Declare Asset
                </button>
            </div>

            <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                    {items.map((item, index) => (
                        <div 
                            key={item.id}
                            className="relative bg-white/[0.01] border border-white/5 p-5 rounded-xl transition-colors"
                        >
                            <button 
                                type="button" 
                                onClick={() => onRemove(item.id)} 
                                className="absolute top-2 right-2 p-1 text-gray-700 hover:text-primary transition-all"
                            >
                                <Trash2 size={12} />
                            </button>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-5 md:gap-6">
                                <div className="space-y-2">
                                    <label className="text-[12px] font-bold uppercase tracking-widest text-gray-600 block">Asset Name</label>
                                    <div className="relative">
                                        <Package size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-800" />
                                        <input
                                            type="text"
                                            placeholder="Item"
                                            value={item.itemName}
                                            onChange={(event) => onChange(item.id, 'itemName', event.target.value)}
                                            className="compact-input w-full h-11 pl-9"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[12px] font-bold uppercase tracking-widest text-gray-600 block">Qty</label>
                                    <div className="relative">
                                        <Hash size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-800" />
                                        <input
                                            type="number"
                                            placeholder="0"
                                            min="1"
                                            value={item.quantity}
                                            onChange={(event) => onChange(item.id, 'quantity', event.target.value)}
                                            className="compact-input w-full h-11 pl-9"
                                        />
                                    </div>
                                </div>

                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-[12px] font-bold uppercase tracking-widest text-gray-600 block">Description</label>
                                    <div className="relative">
                                        <PencilLine size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-800" />
                                        <input
                                            type="text"
                                            placeholder="Description"
                                            value={item.description}
                                            onChange={(event) => onChange(item.id, 'description', event.target.value)}
                                            className="compact-input w-full h-11 pl-9"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </AnimatePresence>

                {items.length === 0 && (
                    <div className="p-6 md:p-12 border-2 border-dashed border-white/5 rounded-xl flex flex-col items-center justify-center text-center">
                        <Package size={32} className="text-gray-800 mb-4" />
                        <p className="text-gray-600 text-[13px] font-bold uppercase tracking-widest mb-6 max-w-[200px] leading-relaxed">No hardware assets declared in current protocol.</p>
                        <button 
                            type="button" 
                            onClick={onAdd}
                            className="px-6 py-2.5 bg-white/[0.03] border border-white/10 text-white text-[12px] font-bold uppercase tracking-widest rounded-lg hover:bg-primary hover:border-primary transition-all"
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
