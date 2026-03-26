import React from 'react';

const VisitorGroup = ({ visitors, onAdd, onRemove }) => {
    return (
        <section className="bg-white/[0.02] border border-white/5 p-12 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-mas-red/5 -mr-16 -mt-16 group-hover:bg-mas-red/10 transition-all"></div>
            <div className="flex items-center justify-between mb-12">
                <div className="flex items-center space-x-6">
                    <div className="w-8 h-[1px] bg-mas-red"></div>
                    <h2 className="text-white uppercase">Visitor Group</h2>
                </div>
                <button type="button" onClick={onAdd} className="text-mas-red uppercase hover:text-white transition-colors flex items-center">
                    <span className="mr-2">+</span> Add Visitor
                </button>
            </div>
            <div className="space-y-10">
                {visitors.map((visitor, index) => (
                    <div key={visitor.id} className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10 border-b border-white/5 relative animate-slide-down">
                        {visitors.length > 1 && (
                            <button type="button" onClick={() => onRemove(visitor.id)} className="absolute -top-4 -right-4 text-white/20 hover:text-mas-red transition-colors uppercase">REMOVE NODE ×</button>
                        )}
                        <div className="space-y-4">
                            <label className="text-gray-300 uppercase">Full Name</label>
                            <input type="text" placeholder="VISITOR NAME" className="w-full bg-transparent border border-white/10 p-4 text-white focus:border-mas-red transition-all placeholder-gray-400" />
                        </div>
                        <div className="space-y-4">
                            <label className="text-gray-300 uppercase">NIC / ID</label>
                            <input type="text" placeholder="ID NUMBER" className="w-full bg-transparent border border-white/10 p-4 text-white focus:border-mas-red transition-all placeholder-gray-400" />
                        </div>
                        <div className="space-y-4">
                            <label className="text-gray-300 uppercase">Contact</label>
                            <input type="tel" placeholder="MOBILE" className="w-full bg-transparent border border-white/10 p-4 text-white focus:border-mas-red transition-all placeholder-gray-400" />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default VisitorGroup;
