import React from 'react';
import { User, Calendar, MapPin, Truck, Users, Package, FileText, Info } from 'lucide-react';

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
    <div className="bg-[#121214] border border-white/5 rounded-[32px] overflow-hidden shadow-2xl transition-all hover:border-white/10 group">
        <div className="px-8 py-6 bg-white/[0.02] border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-mas-red/10 border border-mas-red/20 flex items-center justify-center text-mas-red group-hover:bg-mas-red group-hover:text-white transition-all duration-500 shadow-lg">
                    <Icon size={20} />
                </div>
                <div>
                    <h3 className="text-white text-[11px] font-black tracking-[0.2em] uppercase">{title}</h3>
                    <p className="text-mas-text-dim text-[9px] font-black uppercase tracking-widest opacity-40">{subtitle}</p>
                </div>
            </div>
            <div className="opacity-10 group-hover:opacity-20 transition-opacity">
                <Icon size={40} />
            </div>
        </div>
        <div className="p-8">
            {children}
        </div>
    </div>
);

const Field = ({ label, value, icon: Icon }) => (
    <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1.5 group/field hover:border-mas-red/20 transition-all">
        <div className="flex items-center gap-2 opacity-40 group-hover/field:opacity-60 transition-opacity">
            {Icon && <Icon size={10} className="text-mas-red" />}
            <label className="text-mas-text-dim text-[9px] font-black uppercase tracking-widest">{label}</label>
        </div>
        <p className="text-white text-[13px] font-bold tracking-wide uppercase leading-tight">{value}</p>
    </div>
);

export const VisitorIdentification = ({ request }) => (
    <SectionWrapper
        icon={User}
        title="Personnel Identity"
        subtitle="Primary Visitor Authentication Data"
    >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Field label="Full Legal Name" value={request?.fullName || 'N/A'} />
            <Field label="NIC / ID Registry" value={request?.nic || 'N/A'} />
            <Field label="Communication Line" value={request?.contact || 'N/A'} />
            <Field label="Electronic Mail" value={request?.email || 'N/A'} />
        </div>
    </SectionWrapper>
);

export const VisitParameters = ({ request }) => (
    <SectionWrapper
        icon={Calendar}
        title="Mission Protocol"
        subtitle="Schedule and Operational Parameters"
    >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Field label="Authorized Date" value={formatDate(request?.visitDate)} />
            <Field label="Primary Purpose" value={readablePurpose(request?.purpose, request?.purposeOther)} />
            <Field label="Corporate Relation" value={request?.isCompanyRelated ? 'VERIFIED' : 'EXTERNAL'} />
            <Field label="Group Magnitude" value={`${(request?.additionalVisitors?.length || 0) + 1} PERSONNEL`} />
        </div>

        <div className="space-y-4">
            <div className="flex items-center gap-2 opacity-40">
                <MapPin size={12} className="text-mas-red" />
                <span className="text-[9px] font-black uppercase tracking-widest text-mas-text-dim">Authorized Access Zones</span>
            </div>
            <div className="flex flex-wrap gap-3">
                {(request?.selectedAreas?.length ? request.selectedAreas : ['N/A']).map((area) => (
                    <div key={area} className="px-5 py-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-white text-[10px] font-bold uppercase tracking-widest hover:border-mas-red transition-all shadow-lg active:scale-95">
                        {area}
                    </div>
                ))}
            </div>
        </div>
    </SectionWrapper>
);

export const VehicleConfiguration = ({ request }) => {
    if (!request?.vehicleNumber) return null;
    return (
        <SectionWrapper
            icon={Truck}
            title="Logistics Profile"
            subtitle="Vehicle and Transport Configuration"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Registry Number" value={request?.vehicleNumber || 'N/A'} />
                <Field label="Transport Type" value={request?.vehicleType || 'N/A'} />
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

export const DocumentReview = ({ request }) => (
    <SectionWrapper
        icon={FileText}
        title="Document Registry"
        subtitle="Verified Identification Credentials"
    >
        <div className="flex items-center gap-6 p-6 rounded-2xl bg-mas-red/[0.02] border border-mas-red/10 group-hover:bg-mas-red/[0.04] transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-mas-red shadow-inner">
                <FileText size={28} />
            </div>
            <div className="flex-1">
                <p className="text-[12px] font-bold text-white uppercase tracking-widest mb-1">{request?.uploadedFile || 'PENDING_UPLOAD.PDF'}</p>
                <div className="flex items-center gap-2">
                    <Info size={10} className="text-mas-red" />
                    <p className="text-[9px] font-black text-mas-text-dim uppercase tracking-widest opacity-40">Primary Identity Documentation Secured</p>
                </div>
            </div>
            <button className="px-5 py-2.5 bg-white/[0.05] border border-white/10 text-[10px] font-black text-white uppercase tracking-widest rounded-xl hover:bg-mas-red hover:border-mas-red transition-all">
                Analyze
            </button>
        </div>
    </SectionWrapper>
);

