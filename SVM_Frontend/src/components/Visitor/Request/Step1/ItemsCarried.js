import React from 'react';
import { Package, Hash, Plus, X } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

const ItemsCarried = ({ items, onAdd, onRemove, onChange, isLight }) => {
    return (
        <section className="animate-fade-in stagger-item">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="text-primary">
                        <Package size={16} />
                    </div>
                    <h3 className={`text-sm font-bold uppercase tracking-[0.2em] mb-0 ${isLight ? "text-[#1A1A1A]" : "text-white"}`}>Items Carried</h3>
                </div>
                <button 
                    type="button" 
                    onClick={onAdd} 
                    className={`flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 text-primary rounded-none hover:bg-primary hover:text-white transition-all text-[12px] font-bold uppercase tracking-[0.2em] group`}
                >
                    <Plus size={14} className="group-hover:scale-110 transition-transform" />
                    Add Item
                </button>
            </div>

            <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                    {items.map((item, index) => (
                        <div 
                            key={item.id}
                            className="relative grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 pt-4 border-t border-white/5 first:border-0 first:pt-0"
                        >
                            <button 
                                type="button" 
                                onClick={() => onRemove(item.id)} 
                                className="absolute -right-2 top-0 p-2 text-gray-500 hover:text-primary transition-all md:top-6"
                                title="Remove Item"
                            >
                                <X size={16} />
                            </button>

                            {/* Item Name */}
                            <div className="space-y-2">
                                <label className="text-[12px] font-bold text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2 px-1">
                                    ITEM NAME
                                </label>
                                <div className="relative">
                                    <input 
                                        type="text"
                                        name="itemName"
                                        value={item.itemName}
                                        onChange={(e) => onChange(item.id, 'itemName', e.target.value)}
                                        placeholder="E.G. LAPTOP"
                                        className={`w-full rounded-none px-4 py-2.5 text-[12px] focus:outline-none transition-all font-medium ${
                                            isLight 
                                            ? "bg-white border border-gray-200 text-[#1A1A1A] focus:border-primary placeholder:text-gray-400" 
                                            : "bg-white/[0.03] border border-white/20 text-white/90 focus:border-primary/60 placeholder:text-gray-600"
                                        }`}
                                    />
                                </div>
                            </div>

                            {/* Quantity */}
                            <div className="space-y-2 pr-6 md:pr-8">
                                <label className="text-[12px] font-bold text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2 px-1">
                                    QUANTITY
                                </label>
                                <div className="relative">
                                    <input 
                                        type="number"
                                        name="quantity"
                                        min="1"
                                        value={item.quantity}
                                        onChange={(e) => onChange(item.id, 'quantity', e.target.value)}
                                        placeholder="E.G. 1"
                                        className={`w-full rounded-none px-4 py-2.5 text-[12px] focus:outline-none transition-all font-medium ${
                                            isLight 
                                            ? "bg-white border border-gray-200 text-[#1A1A1A] focus:border-primary placeholder:text-gray-400" 
                                            : "bg-white/[0.03] border border-white/20 text-white/90 focus:border-primary/60 placeholder:text-gray-600"
                                        }`}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </AnimatePresence>

                {items.length === 0 && (
                    <div className="p-8 border-2 border-dashed border-white/10 rounded-none flex flex-col items-center justify-center text-center mt-4">
                        <Package size={24} className="text-gray-600 mb-3" />
                        <p className="text-gray-500 text-[12px] font-bold uppercase tracking-[0.2em] mb-4">No items declared.</p>
                        <button 
                            type="button" 
                            onClick={onAdd}
                            className={`px-6 py-3 rounded-none font-bold uppercase tracking-[0.2em] text-[12px] transition-all ${
                                isLight 
                                ? "bg-white border border-primary/20 text-primary hover:bg-primary hover:text-white" 
                                : "bg-white/[0.03] border border-white/20 text-white hover:bg-primary hover:border-primary"
                            }`}
                        >
                            Add Item
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default ItemsCarried;
