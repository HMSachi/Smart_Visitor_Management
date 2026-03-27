import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const SectionHeader = ({ title }) => (
    <div className="flex items-center gap-4 mb-8">
        <div className="w-6 h-[2px] bg-mas-red/80"></div>
        <h3 className="uppercase text-white text-lg tracking-wide font-medium">{title}</h3>
    </div>
);

const Field = ({ label, value }) => (
    <div className="space-y-4">
        <label className="text-mas-text-dim uppercase text-xs tracking-wider">{label}</label>
        <p className="text-white text-sm font-medium uppercase border-b border-white/5 pb-4">{value || 'N/A'}</p>
    </div>
);

const VisitorDetailView = ({ visitor, onBack, onAction }) => {
  if (!visitor) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pb-12 max-w-5xl mx-auto px-4"
    >
      {/* Step Indicator Header */}
      <div className="pt-2 pb-5 border-b border-white/5 relative mb-4">
        <div className="flex justify-between items-end mb-3">
          <div className="flex gap-2 text-white">
            <span className="text-mas-red">01</span>
            <span className="text-white/20">/</span>
            <span className="text-white/40">02</span>
          </div>
          <p className="text-mas-text-dim uppercase text-xs tracking-wider">Basic Information</p>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/5">
          <div className="w-[120px] h-[3px] bg-mas-red -mt-[1px]"></div>
        </div>
      </div>

      {/* Header Navigation */}
      <div className="flex justify-between items-center mb-16">
        <button
          onClick={onBack}
          className="flex items-center gap-3 uppercase text-mas-text-dim text-xs tracking-wider hover:text-white transition-all group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Protocol List
        </button>

        <div className="flex gap-4">
          <button
            onClick={() => onAction(visitor, 'Approve')}
            className="px-8 py-2.5 bg-[#00B14F] hover:bg-[#009e46] text-white text-sm font-medium tracking-wide uppercase transition-all shadow-[0_0_15px_rgba(0,177,79,0.2)]"
          >
            Approve Access
          </button>
          <button
            onClick={() => onAction(visitor, 'Reject')}
            className="px-8 py-2.5 bg-[#DA291C] hover:bg-[#c22419] text-white text-sm font-medium tracking-wide uppercase transition-all shadow-[0_0_15px_rgba(218,41,28,0.2)]"
          >
            Reject Block
          </button>
        </div>
      </div>

      {/* Visitor Overview */}
      <div className="mb-16">
        <SectionHeader title="Visitor Overview" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
          <Field label="Full Name" value={visitor.name} />
          <Field label="NIC / ID Number" value={visitor.nic} />
          <Field label="Contact Number" value={visitor.contact} />
          <Field label="Email Address" value={visitor.email || "VISITOR@DOMAIN.COM"} />
        </div>
      </div>

      {/* Visit Information */}
      <div className="mb-16">
        <SectionHeader title="Visit Information" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
          <Field label="Visit Date" value={visitor.date} />
          <Field label="Purpose of Visit" value={visitor.purpose || "GENERAL"} />
          
          <div className="space-y-4">
            <label className="text-mas-text-dim uppercase text-xs tracking-wider">Related To Company?</label>
            <p className="text-white text-sm font-medium uppercase border-b border-white/5 pb-4">YES</p>
          </div>

          <Field label="Number of Visitors" value={(visitor.members?.length || 0) + 1} />
        </div>

        {/* Areas To Visit nested under Visit Info logically per screenshot */}
        <div className="mt-10">
          <SectionHeader title="Areas To Visit" />
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {visitor.areas && visitor.areas.length > 0 ? visitor.areas.map((area, idx) => (
               <div key={idx} className="p-6 bg-[#0E0E10] border border-white/5 text-white uppercase text-xs tracking-wider flex items-center justify-center text-center hover:border-mas-red/30 transition-all">
                  {area}
               </div>
            )) : (
               <div className="col-span-full text-mas-text-dim text-sm uppercase">No specific areas declared</div>
            )}
          </div>
        </div>
      </div>

      {/* Vehicle Details */}
      <div className="mb-16">
        <SectionHeader title="Vehicle Details" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
          <Field label="Vehicle Number" value={visitor.vehicle !== 'None' ? visitor.vehicle : 'N/A'} />
          <Field label="Vehicle Type" value={visitor.vehicle !== 'None' ? 'CAR/UNKNOWN' : 'N/A'} />
        </div>
      </div>

      {/* Visitor Group */}
      {visitor.members && visitor.members.length > 0 && (
        <div className="mb-16">
          <SectionHeader title="Visitor Group" />
          <div className="space-y-4">
            {visitor.members.map((member, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-6 pb-6 border-b border-white/5">
                <Field label="Full Name" value={member.name} />
                <Field label="NIC / ID" value={member.nic} />
                <Field label="Contact" value={member.contact || 'N/A'} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Equipment Grid */}
      {visitor.equipment && visitor.equipment.length > 0 && (
        <div className="mb-16 bg-[#0E0E10] p-8 border border-white/5">
          <SectionHeader title="Equipment Grid" />
          <div className="space-y-4 mt-8">
            {visitor.equipment.map((item, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-6 pb-6 border-b border-white/5 text-left">
                <div className="md:col-span-4"><Field label="Item Name" value={item} /></div>
                <div className="md:col-span-2"><Field label="Qty" value="1" /></div>
                <div className="md:col-span-6"><Field label="Description" value="DECLARED AT GATE" /></div>
              </div>
            ))}
          </div>
        </div>
      )}

    </motion.div>
  );
};

export default VisitorDetailView;
