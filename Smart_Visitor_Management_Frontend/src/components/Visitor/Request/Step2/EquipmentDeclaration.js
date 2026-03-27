import React from 'react';

const EquipmentDeclaration = ({ items, onAdd, onRemove, onChange }) => {
    return (
        <section className="bg-white/[0.02] border border-white/5 p-12">
            <div className="flex items-center justify-between mb-12">
                <div className="flex items-center space-x-6">
                    <div className="w-8 h-[1px] bg-mas-red"></div>
                    <h2 className="text-white uppercase">Equipment Grid</h2>
                </div>
                <button type="button" onClick={onAdd} className="text-mas-red uppercase hover:text-white transition-colors flex items-center">
                    <span className="mr-2">+</span> Add Item
                </button>
            </div>
            <div className="space-y-8">
                {items.map((item) => (
                    <div key={item.id} className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-8 border-b border-white/5 animate-slide-down relative">
                        <button type="button" onClick={() => onRemove(item.id)} className="absolute -top-4 -right-4 text-white/40 hover:text-mas-red transition-colors uppercase">REMOVE ITEM ×</button>
                        <input
                            type="text"
                            placeholder="ITEM NAME"
                            value={item.itemName}
                            onChange={(event) => onChange(item.id, 'itemName', event.target.value)}
                            className="bg-transparent border border-white/10 p-4 text-white uppercase placeholder-gray-400"
                        />
                        <input
                            type="number"
                            placeholder="QTY"
                            min="1"
                            value={item.quantity}
                            onChange={(event) => onChange(item.id, 'quantity', event.target.value)}
                            className="bg-transparent border border-white/10 p-4 text-white placeholder-gray-400"
                        />
                        <input
                            type="text"
                            placeholder="DESCRIPTION"
                            value={item.description}
                            onChange={(event) => onChange(item.id, 'description', event.target.value)}
                            className="md:col-span-2 bg-transparent border border-white/10 p-4 text-white placeholder-gray-400"
                        />
                    </div>
                ))}
                {items.length === 0 && <p className="text-gray-500 uppercase py-8 border-2 border-dashed border-white/5 text-center">No Equipment Declared</p>}
            </div>
        </section>
    );
};

export default EquipmentDeclaration;
