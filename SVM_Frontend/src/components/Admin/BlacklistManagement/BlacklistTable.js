import React, { useState } from 'react';
import { Search, Plus, Trash2, Shield, User, AlertCircle, Clock, Download, ChevronRight, Hash, Ban, UserX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const RestrictionLevel = ({ level }) => {
  const styles = {
    'Level 01': 'border-blue-500/20 text-blue-500 bg-blue-500/5',
    'Level 02': 'border-primary/20 text-primary bg-primary/5',
    'Level 03': 'border-primary/40 text-primary bg-primary/10 shadow-[0_0_15px_rgba(200,16,46,0.1)]',
  };

  return (
    <div className={`px-4 py-1.5 rounded-full text-[12px] font-medium tracking-[0.2em] capitalize border flex items-center gap-2 w-fit mx-auto ${styles[level] || styles['Level 01']}`}>
      <div className={`w-1 h-1 rounded-full ${level === 'Level 03' ? 'bg-primary shadow-[0_0_5px_var(--color-primary)] animate-pulse' : 'bg-current opacity-90'}`}></div>
      {level}
    </div>
  );
};

const BlacklistTable = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const blacklist = [];

  const filtered = blacklist.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.docId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-[var(--color-bg-paper)] rounded-none overflow-hidden flex flex-col shadow-3xl animate-fade-in-slow relative">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>


      <div className="flex-1 overflow-x-auto sm:overflow-visible bg-[var(--color-bg-default)] p-4 sm:p-0">
        <table className="w-full text-left border-separate border-spacing-y-4 sm:border-spacing-y-0 sm:border-collapse min-w-0 sm:min-w-[700px] block sm:table">
          <thead className="hidden sm:table-header-group">
            <tr className="bg-[var(--color-bg-paper)] border-b border-white/5">
              <th className="px-6 md:px-10 py-6 text-[13px] font-medium tracking-[0.3em] capitalize text-gray-300 opacity-80 whitespace-nowrap">Visitor</th>
              <th className="px-6 md:px-10 py-6 text-[13px] font-medium tracking-[0.3em] capitalize text-gray-300 opacity-80 whitespace-nowrap">Blacklist Reason</th>
              <th className="px-6 md:px-10 py-6 text-[13px] font-medium tracking-[0.3em] capitalize text-gray-300 opacity-80 text-center whitespace-nowrap">Risk Level</th>
              <th className="px-6 md:px-10 py-6 text-[13px] font-medium tracking-[0.3em] capitalize text-primary text-right pr-6 md:pr-12 whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody className="block sm:table-row-group">
            <AnimatePresence>
              {filtered.length > 0 ? (
                filtered.map((item, idx) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group hover:bg-primary/[0.02] transition-all duration-500 block sm:table-row bg-[#161618] sm:bg-transparent border border-white/5 sm:border-none rounded-[24px] sm:rounded-none mb-4 sm:mb-0 p-4 sm:p-0"
                  >
                    <td className="block sm:table-cell px-2 sm:px-6 md:px-10 py-4 sm:py-8 border-b border-white/5 sm:border-none">
                      <span className="text-[13px] font-bold tracking-[0.2em] text-primary/60 capitalize block sm:hidden mb-4">Visitor</span>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                        <div>
                          <p className="text-white capitalize text-[13px] font-medium tracking-widest mb-1.5 group-hover:text-primary transition-colors break-words">{item.name}</p>
                          <p className="text-gray-300/80 capitalize text-[13px] font-medium tracking-[0.2em] font-mono">{item.docId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="block sm:table-cell px-2 sm:px-10 py-4 sm:py-8 border-b border-white/5 sm:border-none">
                      <span className="text-[13px] font-bold tracking-[0.2em] text-primary/60 capitalize block sm:hidden mb-4">Blacklist Reason</span>
                      <div className="flex flex-col gap-2">
                        <p className="text-white/80 capitalize text-[13px] font-medium tracking-widest leading-relaxed max-w-full sm:max-w-md break-words">{item.reason}</p>
                        <div className="flex items-center gap-4">
                          <p className="text-gray-300/80 capitalize text-[13px] font-medium tracking-[0.3em] flex items-center gap-2">
                            <User size={10} className="text-primary/40" /> {item.addedBy}
                          </p>
                          <span className="text-white/5 text-[13px]">|</span>
                          <p className="text-gray-300/80 capitalize text-[13px] font-medium tracking-[0.3em] flex items-center gap-2">
                            <Clock size={10} className="text-primary/40" /> {item.date}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="block sm:table-cell px-2 sm:px-10 py-4 sm:py-8 border-b border-white/5 sm:border-none">
                      <span className="text-[13px] font-bold tracking-[0.2em] text-primary/60 capitalize block sm:hidden mb-4">Risk Level</span>
                      <RestrictionLevel level={item.level} />
                    </td>
                    <td className="block sm:table-cell px-2 sm:px-10 py-4 sm:py-8 text-right sm:pr-12">
                      <span className="text-[13px] font-bold tracking-[0.2em] text-primary/60 capitalize block sm:hidden mb-4 text-left">Action</span>
                      <div className="flex justify-start sm:justify-end gap-3">
                        <button className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/[0.02] border border-white/5 text-gray-300 hover:text-white hover:bg-primary hover:border-primary transition-all duration-500 shadow-xl group/btn">
                          <Trash2 size={16} className="group-hover/btn:scale-110 transition-transform" />
                        </button>
                        <button className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/[0.02] border border-white/5 text-gray-300 hover:text-white hover:bg-[var(--color-bg-paper)] hover:border-white/20 transition-all duration-500 shadow-xl group/btn">
                          <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <motion.tr
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="block sm:table-row"
                >
                  <td colSpan="4" className="px-10 py-20 text-center block sm:table-cell">
                    <div className="flex flex-col items-center gap-6">
                      <div className="w-20 h-20 bg-primary/5 rounded-[32px] flex items-center justify-center border border-primary/10 shadow-inner">
                        <Shield size={32} className="text-primary/40" />
                      </div>
                      <div>
                        <h3 className="text-white text-lg font-bold capitalize tracking-[0.2em] mb-2">No Restricted Identities</h3>
                        <p className="text-gray-300/60 text-sm capitalize tracking-widest">Enforcement registry is currently clear.</p>
                      </div>
                    </div>
                  </td>
                </motion.tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default BlacklistTable;
