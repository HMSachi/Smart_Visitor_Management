import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, UserPlus, User, Hash, Phone, Mail, Building2, 
  AlertTriangle, Shield, Save, Search
} from 'lucide-react';

const AddBlacklistModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    docId: '',
    phone: '',
    email: '',
    company: '',
    reason: '',
    level: 'Level 01',
    contactPersonName: '',
    contactPersonPhone: '',
    contactPersonEmail: '',
    contactPersonDepartment: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({ ...formData, id: Date.now(), date: new Date().toISOString().split('T')[0], addedBy: 'Admin' });
    onClose();
    setFormData({
      name: '',
      docId: '',
      phone: '',
      email: '',
      company: '',
      reason: '',
      level: 'Level 01',
      contactPersonName: '',
      contactPersonPhone: '',
      contactPersonEmail: '',
      contactPersonDepartment: '',
    });
  };

  const InputField = ({ label, icon: Icon, name, type = "text", placeholder, required = false }) => (
    <div className="space-y-2">
      <label className="text-gray-300/70 text-[11px] font-bold uppercase tracking-[0.2em] flex items-center gap-2">
        <Icon size={12} className="text-primary/60" />
        {label} {required && <span className="text-primary">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        required={required}
        placeholder={placeholder}
        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary/50 transition-all placeholder:text-gray-600"
      />
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[110]"
          />

          <div className="fixed inset-0 flex items-center justify-center p-4 z-[111] pointer-events-none">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-4xl bg-[#141416] border border-white/10 rounded-[32px] pointer-events-auto overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <UserPlus size={24} />
                  </div>
                  <div>
                    <h2 className="text-white text-lg font-bold tracking-widest uppercase">Restrict New Identity</h2>
                    <p className="text-gray-400 text-xs tracking-wider">Initialize enforcement protocol for security blacklist</p>
                  </div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl transition-colors text-gray-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmit} className="overflow-y-auto p-8 space-y-8 scrollbar-thin scrollbar-thumb-white/10">
                
                {/* Section 1: Subject Identity */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-full flex items-center gap-3">
                    <div className="w-1 h-4 bg-primary rounded-full shadow-[0_0_8px_var(--color-primary)]"></div>
                    <h3 className="text-primary text-[12px] font-bold uppercase tracking-[0.3em]">Identity Matrix</h3>
                  </div>
                  
                  <InputField label="Full Name" icon={User} name="name" placeholder="Subject full legal name" required />
                  <InputField label="NIC / Passport" icon={Hash} name="docId" placeholder="Identification Number" required />
                  <InputField label="Phone Number" icon={Phone} name="phone" placeholder="+94 XX XXX XXXX" />
                  <InputField label="Email Address" icon={Mail} name="email" type="email" placeholder="email@example.com" />
                  <div className="md:col-span-2">
                    <InputField label="Associated Company" icon={Building2} name="company" placeholder="Organization name" />
                  </div>
                </div>

                {/* Section 2: Restriction Logistics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
                  <div className="col-span-full flex items-center gap-3">
                    <div className="w-1 h-4 bg-primary rounded-full shadow-[0_0_8px_var(--color-primary)]"></div>
                    <h3 className="text-primary text-[12px] font-bold uppercase tracking-[0.3em]">Restriction Logistics</h3>
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <label className="text-gray-300/70 text-[11px] font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                      <AlertTriangle size={12} className="text-primary/60" />
                      Enforcement Rationale <span className="text-primary">*</span>
                    </label>
                    <textarea
                      name="reason"
                      value={formData.reason}
                      onChange={handleChange}
                      required
                      placeholder="Specify reasons for blacklisting..."
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary/50 transition-all min-h-[100px] resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-gray-300/70 text-[11px] font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                      <Shield size={12} className="text-primary/60" />
                      Risk Level
                    </label>
                    <select
                      name="level"
                      value={formData.level}
                      onChange={handleChange}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary/50 transition-all appearance-none"
                    >
                      <option value="Level 01" className="bg-[#141416]">Level 01 - Monitoring Required</option>
                      <option value="Level 02" className="bg-[#141416]">Level 02 - Strict Access Control</option>
                      <option value="Level 03" className="bg-[#141416]">Level 03 - Denied Entry</option>
                    </select>
                  </div>
                </div>

                {/* Section 3: Contact Context */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
                  <div className="col-span-full flex items-center gap-3">
                    <div className="w-1 h-4 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                    <h3 className="text-blue-400 text-[12px] font-bold uppercase tracking-[0.3em]">Contact Person Reference</h3>
                  </div>

                  <InputField label="Name" icon={User} name="contactPersonName" placeholder="MAS Contact Person" />
                  <InputField label="Phone" icon={Phone} name="contactPersonPhone" placeholder="Direct line" />
                  <InputField label="Email" icon={Mail} name="contactPersonEmail" type="email" placeholder="Official email" />
                  <InputField label="Department" icon={Building2} name="contactPersonDepartment" placeholder="Division / Unit" />
                </div>

                {/* Footer */}
                <div className="flex gap-4 pt-6 border-t border-white/5">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-4 border border-white/10 rounded-2xl text-gray-400 text-xs font-bold uppercase tracking-widest hover:bg-white/5 hover:text-white transition-all"
                  >
                    Discard Changes
                  </button>
                  <button
                    type="submit"
                    className="flex-[2] py-4 bg-primary rounded-2xl text-white text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-lg shadow-primary/20"
                  >
                    <Save size={18} />
                    Commit Restriction
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AddBlacklistModal;
