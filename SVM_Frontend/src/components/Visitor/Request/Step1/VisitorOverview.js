import React from 'react';
import { User, CreditCard, Phone, Mail } from 'lucide-react';

const VisitorOverview = ({ data, onChange }) => {
    const fields = [
        { name: 'fullName', label: 'Full Name', type: 'text', placeholder: 'John Doe', icon: User },
        { name: 'nic', label: 'NIC / Passport', type: 'text', placeholder: '987654321V', icon: CreditCard },
        { name: 'contact', label: 'Contact', type: 'tel', placeholder: '+94 77 123 4567', icon: Phone },
        { name: 'email', label: 'Email', type: 'email', placeholder: 'john@example.com', icon: Mail }
    ];

    return (
        <section className="animate-fade-in">
            <div className="flex items-center gap-4 mb-10">
                <div className="p-3 rounded-xl bg-mas-red/10 border border-mas-red/20 text-mas-red">
                    <User size={20} />
                </div>
                <div>
                    <h2 className="text-xl font-black text-white uppercase tracking-tight">Visitor Profile</h2>
                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em]">Personal Identification</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/[0.02] border border-white/5 p-8 rounded-3xl">
                {fields.map((field) => (
                    <div key={field.name} className="relative group/field">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block group-focus-within/field:text-mas-red transition-colors">
                            {field.label}
                        </label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within/field:text-mas-red transition-colors">
                                <field.icon size={18} />
                            </div>
                            <input 
                                type={field.type}
                                name={field.name}
                                value={data[field.name]}
                                onChange={onChange}
                                required
                                placeholder={field.placeholder}
                                className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white text-sm focus:outline-none focus:border-mas-red/50 transition-all placeholder-gray-700"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default VisitorOverview;
