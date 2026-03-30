import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertCircle, Search, Plus, Filter, Download, Activity, Clock } from 'lucide-react';
import BlacklistTable from './BlacklistTable';

const BlacklistManagementMain = () => {
  const [nodeTime, setNodeTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setNodeTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex-1 p-10 overflow-y-auto w-full bg-[#0A0A0B] relative">
      {/* Global Operational Background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-mas-red/5 rounded-full blur-[120px] pointer-events-none opacity-50"></div>

      <div className="max-w-[1600px] mx-auto relative z-10">
        {/* Command Header */}
        <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/5 pb-10 gap-8">
          <div className="flex items-center gap-8">
            <div className="relative">
              <div className="w-20 h-20 rounded-[28px] bg-mas-red/10 border border-mas-red/20 flex items-center justify-center text-mas-red shadow-[0_0_40px_rgba(200,16,46,0.15)] group hover:scale-105 transition-transform duration-500">
                <Shield size={36} strokeWidth={1.5} className="group-hover:rotate-12 transition-transform" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-mas-red rounded-full animate-pulse shadow-[0_0_10px_#C8102E]"></div>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-[2px] bg-mas-red"></div>
                <span className="text-mas-red uppercase text-[10px] font-black tracking-[0.5em] italic">Security_Enforcement_Node</span>
              </div>
              <h1 className="text-white text-4xl font-black uppercase tracking-widest italic leading-none flex items-center gap-4">
                Blacklist Management
                <span className="text-mas-text-dim/10 font-light text-2xl tracking-normal">// MATRIX_08</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-10">
            <div className="text-right border-r border-white/10 pr-10 hidden xl:block">
              <p className="text-mas-text-dim/40 text-[9px] font-black uppercase tracking-[0.4em] mb-2">Sync_Operational_Time</p>
              <div className="flex items-center gap-3 justify-end">
                <Clock size={14} className="text-mas-red/60" />
                <span className="text-white text-xl font-mono font-bold tracking-tighter">{nodeTime}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_#22C55E]"></div>
              <span className="text-white text-[11px] font-black uppercase tracking-[0.3em]">Protocol: ACTIVE</span>
            </div>
          </div>
        </header>

        {/* Intelligence Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total Restricted', val: '248', desc: 'GLOBAL_IDENTITIES', icon: Shield, color: 'text-white' },
            { label: 'Enforcement Level', val: 'ALPHA', desc: 'CRITICAL_PROTOCOL', icon: Activity, color: 'text-mas-red' },
            { label: 'Pending Validations', val: '12', desc: 'SECURITY_QUEUE', icon: AlertCircle, color: 'text-white' },
            { label: 'Fleet Sync Status', val: '99.8%', desc: 'NODAL_INTEGRITY', icon: Clock, color: 'text-white' },
          ].map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#121214] border border-white/5 p-8 rounded-[32px] hover:border-mas-red/30 transition-all duration-500 group shadow-2xl relative overflow-hidden"
            >
              <div className="absolute -right-4 -bottom-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-500 group-hover:scale-110">
                <m.icon size={120} />
              </div>
              <div className="flex justify-between items-start mb-6">
                <p className="text-mas-text-dim/40 text-[9px] font-black uppercase tracking-[0.3em] italic">{m.label}</p>
                <div className={`p-2 rounded-lg bg-white/[0.02] border border-white/5 ${m.color} group-hover:scale-110 transition-transform`}>
                  <m.icon size={14} />
                </div>
              </div>
              <p className={`text-3xl font-black italic tracking-tighter mb-2 ${m.color}`}>{m.val}</p>
              <p className="text-mas-text-dim/20 text-[8px] font-black uppercase tracking-[0.2em]">{m.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="p-0 min-h-[600px]">
          <BlacklistTable />
        </div>
      </div>
    </div>
  );
};

export default BlacklistManagementMain;
