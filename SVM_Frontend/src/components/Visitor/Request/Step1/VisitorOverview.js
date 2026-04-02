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
            <div className="flex items-center gap-3 mb-6">
                <div className="text-mas-red">
                    <User size={14} />
                </div>
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-0 !mb-0 transition-all">Visitor Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 px-4 py-6 rounded-xl border border-white/5 bg-white/[0.01]">
                {fields.map((field) => (
                    <div key={field.name} className="space-y-1.5">
                        <label className="text-[14px] font-medium text-gray-500 uppercase tracking-widest block">
                            {field.label}
                        </label>
                        <div className="relative">
                            <input 
                                type={field.type}
                                name={field.name}
                                value={data[field.name]}
                                onChange={onChange}
                                required
                                placeholder={field.placeholder}
                                className="compact-input w-full"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default VisitorOverview;
