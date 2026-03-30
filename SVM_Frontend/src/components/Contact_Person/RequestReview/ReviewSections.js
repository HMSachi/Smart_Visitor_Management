import React from 'react';

const formatDate = (value) => {
    if (!value) {
        return 'N/A';
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: '2-digit',
    });
};

const readablePurpose = (purpose, purposeOther) => {
    if (purpose === 'other') {
        return (purposeOther || 'Other').toUpperCase();
    }

    return (purpose || 'General Visit').replace(/_/g, ' ').toUpperCase();
};

const SectionHeader = ({ label }) => (
    <div className="flex items-center gap-4 mb-8">
        <div className="w-6 h-[2px] bg-mas-red/80"></div>
        <h3 className="uppercase text-white text-lg tracking-wide font-medium">{label}</h3>
    </div>
);

const Field = ({ label, value }) => (
    <div className="space-y-4">
        <label className="text-mas-text-dim uppercase text-xs tracking-wider">{label}</label>
        <p className="text-white text-sm font-medium uppercase border-b border-white/5 pb-4">{value}</p>
    </div>
);

export const VisitorIdentification = ({ request }) => (
    <div className="mb-16">
        <SectionHeader label="Visitor Overview" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            <Field label="Full Name" value={request?.fullName || 'N/A'} />
            <Field label="NIC / ID Number" value={request?.nic || 'N/A'} />
            <Field label="Contact Number" value={request?.contact || 'N/A'} />
            <Field label="Email Address" value={request?.email || 'N/A'} />
        </div>
    </div>
);

export const VisitParameters = ({ request }) => (
    <div className="mb-16">
        <SectionHeader label="Visit Information" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            <Field label="Visit Date" value={formatDate(request?.visitDate)} />
            <Field label="Purpose of Visit" value={readablePurpose(request?.purpose, request?.purposeOther)} />
            
            <div className="space-y-4">
                <label className="text-mas-text-dim uppercase text-xs tracking-wider">Related To Company?</label>
                <p className="text-white text-sm font-medium uppercase border-b border-white/5 pb-4">
                    {request?.isCompanyRelated ? 'YES' : 'NO'}
                </p>
            </div>

            <Field label="Number of Visitors" value={(request?.additionalVisitors?.length || 0) + 1} />
        </div>

        <div className="mt-10">
            <SectionHeader label="Areas To Visit" />
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {(request?.selectedAreas?.length ? request.selectedAreas : ['N/A']).map((area) => (
                    <div key={area} className="p-6 bg-[#0E0E10] border border-white/5 text-white uppercase text-xs tracking-wider flex items-center justify-center text-center hover:border-mas-red/30 transition-all">
                        {area}
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export const VehicleConfiguration = ({ request }) => (
    <div className="mb-16">
        <SectionHeader label="Vehicle Details" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            <Field label="Vehicle Number" value={request?.vehicleNumber || 'N/A'} />
            <Field label="Vehicle Type" value={request?.vehicleType || 'N/A'} />
        </div>
    </div>
);

export const GroupMembers = ({ request }) => {
    if (!request?.additionalVisitors || request.additionalVisitors.length === 0) return null;
    return (
        <div className="mb-16">
            <SectionHeader label="Visitor Group" />
            <div className="space-y-4">
                {request.additionalVisitors.map((member, idx) => (
                    <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-6 pb-6 border-b border-white/5">
                        <Field label="Full Name" value={member.fullName || 'N/A'} />
                        <Field label="NIC / ID Number" value={member.nic || 'N/A'} />
                        <Field label="Contact Number" value={member.contact || 'N/A'} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export const EquipmentManifest = ({ request }) => {
    if (!request?.equipment || request.equipment.length === 0) return null;
    return (
        <div className="mb-16 bg-[#0E0E10] p-8 border border-white/5">
            <SectionHeader label="Equipment Grid" />
            <div className="space-y-4">
                {request.equipment.map((equip, idx) => (
                    <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-6 pb-6 border-b border-white/5 mt-4">
                        <div className="md:col-span-4"><Field label="Item Name" value={equip.itemName || 'N/A'} /></div>
                        <div className="md:col-span-2"><Field label="Qty" value={equip.quantity || '-'} /></div>
                        <div className="md:col-span-6"><Field label="Description" value={equip.description || '-'} /></div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const DocumentReview = ({ request }) => (
    <div className="mb-16">
        <SectionHeader label="Document Verification" />
        <div className="space-y-4">
            <label className="text-mas-text-dim uppercase text-xs tracking-wider">Uploaded Identification</label>
            <p className="text-white text-sm font-medium uppercase border-b border-white/5 pb-4">
                {request?.uploadedFile || 'NO FILE UPLOADED'}
            </p>
        </div>
    </div>
);

