import React from 'react';
import { User, Calendar, MapPin, Truck, Users, Package } from 'lucide-react';

const formatDate = (value) => {
    if (!value) return 'N/A';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: '2-digit',
    }).toUpperCase();
};

const readablePurpose = (purpose, purposeOther) => {
    if (purpose === 'other') return (purposeOther || 'Other').toUpperCase();
    return (purpose || 'General Visit').replace(/_/g, ' ').toUpperCase();
};

const SectionWrapper = ({ icon: Icon, title, subtitle, children }) => (
    <div className="bg-[var(--color-bg-paper)] border border-white/5 rounded-[32px] overflow-hidden shadow-2xl transition-all hover:border-white/10 group">
        <div className="px-8 py-6 bg-white/[0.02] border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-lg">
                    <Icon size={20} />
                </div>
                <div>
                    <h3 className="text-white text-[14px] font-bold tracking-[0.2em] uppercase">{title}</h3>
                    <p className="text-gray-300 text-[12px] font-medium uppercase tracking-widest opacity-80">{subtitle}</p>
                </div>
            </div>
            <div className="opacity-10 group-hover:opacity-70 transition-opacity">
                <Icon size={40} />
            </div>
        </div>
        <div className="p-8">
            {children}
        </div>
    </div>
);

const Field = ({ label, value, icon: Icon }) => (
    <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1.5 group/field hover:border-primary/20 transition-all">
        <div className="flex items-center gap-2 opacity-80 group-hover/field:opacity-90 transition-opacity">
            {Icon && <Icon size={10} className="text-primary" />}
            <label className="text-gray-300 text-[12px] font-medium uppercase tracking-widest">{label}</label>
        </div>
        <p className="text-white text-[13px] font-medium tracking-wide uppercase leading-tight">{value}</p>
    </div>
);

export const VisitorIdentification = ({ request }) => (
    <SectionWrapper
        icon={User}
        title="Visitor Information"
        subtitle="User Registration Data"
    >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Field label="Full Name" value={request?.fullName || 'N/A'} />
            <Field label="NIC / Passport No" value={request?.nic || 'N/A'} />
            <Field label="Email Address" value={request?.emailAddress || 'N/A'} />
            <Field label="Phone Number" value={request?.phoneNumber || 'N/A'} />
            <Field label="Representing Company" value={request?.representingCompany || 'N/A'} />
            <Field label="Visitor Classification" value={request?.visitorClassification || 'N/A'} />
        </div>
    </SectionWrapper>
);

export const VisitParameters = ({ request }) => (
    <SectionWrapper
        icon={Calendar}
        title="Visit Details"
        subtitle="Request Information"
    >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Field label="Proposed Visit Date" value={formatDate(request?.proposedVisitDate)} />
            <Field label="Purpose of Visitation" value={readablePurpose(request?.purposeOfVisitation)} />
            <Field label="Visiting Area" value={request?.visitingArea || 'N/A'} icon={MapPin} />
        </div>
    </SectionWrapper>
);

export const VehicleConfiguration = ({ request }) => {
    if (!request?.plateNumber && !request?.vehicleType) return null;
    return (
        <SectionWrapper
            icon={Truck}
            title="Vehicle Details"
            subtitle="Registration Transport Data"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Vehicle Type" value={request?.vehicleType || 'N/A'} />
                <Field label="Plate Number" value={request?.plateNumber || 'N/A'} />
            </div>
        </SectionWrapper>
    );
};

export const GroupMembers = ({ request }) => {
    if (!request?.additionalVisitors || request.additionalVisitors.length === 0) return null;
    return (
        <SectionWrapper
            icon={Users}
            title="Group Manifest"
            subtitle="Secondary Personnel Authentication"
        >
            <div className="space-y-3">
                {request.additionalVisitors.map((member, idx) => (
                    <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-2 bg-white/[0.01] border border-white/[0.03] rounded-2xl">
                        <Field label="Full Name" value={member.fullName || 'N/A'} />
                        <Field label="Registry ID" value={member.nic || 'N/A'} />
                        <Field label="Contact" value={member.contact || 'N/A'} />
                    </div>
                ))}
            </div>
        </SectionWrapper>
    );
};

export const EquipmentManifest = ({ request }) => {
    if (!request?.equipment || request.equipment.length === 0) return null;
    return (
        <SectionWrapper
            icon={Package}
            title="Asset Manifest"
            subtitle="Hardware and Equipment Registry"
        >
            <div className="space-y-3">
                {request.equipment.map((equip, idx) => (
                    <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-2 bg-white/[0.01] border border-white/[0.03] rounded-2xl items-center">
                        <div className="md:col-span-5"><Field label="Asset Identity" value={equip.itemName || 'N/A'} /></div>
                        <div className="md:col-span-2"><Field label="Magnitude" value={equip.quantity || '-'} /></div>
                        <div className="md:col-span-5"><Field label="Descriptor" value={equip.description || '-'} /></div>
                    </div>
                ))}
            </div>
        </SectionWrapper>
    );
};

