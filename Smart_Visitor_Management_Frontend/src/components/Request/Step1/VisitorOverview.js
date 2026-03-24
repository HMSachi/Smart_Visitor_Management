import React from 'react';

const VisitorOverview = ({ data, onChange }) => {
    const fields = [
        { name: 'fullName', label: 'Full Name', type: 'text', placeholder: 'ENTER OFFICIAL NAME' },
        { name: 'nic', label: 'NIC / ID NUMBER', type: 'text', placeholder: '0000000000V' },
        { name: 'contact', label: 'CONTACT NUMBER', type: 'tel', placeholder: '+94 XX XXX XXXX' },
        { name: 'email', label: 'EMAIL ADDRESS', type: 'email', placeholder: 'VISITOR@DOMAIN.COM' }
    ];

    return (
        <section className="animate-fade-in group">
            <div className="flex items-center space-x-6 mb-12">
                <div className="w-8 h-[1px] bg-mas-red"></div>
                <h2 className="text-xl font-display font-black text-white uppercase tracking-widest">Visitor Overview</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 border-t border-white/5 pt-12">
                {fields.map((field) => (
                    <div key={field.name} className="relative group/field">
                        <label className="text-[9px] uppercase tracking-[0.2em] font-bold text-gray-300 mb-3 block group-focus-within/field:text-mas-red transition-colors">{field.label}</label>
                        <input 
                            type={field.type}
                            name={field.name}
                            value={data[field.name]}
                            onChange={onChange}
                            required
                            placeholder={field.placeholder}
                            className="w-full bg-transparent border-b border-white/5 py-4 text-white text-sm font-light tracking-wide focus:outline-none focus:border-mas-red transition-all placeholder-gray-400"
                        />
                        <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-mas-red group-focus-within/field:w-full transition-all duration-500"></div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default VisitorOverview;
