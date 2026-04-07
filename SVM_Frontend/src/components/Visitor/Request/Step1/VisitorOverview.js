import React from 'react';
import { User, CreditCard, Phone, Mail, Building, Briefcase, MapPin, CalendarDays, MessageCircle } from 'lucide-react';

const VisitorOverview = ({ data, onChange }) => {
    const fields = [
        { name: 'fullName', label: 'FULL NAME', type: 'text', placeholder: 'JOHN SMITH', icon: User },
        { name: 'nic', label: 'NIC / PASSPORT NO', type: 'text', placeholder: 'ENTER IDENTIFICATION', icon: CreditCard },
        { name: 'emailAddress', label: 'EMAIL ADDRESS', type: 'email', placeholder: 'EMAIL@EXAMPLE.COM', icon: Mail },
        { name: 'phoneNumber', label: 'PHONE NUMBER', type: 'tel', placeholder: '+94 7X XXX XXXX', icon: Phone },
        { name: 'representingCompany', label: 'REPRESENTING COMPANY', type: 'text', placeholder: 'COMPANY NAME', icon: Building },
        { name: 'visitorClassification', label: 'VISITOR CLASSIFICATION', type: 'text', placeholder: 'E.G. CONTRACTOR, GUEST', icon: Briefcase },
        { name: 'proposedVisitDate', label: 'PROPOSED VISIT DATE', type: 'date', placeholder: '', icon: CalendarDays },
        { name: 'purposeOfVisitation', label: 'PURPOSE OF VISITATION', type: 'text', placeholder: 'E.G. BUSINESS MEETING', icon: MessageCircle },
        { name: 'visitingArea', label: 'VISITING AREA', type: 'text', placeholder: 'E.G. PRODUCTION FLOOR', icon: MapPin },
    ];

    return (
        <section className="animate-fade-in px-4">
            <div className="flex items-center gap-4 mb-10 border-l-4 border-primary pl-6">
                <div className="text-primary">
                    <User size={20} />
                </div>
                <h3 className="text-base font-black text-white uppercase tracking-[0.3em] mb-0">Visitor Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 px-6">
                {fields.map((field) => (
                    <div key={field.name} className="space-y-4">
                        <label className="text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] flex items-center gap-3">
                            <field.icon size={14} className="text-primary/70" />
                            {field.label}
                        </label>
                        <div className="relative group">
                            <input 
                                type={field.type}
                                name={field.name}
                                value={data[field.name]}
                                onChange={onChange}
                                required
                                placeholder={field.placeholder}
                                className="w-full bg-white/[0.03] border border-white/10 rounded-none px-5 py-4 text-[13px] text-white/90 focus:outline-none focus:border-primary/50 transition-all placeholder:text-gray-600 font-medium [color-scheme:dark]"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default VisitorOverview;
