import React, { useState } from 'react';
import { Search, Plus, Trash2, Shield, User, AlertCircle, Clock, Download, ChevronRight, Hash, Ban, UserX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const RestrictionLevel = ({ level }) => {
  const styles = {
    'Level 01': 'border-blue-500/20 text-blue-500 bg-blue-500/5',
    'Level 02': 'border-mas-red/20 text-mas-red bg-mas-red/5',
    'Level 03': 'border-mas-red/40 text-mas-red bg-mas-red/10 shadow-[0_0_15px_rgba(200,16,46,0.1)]',
  };

  return (
    <div className={`px-4 py-1.5 rounded-full text-[12px] font-medium tracking-[0.2em] uppercase border flex items-center gap-2 w-fit mx-auto ${styles[level] || styles['Level 01']}`}>
      <div className={`w-1 h-1 rounded-full ${level === 'Level 03' ? 'bg-mas-red shadow-[0_0_5px_#C8102E] animate-pulse' : 'bg-current opacity-90'}`}></div>
      {level}
    </div>
  );
};

const BlacklistTable = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const blacklist = [
    { id: 1, name: 'Malith Gunawardena', docId: '199234567V', reason: 'UNAUTHORIZED_ENTRY_ATTEMPT_NODE_04', addedBy: 'SUJITH_COMMANDER', date: '2026-03-22', level: 'Level 03' },
    { id: 2, name: 'James Wilson', docId: 'P9876543', reason: 'ABUSIVE_BEHAVIOR_REPORTED_AT_PERIMETER', addedBy: 'ADMIN_PORTAL_AUTO', date: '2026-03-15', level: 'Level 02' },
    { id: 3, name: 'Sarah Chen', docId: 'NIC1223344V', reason: 'PROTOCOL_VIOLATION_RECURRING', addedBy: 'SECURITY_NODE_01', date: '2026-03-28', level: 'Level 01' },
  ];

  const filtered = blacklist.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.docId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-[#121214] border border-white/5 rounded-[40px] overflow-hidden flex flex-col shadow-3xl animate-fade-in-slow relative">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-mas-red/20 to-transparent"></div>

      {/* Header Hub */}
      <div className="px-10 py-10 border-b border-white/5 bg-[#161618] flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8 shadow-inner relative z-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="w-1.5 h-10 bg-mas-red rounded-full shadow-[0_0_10px_#C8102E] hidden sm:block"></div>
          <div className="w-10 h-1.5 bg-mas-red rounded-full shadow-[0_0_10px_#C8102E] sm:hidden mb-2"></div>
          <div>
            <h2 className="uppercase text-white text-[14px] font-bold tracking-[0.4em]">Enforcement Registry</h2>
            <p className="text-gray-300 uppercase text-[12px] font-medium tracking-widest mt-1 opacity-80">Global Restriction Database Node 08</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 w-full xl:w-auto">
          <div className="relative group flex-1 xl:w-96 w-full">
            <input
              type="text"
              placeholder="SEARCH_RESTRICTED_IDENTITIES..."
              className="w-full pl-12 pr-6 py-4 bg-[#0A0A0B] border border-white/5 rounded-2xl uppercase text-[13px] font-medium tracking-[0.2em] text-white placeholder:opacity-70 focus:border-mas-red/40 outline-none transition-all shadow-xl group-hover:border-white/10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-mas-red/40 group-focus-within:text-mas-red transition-colors" />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <button className="w-full sm:w-auto flex-1 items-center justify-center gap-3 px-8 py-4 bg-white/[0.02] border border-white/5 rounded-2xl uppercase text-[13px] font-medium tracking-[0.3em] text-white hover:bg-white hover:text-black transition-all group shrink-0 shadow-xl flex">
              <Download size={14} className="group-hover:scale-125 transition-transform" />
              <span>Export</span>
            </button>
            <button className="w-full sm:w-auto flex-1 items-center justify-center gap-3 px-8 py-4 bg-mas-red text-white border border-transparent rounded-2xl uppercase text-[13px] font-medium tracking-[0.3em] hover:bg-red-500 transition-all group shrink-0 shadow-[0_10px_20px_rgba(200,16,46,0.2)] flex">
              <UserX size={14} className="group-hover:scale-110 transition-transform" />
              <span>Enforce Protocol</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto sm:overflow-visible bg-[#0A0A0B] p-4 sm:p-0">
        <table className="w-full text-left border-separate border-spacing-y-4 sm:border-spacing-y-0 sm:border-collapse min-w-0 sm:min-w-[700px] block sm:table">
          <thead className="hidden sm:table-header-group">
            <tr className="bg-[#121214] border-b border-white/5">
              <th className="px-6 md:px-10 py-6 text-[13px] font-medium tracking-[0.3em] uppercase text-gray-300 opacity-80 whitespace-nowrap">Identity Identifier</th>
              <th className="px-6 md:px-10 py-6 text-[13px] font-medium tracking-[0.3em] uppercase text-gray-300 opacity-80 whitespace-nowrap">Operational Restriction</th>
              <th className="px-6 md:px-10 py-6 text-[13px] font-medium tracking-[0.3em] uppercase text-gray-300 opacity-80 text-center whitespace-nowrap">Threat Level</th>
              <th className="px-6 md:px-10 py-6 text-[13px] font-medium tracking-[0.3em] uppercase text-mas-red text-right pr-6 md:pr-12 whitespace-nowrap">Control</th>
            </tr>
          </thead>
          <tbody className="block sm:table-row-group">
            <AnimatePresence>
              {filtered.map((item, idx) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group hover:bg-mas-red/[0.02] transition-all duration-500 block sm:table-row bg-[#161618] sm:bg-transparent border border-white/5 sm:border-none rounded-[24px] sm:rounded-none mb-4 sm:mb-0 p-4 sm:p-0"
                >
                  <td className="block sm:table-cell px-2 sm:px-6 md:px-10 py-4 sm:py-8 border-b border-white/5 sm:border-none">
                    <span className="text-[14px] font-bold tracking-[0.2em] text-mas-red/60 uppercase block sm:hidden mb-4">Identity Identifier</span>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                      <div className="w-14 h-14 bg-[#121214] border border-white/5 rounded-2xl flex items-center justify-center text-mas-red text-lg font-medium group-hover:border-mas-red/50 group-hover:scale-110 transition-all duration-500 shadow-xl relative overflow-hidden shrink-0 mb-3 sm:mb-0">
                        <div className="absolute inset-0 bg-mas-red/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        {item.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-white uppercase text-[12px] font-medium tracking-widest mb-1.5 group-hover:text-mas-red transition-colors break-words">{item.name}</p>
                        <p className="text-gray-300/80 uppercase text-[12px] font-medium tracking-[0.2em] font-mono">{item.docId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="block sm:table-cell px-2 sm:px-10 py-4 sm:py-8 border-b border-white/5 sm:border-none">
                    <span className="text-[14px] font-bold tracking-[0.2em] text-mas-red/60 uppercase block sm:hidden mb-4">Operational Restriction</span>
                    <div className="flex flex-col gap-2">
                      <p className="text-white/80 uppercase text-[13px] font-medium tracking-widest leading-relaxed max-w-full sm:max-w-md break-words">{item.reason}</p>
                      <div className="flex items-center gap-4">
                        <p className="text-gray-300/80 uppercase text-[14px] font-medium tracking-[0.3em] flex items-center gap-2">
                          <User size={10} className="text-mas-red/40" /> {item.addedBy}
                        </p>
                        <span className="text-white/5 text-[14px]">|</span>
                        <p className="text-gray-300/80 uppercase text-[14px] font-medium tracking-[0.3em] flex items-center gap-2">
                          <Clock size={10} className="text-mas-red/40" /> {item.date}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="block sm:table-cell px-2 sm:px-10 py-4 sm:py-8 border-b border-white/5 sm:border-none">
                    <span className="text-[14px] font-bold tracking-[0.2em] text-mas-red/60 uppercase block sm:hidden mb-4">Threat Level</span>
                    <RestrictionLevel level={item.level} />
                  </td>
                  <td className="block sm:table-cell px-2 sm:px-10 py-4 sm:py-8 text-right sm:pr-12">
                    <span className="text-[14px] font-bold tracking-[0.2em] text-mas-red/60 uppercase block sm:hidden mb-4 text-left">Control Options</span>
                    <div className="flex justify-start sm:justify-end gap-3">
                      <button className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/[0.02] border border-white/5 text-gray-300 hover:text-white hover:bg-mas-red hover:border-mas-red transition-all duration-500 shadow-xl group/btn">
                        <Trash2 size={16} className="group-hover/btn:scale-110 transition-transform" />
                      </button>
                      <button className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/[0.02] border border-white/5 text-gray-300 hover:text-white hover:bg-[#121214] hover:border-white/20 transition-all duration-500 shadow-xl group/btn">
                        <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Protocol Summary Footer */}
      <div className="px-10 py-6 border-t border-white/5 bg-[#121214]/50 flex flex-col sm:flex-row justify-between items-center gap-6 sm:gap-0 relative">
        <div className="flex items-center gap-4 text-mas-red">
          <div className="w-2 h-2 bg-mas-red rounded-full animate-pulse shadow-[0_0_10px_#C8102E]"></div>
          <span className="text-[13px] font-medium uppercase tracking-[0.3em]">{filtered.length} RESTRICTED_NODES_IN_CURRENT_MATRIX</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-gray-300/80 text-[12px] font-medium uppercase tracking-[0.4em]">Node_Health: OPERATIONAL</span>
          <div className="w-10 h-1 bg-green-500/20 rounded-full overflow-hidden">
            <div className="w-full h-full bg-green-500 shadow-[0_0_5px_#22C55E]"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlacklistTable;
