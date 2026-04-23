import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Ban, User, Hash, Phone, Mail, Building2,
  AlertTriangle, Calendar, UserCheck, Clock, Shield
} from 'lucide-react';

/* ──────────────────────────────────────────────
   Small helper – labelled field row
────────────────────────────────────────────── */
const Field = ({ icon: Icon, label, value, accent }) => (
  <div className="flex items-start justify-between gap-4 py-4 border-b border-white/[0.04] last:border-0">
    <span className="flex items-center gap-2 text-gray-300/70 text-[12px] font-medium tracking-[0.2em] capitalize whitespace-nowrap">
      <Icon size={12} className="text-primary/40 flex-shrink-0" />
      {label}
    </span>
    <span
      className={`text-[13px] font-medium tracking-widest text-right break-all ${
        accent ? 'text-primary' : 'text-white/90'
      }`}
    >
      {value || '—'}
    </span>
  </div>
);

/* ──────────────────────────────────────────────
   Risk badge (matches BlacklistTable style)
────────────────────────────────────────────── */
const RiskBadge = ({ level }) => {
  const styles = {
    'Level 01': 'border-blue-500/20 text-blue-500 bg-blue-500/5',
    'Level 02': 'border-primary/20 text-primary bg-primary/5',
    'Level 03': 'border-primary/40 text-primary bg-primary/10 shadow-[0_0_15px_rgba(200,16,46,0.1)]',
  };
  return (
    <span
      className={`px-4 py-1.5 rounded-full text-[11px] font-medium tracking-[0.25em] uppercase border flex items-center gap-2 w-fit ${
        styles[level] || styles['Level 01']
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          level === 'Level 03'
            ? 'bg-primary shadow-[0_0_5px_var(--color-primary)] animate-pulse'
            : 'bg-current opacity-80'
        }`}
      />
      {level}
    </span>
  );
};

/* ──────────────────────────────────────────────
   Main modal
────────────────────────────────────────────── */
const BlacklistDetailModal = ({ isOpen, onClose, person }) => {
  if (!person) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ── Backdrop ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[100]"
          />

          {/* ── Modal ── */}
          <div className="fixed inset-0 flex items-center justify-center p-4 z-[101] pointer-events-none">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 24 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 24 }}
              transition={{ type: 'spring', bounce: 0.18, duration: 0.5 }}
              className="w-full max-w-2xl bg-[#141416]/98 backdrop-blur-3xl border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.9)] rounded-[36px] pointer-events-auto overflow-hidden relative"
            >
              {/* ambient glow */}
              <div className="absolute top-0 right-0 w-72 h-72 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

              {/* ── Header ── */}
              <div className="p-7 border-b border-white/5 flex justify-between items-center relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-primary/10 border border-primary/20 text-primary shadow-inner">
                    <Ban size={22} />
                  </div>
                  <div>
                    <p className="text-gray-300/70 text-[11px] font-medium tracking-[0.3em] uppercase mb-1">
                      Enforcement Registry
                    </p>
                    <h2 className="text-white text-base font-bold tracking-[0.15em] capitalize">
                      Blacklist Profile
                    </h2>
                  </div>
                </div>

                {/* Risk badge in header */}
                <div className="flex items-center gap-4">
                  <RiskBadge level={person.level} />
                  <button
                    onClick={onClose}
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-300/80 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-all duration-300"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* ── Scrollable Body ── */}
              <div className="overflow-y-auto max-h-[75vh] px-7 py-6 space-y-6 relative z-10 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">

                {/* ── Section: Blacklisted Person ── */}
                <section>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-1 h-4 bg-primary rounded-full shadow-[0_0_8px_var(--color-primary)]" />
                    <p className="text-primary text-[11px] font-bold tracking-[0.3em] uppercase">
                      Restricted Identity
                    </p>
                  </div>

                  <div className="bg-[var(--color-bg-paper)] border border-white/[0.06] rounded-2xl px-6 py-2 shadow-inner">
                    <Field icon={User}          label="Full Name"          value={person.name} />
                    <Field icon={Hash}          label="NIC / Doc. ID"      value={person.docId} />
                    <Field icon={Phone}         label="Phone Number"       value={person.phone} />
                    <Field icon={Mail}          label="Email Address"      value={person.email} />
                    <Field icon={Building2}     label="Company / Org."     value={person.company} />
                  </div>
                </section>

                {/* ── Section: Blacklist Details ── */}
                <section>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-1 h-4 bg-primary rounded-full shadow-[0_0_8px_var(--color-primary)]" />
                    <p className="text-primary text-[11px] font-bold tracking-[0.3em] uppercase">
                      Blacklist Details
                    </p>
                  </div>

                  <div className="bg-[var(--color-bg-paper)] border border-white/[0.06] rounded-2xl px-6 py-2 shadow-inner">
                    {/* Reason as a styled block */}
                    <div className="py-4 border-b border-white/[0.04]">
                      <span className="flex items-center gap-2 text-gray-300/70 text-[12px] font-medium tracking-[0.2em] capitalize mb-2">
                        <AlertTriangle size={12} className="text-primary/40" />
                        Blacklist Reason
                      </span>
                      <p className="text-white/90 text-[13px] font-medium tracking-wide leading-relaxed pl-5">
                        {person.reason || '—'}
                      </p>
                    </div>

                    <Field icon={Calendar}  label="Date Added"       value={person.date} />
                    <Field icon={UserCheck} label="Added By"         value={person.addedBy} />
                    <Field icon={Shield}    label="Risk Level"       value={person.level} accent />
                  </div>
                </section>

                {/* ── Section: Main Visitor Contact Person ── */}
                <section>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-1 h-4 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                    <p className="text-blue-400 text-[11px] font-bold tracking-[0.3em] uppercase">
                      Main Visitor Contact Person
                    </p>
                  </div>

                  <div className="bg-[var(--color-bg-paper)] border border-blue-500/10 rounded-2xl px-6 py-2 shadow-inner">
                    <Field
                      icon={User}
                      label="Contact Person Name"
                      value={person.contactPersonName}
                    />
                    <Field
                      icon={Phone}
                      label="Contact Person Phone"
                      value={person.contactPersonPhone}
                      accent
                    />
                    <Field
                      icon={Mail}
                      label="Contact Person Email"
                      value={person.contactPersonEmail}
                    />
                    <Field
                      icon={Building2}
                      label="Department"
                      value={person.contactPersonDepartment}
                    />
                  </div>
                </section>

              </div>

              {/* ── Footer ── */}
              <div className="px-7 py-5 border-t border-white/5 flex justify-end relative z-10 bg-black/20">
                <button
                  onClick={onClose}
                  className="px-8 py-3 border border-white/10 text-gray-300/90 text-[12px] font-medium capitalize tracking-widest hover:text-white hover:border-white/20 hover:bg-white/[0.03] transition-all rounded-xl shadow-xl"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BlacklistDetailModal;
