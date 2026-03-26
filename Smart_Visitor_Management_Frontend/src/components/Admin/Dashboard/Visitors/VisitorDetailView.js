import React from 'react';
import {
  ArrowLeft,
  FileText,
  Users,
  X,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DetailSection = ({ icon: Icon, title, children }) => (
  <div className="bg-[#0F0F10] p-5 border-white/5 mb-4">
    <div className="flex items-center gap-4 mb-4">
      <div className="w-8 h-[2px] bg-mas-red/60"></div>
      <h3 className="text-white uppercase">{title}</h3>
    </div>
    <div className="space-y-5 pl-6">
      {children}
    </div>
  </div>
);

const DetailItem = ({ label, value, subValue }) => (
  <div className="space-y-1">
    <p className="text-mas-text-dim uppercase">{label}</p>
    <p className="text-white uppercase">{value || 'NOT DECLARED'}</p>
    {subValue && <p className="text-mas-red mt-1 opacity-80">{subValue}</p>}
  </div>
);

const VisitorDetailView = ({ visitor, onBack, onAction }) => {
  const [showMembers, setShowMembers] = React.useState(false);
  if (!visitor) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pb-12 max-w-5xl mx-auto"
    >
      {/* 1. Step Indicator Header */}
      <div className="px-10 pt-2 pb-5 border-b border-white/5 relative mb-4">
        <div className="flex justify-between items-end mb-3">
          <div className="flex gap-2 text-white">
            <span className="text-mas-red">01</span>
            <span className="text-white/20">/</span>
            <span className="text-white/40">02</span>
          </div>
          <p className="text-mas-text-dim uppercase">Basic Information</p>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/5">
          <div className="w-1/2 h-[3px] bg-mas-red -mt-[1px]"></div>
        </div>
      </div>

      {/* 2. Header Navigation */}
      <div className="flex justify-between items-center px-10 mb-10">
        <button
          onClick={onBack}
          className="flex items-center gap-3 uppercase text-mas-text-dim hover:text-white transition-all group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Protocol List
        </button>

        <div className="flex gap-4">
          <button
            onClick={() => onAction(visitor, 'Approve')}
            className="px-8 py-2.5 bg-green-600 hover:bg-green-500 text-white uppercase transition-all"
          >
            Approve Access
          </button>
          <button
            onClick={() => onAction(visitor, 'Reject')}
            className="px-8 py-2.5 bg-mas-red hover:bg-red-500 text-white uppercase transition-all"
          >
            Reject Block
          </button>
        </div>
      </div>

      {/* 3. VISITOR OVERVIEW Section */}
      <div className="bg-[#0F0F10] p-5 border-white/5 mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-8 h-[2px] bg-mas-red/80"></div>
          <h3 className="text-white uppercase">Visitor Overview</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10 pl-6">
          <DetailItem label="Full Name" value={visitor.name} />
          <DetailItem label="NIC / ID Number" value={visitor.nic} />
          <DetailItem label="Contact Number" value={visitor.contact} />
          <DetailItem label="Email Address" value={visitor.email || "VISITOR@DOMAIN.COM"} />
        </div>
      </div>

      {/* 4. Visit Information Section */}
      <div className="space-y-4">
        <DetailSection title="Visit Information">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10">
            <DetailItem label="Access Facility Area" value={visitor.areas.join(' | ')} />
            <DetailItem label="Authorized Schedule" value={`${visitor.date} @ ${visitor.timeIn}`} />
            <DetailItem label="MAS Representative" value={visitor.contactPerson || "NOT ASSIGNED"} />
            <DetailItem label="Visit Purpose" value={visitor.purpose || "GENERAL"} />
          </div>
        </DetailSection>

        <DetailSection title="Internal Observations (Contact Person)">
          <div className="space-y-4">
            <p className="text-mas-text-dim uppercase">Pre-Approval Notes from {visitor.contactPerson || "Sachi (HR)"}</p>
            <div className="bg-white/[0.02] border border-white/5 p-4 text-white text-sm">
              "Identity and visit parameters verified. Equipment approved for operational diagnostic. Recommend immediate QR token generation."
            </div>
            <p className="text-mas-red text-xs uppercase opacity-80">— Reviewed & Escalated @ {new Date().toLocaleDateString()}</p>
          </div>
        </DetailSection>

        <DetailSection title="Logistics & Assets">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10">
            <DetailItem label="Vehicle Authorization" value={visitor.vehicle !== 'None' ? visitor.vehicle : 'BY FOOT'} />
            <div className="space-y-4">
              <p className="text-mas-text-dim uppercase opacity-60">Declared Equipment</p>
              {visitor.equipment.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {visitor.equipment.map((item, i) => (
                    <span key={i} className="text-white uppercase border border-white/10 px-3 py-1 bg-white/5">{item}</span>
                  ))}
                </div>
              ) : (
                <p className="text-mas-text-dim uppercase opacity-40">No Assets Declared</p>
              )}
            </div>
          </div>
        </DetailSection>

        {/* 5. Batch & Registry - Action */}
        <div className="bg-[#0F0F10] p-5 border border-white/5 mx-6 flex flex-col sm:flex-row items-center justify-between gap-6 mb-6">
          <div>
            <p className="text-white mb-1">{(visitor.members?.length || 0) + 1}</p>
            <p className="text-mas-text-dim uppercase">Total Personnel Authorization</p>
          </div>
          <button
            onClick={() => setShowMembers(true)}
            className="px-8 py-2.5 bg-mas-red text-white uppercase hover:bg-red-500 transition-all flex items-center gap-3"
          >
            <Users size={14} />
            Open Batch Registry
          </button>
        </div>

        {/* 6. Verification Protocol */}
        <div className="px-10 mb-10">
          <div
            onClick={() => setShowMembers(true)}
            className="p-10 border-2 border-dashed border-white/5 flex flex-col items-center justify-center gap-6 cursor-pointer hover:border-mas-red hover:bg-mas-red/[0.01] transition-all group bg-[#0F0F10]"
          >
            <FileText size={32} className="text-mas-text-dim group-hover:text-mas-red transition-all" />
            <p className="text-mas-text-dim group-hover:text-white uppercase">Review All Personnel Scans</p>
          </div>
        </div>
      </div>

      {/* Compact Full Screen Batch Registry - NO TRANSPARENCY */}
      <AnimatePresence>
        {showMembers && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#0F0F10] z-[200] flex flex-col overflow-hidden"
          >
            {/* Top Bar - Minimal */}
            <div className="flex justify-between items-center px-10 py-8 border-b border-white/10 bg-[#121212]">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-mas-red flex items-center justify-center">
                  <Layers size={18} className="text-white" />
                </div>
                <div>
                  <h3 className="text-white uppercase">Batch Registry</h3>
                  <p className="text-mas-text-dim uppercase mt-1">Institutional Authorization Protocol</p>
                </div>
              </div>
              <button
                onClick={() => setShowMembers(false)}
                className="p-3 text-mas-text-dim hover:text-white transition-all bg-white/5 border border-white/10 hover:border-mas-red"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#0F0F10]">
              <div className="max-w-6xl mx-auto px-10 py-16">

                {/* 1. Scaled Down Leader Section */}
                <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-[#121212] border border-mas-red/20 mb-8">
                  <div className="w-16 h-16 bg-mas-red flex items-center justify-center text-white shrink-0">
                    {visitor.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <p className="text-mas-red uppercase mb-1">Protocol Lead</p>
                    <h2 className="text-white uppercase">{visitor.name}</h2>
                  </div>
                  <div className="grid grid-cols-2 gap-10 text-left">
                    <div>
                      <p className="text-mas-text-dim uppercase mb-2">NIC Identity</p>
                      <p className="text-white">{visitor.nic}</p>
                    </div>
                    <div>
                      <p className="text-mas-text-dim uppercase mb-2">Direct Contact</p>
                      <p className="text-white">{visitor.contact}</p>
                    </div>
                  </div>
                </div>

                {/* 2. Compact 3-Column Table Registry */}
                <div className="border border-white/10 bg-[#121212]">
                  <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-white/10 bg-white/[0.02]">
                    <div className="col-span-1 text-mas-text-dim uppercase">Unit</div>
                    <div className="col-span-1 text-mas-text-dim uppercase">Status</div>
                    <div className="col-span-4 text-mas-text-dim uppercase">Full Name</div>
                    <div className="col-span-3 text-mas-text-dim uppercase">Identity (NIC)</div>
                    <div className="col-span-3 text-mas-text-dim uppercase">Contact</div>
                  </div>

                  <div className="divide-y divide-white/5">
                    {/* Primary Member (Leader) */}
                    <div className="grid grid-cols-12 gap-4 px-6 py-3 items-center bg-mas-red/[0.02]">
                      <div className="col-span-1 text-mas-red">01</div>
                      <div className="col-span-1">
                        <span className="bg-mas-red text-white px-2 py-0.5 uppercase">Lead</span>
                      </div>
                      <div className="col-span-4 text-white uppercase">{visitor.name}</div>
                      <div className="col-span-3 text-mas-text-dim uppercase">{visitor.nic}</div>
                      <div className="col-span-3 text-mas-text-dim uppercase">{visitor.contact}</div>
                    </div>

                    {/* Secondary Members */}
                    {visitor.members?.map((member, i) => (
                      <div key={i} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-white/[0.01] transition-all">
                        <div className="col-span-1 text-mas-text-dim">{(i + 2).toString().padStart(2, '0')}</div>
                        <div className="col-span-1">
                          <span className="bg-white/10 text-mas-text-dim px-2 py-0.5 uppercase border border-white/10">Member</span>
                        </div>
                        <div className="col-span-4 text-white uppercase">{member.name}</div>
                        <div className="col-span-3 text-mas-text-dim uppercase">{member.nic}</div>
                        <div className="col-span-3 text-mas-text-dim uppercase">{member.contact || "N/A"}</div>
                      </div>
                    ))}
                  </div>

                  {(!visitor.members || visitor.members.length === 0) && (
                    <div className="py-20 text-center bg-[#0F0F10]">
                      <p className="text-mas-text-dim uppercase opacity-20">Secure Personnel Protocol: No Secondary Units</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Utility Bar */}
            <div className="px-10 py-8 border-t border-white/10 flex justify-between items-center bg-[#121212]">
              <p className="text-mas-text-dim uppercase">Protocol Log : Generated @ {new Date().toLocaleTimeString()}</p>
              <button
                onClick={() => setShowMembers(false)}
                className="px-10 py-3 bg-white text-black uppercase hover:bg-mas-red hover:text-white transition-all shadow-xl shadow-white/5"
              >
                Close Protocol
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default VisitorDetailView;
