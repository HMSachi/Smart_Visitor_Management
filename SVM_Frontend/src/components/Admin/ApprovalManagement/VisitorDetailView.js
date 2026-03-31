import React from 'react';
import {
  ArrowLeft, User, Shield, Calendar, MapPin,
  Car, Users, Briefcase, Hash, Mail, Phone,
  Package, Info, CheckCircle2, AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

const SectionHeader = ({ title, icon: Icon }) => (
  <div className="flex items-center gap-5 mb-10 group/header">
    <div className="w-1.5 h-6 bg-mas-red rounded-full shadow-[0_0_10px_#C8102E] group-hover/header:h-10 transition-all duration-500"></div>
    <div className="flex items-center gap-3">
      {Icon && <Icon size={16} className="text-mas-red/40 group-hover/header:scale-110 transition-transform" />}
      <h3 className="uppercase text-white text-xs tracking-widest font-semibold">{title}</h3>
    </div>
    <div className="flex-1 h-[1px] bg-white/[0.05] ml-4 group-hover/header:bg-mas-red/20 transition-all"></div>
  </div>
);

const Field = ({ label, value, icon: Icon }) => (
  <div className="group/field relative">
    <div className="flex items-center gap-3 mb-2">
      {Icon && <Icon size={12} className="text-mas-red/20 group-hover/field:text-mas-red/60 transition-colors" />}
      <label className="text-gray-300/80 uppercase text-[10px] font-medium tracking-widest group-hover/field:text-gray-300 transition-colors">{label}</label>
    </div>
    <div className="relative">
      <p className="text-white text-sm font-normal uppercase tracking-widest bg-[#121214] border border-white/5 py-2.5 px-4 rounded-xl group-hover/field:border-mas-red/30 group-hover/field:bg-[#161618] transition-all duration-500 shadow-xl">
        {value || 'DATA_NOT_FOUND'}
      </p>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-mas-red/10 rounded-full group-hover/field:bg-mas-red transition-colors"></div>
    </div>
  </div>
);

const VisitorDetailView = ({ visitor, onBack, onAction }) => {
  if (!visitor) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="pb-20 max-w-6xl mx-auto px-6"
    >
      {/* Protocol Intelligence Header */}
      <div className="pt-2 pb-8 border-b border-white/5 relative mb-12 flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="px-2 py-0.5 bg-mas-red/10 border border-mas-red/20 text-mas-red text-[10px] font-medium tracking-widest rounded-md">LIVE_PROTOCOL</span>
            <div className="w-1.5 h-1.5 bg-mas-red rounded-full animate-pulse shadow-[0_0_8px_#C8102E]"></div>
          </div>
          <h1 className="text-white text-base font-bold uppercase tracking-widest flex items-center gap-4">
            Personnel Auth. Protocol <span className="text-gray-300/80 font-light">// {visitor.batchId}</span>
          </h1>
        </div>

        <div className="text-right hidden sm:block">
          <div className="flex items-center justify-end gap-3 mb-1">
            <span className="text-mas-red text-sm font-medium">01</span>
            <span className="text-white/10 text-lg">/</span>
            <span className="text-gray-300/80 text-xs font-medium uppercase tracking-widest">02_MATRIX</span>
          </div>
          <p className="text-gray-300/80 uppercase text-[10px] font-medium tracking-widest">INTELLIGENCE_LAYER: ALPHA</p>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/[0.03]">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '50%' }}
            transition={{ duration: 1, delay: 0.5 }}
            className="h-[3px] bg-mas-red -mt-[1px] shadow-[0_0_15px_#C8102E]"
          ></motion.div>
        </div>
      </div>

      {/* Control Navigation */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-16 bg-[#121214] p-5 border border-white/5 rounded-2xl shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-mas-red/5 to-transparent pointer-events-none"></div>

        <button
          onClick={onBack}
          className="flex items-center gap-3 uppercase text-white text-xs font-medium tracking-widest hover:text-mas-red transition-all group relative z-10"
        >
          <div className="w-8 h-8 rounded-lg bg-black border border-white/5 flex items-center justify-center group-hover:border-mas-red transition-all">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          </div>
          Return to Registry
        </button>

        <div className="flex gap-4 w-full lg:w-auto relative z-10">
          <button
            onClick={() => onAction(visitor, 'Approve')}
            className="flex-1 lg:flex-none px-6 py-2.5 bg-[#00B14F] hover:bg-[#009e46] text-white text-xs font-medium tracking-widest uppercase rounded-xl transition-all shadow-[0_5px_15px_rgba(0,177,79,0.2)] flex items-center justify-center gap-2 group"
          >
            <CheckCircle2 size={16} className="group-hover:scale-110 transition-transform" />
            Authorize Access
          </button>
          <button
            onClick={() => onAction(visitor, 'Reject')}
            className="flex-1 lg:flex-none px-6 py-2.5 bg-mas-red hover:bg-[#A00D25] text-white text-xs font-medium tracking-widest uppercase rounded-xl transition-all shadow-[0_5px_15px_rgba(200,16,46,0.2)] flex items-center justify-center gap-2 group"
          >
            <AlertCircle size={16} className="group-hover:scale-110 transition-transform" />
            Protocol Denial
          </button>
        </div>
      </div>

      {/* Visitor Profile Matrix */}
      <div className="mb-20">
        <SectionHeader title="Personnel Profile Intelligence" icon={User} />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          <Field label="Full Identity Name" value={visitor.name} icon={User} />
          <Field label="Auth Identifier (NIC)" value={visitor.nic} icon={Hash} />
          <Field label="Signal Protocol (Phone)" value={visitor.contact} icon={Phone} />
          <Field label="Grid Address (Email)" value={visitor.email || "DEFAULT_SECURE@DOMAIN.COM"} icon={Mail} />
        </div>
      </div>

      {/* Visit Protocol Dynamics */}
      <div className="mb-20">
        <SectionHeader title="Visit Protocol Dynamics" icon={Briefcase} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Field label="Deployment Date" value={visitor.date} icon={Calendar} />
          <Field label="Mission Purpose" value={visitor.purpose || "GENERAL_INSTITUTIONAL"} icon={Info} />
          <Field label="Institutional Link" value="AUTHORIZED_COMPANY_LINK" icon={Briefcase} />
          <Field label="Unit Total Count" value={`${(visitor.members?.length || 0) + 1} PERSONNEL`} icon={Users} />
        </div>

        {/* Infrastructure Authorization Grid */}
        <div className="mt-16 bg-black/40 p-10 border border-white/5 rounded-[40px] shadow-inner relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-mas-red/20 to-transparent"></div>
          <div className="flex items-center gap-4 mb-10">
            <div className="w-1 h-4 bg-mas-red rounded-full"></div>
            <p className="text-gray-300/90 text-[10px] font-medium uppercase tracking-widest">Infrastructure Zone Authorization</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {visitor.areas && visitor.areas.length > 0 ? visitor.areas.map((area, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05, borderColor: '#C8102E' }}
                className="p-6 bg-[#0E0E10] border border-white/5 rounded-2xl text-white uppercase text-[10px] font-medium tracking-widest flex flex-col items-center justify-center text-center gap-3 transition-all shadow-xl group/zone"
              >
                <MapPin size={14} className="text-mas-red/20 group-hover/zone:text-mas-red transition-colors" />
                {area}
              </motion.div>
            )) : (
              <div className="col-span-full border border-dashed border-white/10 p-10 rounded-3xl text-center">
                <p className="text-gray-300/80 uppercase text-[11px] font-medium tracking-widest">No specific zones requested</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Logistics & Vehicle Registry */}
      <div className="mb-20">
        <SectionHeader title="Logistics & Vehicle Registry" icon={Car} />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          <Field label="Transport Identifier" value={visitor.vehicle !== 'None' ? visitor.vehicle : 'NO_TRANSPORT_DECLARED'} icon={Car} />
          <Field label="Registry Type" value={visitor.vehicle !== 'None' ? 'CIVILIAN_TRANSPORT' : 'N/A'} icon={Hash} />
          <Field label="Zone Clearance" value={visitor.vehicle !== 'None' ? 'PERMITTED_ZONE_A' : 'NOT_APPLICABLE'} icon={Shield} />
        </div>
      </div>

      {/* Personnel Registry (Auxiliary) */}
      {visitor.members && visitor.members.length > 0 && (
        <div className="mb-20">
          <SectionHeader title="Personnel Registry (Auxiliary)" icon={Users} />
          <div className="space-y-6">
            {visitor.members.map((member, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-10 bg-[#121214] border border-white/5 rounded-[32px] group/aux shadow-2xl relative overflow-hidden"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-mas-red group-hover:w-2 transition-all"></div>
                <Field label={`Unit_${(idx + 2).toString().padStart(2, '0')} Identity`} value={member.name} icon={User} />
                <Field label="Auth Identifier (NIC)" value={member.nic} icon={Hash} />
                <Field label="Signal Protocol (Phone)" value={member.contact || 'PROTOCOL_NOT_ESTABLISHED'} icon={Phone} />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Material Intake Protocol */}
      {visitor.equipment && visitor.equipment.length > 0 && (
        <div className="mb-20 bg-[#0A0A0B] p-12 border border-white/5 rounded-[40px] shadow-[inset_0_0_60px_rgba(0,0,0,0.5)]">
          <SectionHeader title="Material Intake Protocol" icon={Package} />
          <div className="grid grid-cols-1 gap-6 mt-12">
            {visitor.equipment.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-8 p-8 bg-[#121214]/40 border border-white/5 rounded-3xl group/item hover:border-mas-red/20 transition-all shadow-xl"
              >
                <div className="md:col-span-5"><Field label="Asset Nomenclature" value={item} icon={Package} /></div>
                <div className="md:col-span-2"><Field label="Asset Qty" value="01_UNIT" icon={Hash} /></div>
                <div className="md:col-span-5"><Field label="Intake Description" value="DECLARED_AT_PERIMETER_GATE" icon={Info} /></div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default VisitorDetailView;
