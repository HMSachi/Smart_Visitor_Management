import React from 'react';

const EquipmentDeclaration = ({ items, onAdd, onRemove }) => {
    return (
        <section className="bg-white/[0.02] border border-white/5 p-12">
            <div className="flex items-center justify-between mb-12">
                <div className="flex items-center space-x-6">
                    <div className="w-8 h-[1px] bg-mas-red"></div>
                    <h2 className="text-xl font-display font-black text-white uppercase tracking-widest">Equipment Grid</h2>
                </div>
                <button type="button" onClick={onAdd} className="text-[10px] text-mas-red font-black uppercase tracking-widest hover:text-white transition-colors flex items-center">
                    <span className="text-lg mr-2">+</span> Add Item
                </button>
            </div>
            <div className="space-y-8">
                {items.map((item) => (
                    <div key={item.id} className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-8 border-b border-white/5 animate-slide-down relative">
                        <button type="button" onClick={() => onRemove(item.id)} className="absolute -top-4 -right-4 text-white/40 hover:text-mas-red transition-colors font-light text-[8px] uppercase tracking-widest">REMOVE ITEM ×</button>
                        <input type="text" placeholder="ITEM NAME" className="bg-transparent border border-white/10 p-4 text-white text-[11px] uppercase tracking-widest font-bold placeholder-gray-400" />
                        <input type="number" placeholder="QTY" className="bg-transparent border border-white/10 p-4 text-white text-[11px] placeholder-gray-400" />
                        <input type="text" placeholder="DESCRIPTION" className="md:col-span-2 bg-transparent border border-white/10 p-4 text-white text-[11px] font-light placeholder-gray-400" />
                    </div>
                ))}
                {items.length === 0 && <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] py-8 border-2 border-dashed border-white/5 text-center">No Equipment Declared</p>}
            </div>
        </section>
    );
};

export default EquipmentDeclaration;
