import React, { useState } from 'react';
import {
  Trash2, Shield, User, Clock, ChevronRight, Eye, UserPlus, Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BlacklistDetailModal from './BlacklistDetailModal';
import AddBlacklistModal from './AddBlacklistModal';

/* ─────────────────────────────────────────────
   Risk Level badge
───────────────────────────────────────────── */
const RestrictionLevel = ({ level }) => {
  const styles = {
    'Level 01': 'border-blue-500/20 text-blue-500 bg-blue-500/5',
    'Level 02': 'border-primary/20 text-primary bg-primary/5',
    'Level 03': 'border-primary/40 text-primary bg-primary/10 shadow-[0_0_15px_rgba(200,16,46,0.1)]',
  };

  return (
    <div
      className={`px-4 py-1.5 rounded-full text-[12px] font-medium tracking-[0.2em] capitalize border flex items-center gap-2 w-fit mx-auto ${
        styles[level] || styles['Level 01']
      }`}
    >
      <div
        className={`w-1 h-1 rounded-full ${
          level === 'Level 03'
            ? 'bg-primary shadow-[0_0_5px_var(--color-primary)] animate-pulse'
            : 'bg-current opacity-90'
        }`}
      />
      {level}
    </div>
  );
};

/* ─────────────────────────────────────────────
   Main table component
───────────────────────────────────────────── */
const BlacklistTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  /* ── State for blacklist data ── */
  const [blacklist, setBlacklist] = useState([
    {
      id: "BL-001",
      name: "John Doe",
      docId: "901234567V",
      phone: "+94 77 123 4567",
      email: "john.doe@example.com",
      company: "Tech Solutions Inc",
      reason: "Repeated unauthorized access attempts to the server room.",
      addedBy: "System Admin",
      date: "2026-03-15",
      level: "Level 03",
      contactPersonName: "Saman Perera",
      contactPersonPhone: "+94 71 111 2222",
      contactPersonEmail: "saman.p@mas.com",
      contactPersonDepartment: "Information Technology",
    },
    {
      id: "BL-002",
      name: "Jane Smith",
      docId: "857766554V",
      phone: "+94 75 987 6543",
      email: "jane.s@gmail.com",
      company: "Freelance",
      reason: "Violation of security protocol during previous visit.",
      addedBy: "Security Officer",
      date: "2026-04-10",
      level: "Level 02",
      contactPersonName: "Nimali Silva",
      contactPersonPhone: "+94 77 333 4444",
      contactPersonEmail: "nimali.s@mas.com",
      contactPersonDepartment: "Finance",
    }
  ]);

  const filtered = blacklist.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.docId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDetails = (item) => {
    setSelectedPerson(item);
    setIsDetailModalOpen(true);
  };

  const handleAddPerson = (newPerson) => {
    setBlacklist(prev => [newPerson, ...prev]);
  };

  return (
    <>
      {/* ── Blacklist detail modal ── */}
      <BlacklistDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        person={selectedPerson}
      />

      {/* ── Add new blacklist modal ── */}
      <AddBlacklistModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddPerson}
      />

      {/* ── Table Container ── */}
      <div className="space-y-6 animate-fade-in-slow">
        
        {/* ── Toolbar ── */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-[var(--color-bg-paper)] p-6 rounded-[32px] border border-white/5 shadow-xl">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search identity or document ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-white text-sm focus:outline-none focus:border-primary/50 transition-all placeholder:text-gray-500 shadow-inner"
            />
          </div>
          
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="w-full md:w-auto px-8 py-3.5 bg-primary text-white text-xs font-bold uppercase tracking-[0.2em] rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-lg shadow-primary/20 active:scale-[0.98] group"
          >
            <UserPlus size={18} className="group-hover:rotate-12 transition-transform" />
            Add New Identity
          </button>
        </div>

        {/* ── Table card ── */}
        <div className="bg-[var(--color-bg-paper)] border border-white/5 rounded-[40px] overflow-hidden flex flex-col shadow-3xl relative">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

        <div className="flex-1 overflow-x-auto sm:overflow-visible bg-[var(--color-bg-default)] p-4 sm:p-0">
          <table className="w-full text-left border-separate border-spacing-y-4 sm:border-spacing-y-0 sm:border-collapse min-w-0 sm:min-w-[700px] block sm:table">
            <thead className="hidden sm:table-header-group">
              <tr className="bg-[var(--color-bg-paper)] border-b border-white/5">
                <th className="px-6 md:px-10 py-6 text-[13px] font-medium tracking-[0.3em] capitalize text-gray-300 opacity-80 whitespace-nowrap">
                  Visitor
                </th>
                <th className="px-6 md:px-10 py-6 text-[13px] font-medium tracking-[0.3em] capitalize text-gray-300 opacity-80 whitespace-nowrap">
                  Blacklist Reason
                </th>
                <th className="px-6 md:px-10 py-6 text-[13px] font-medium tracking-[0.3em] capitalize text-gray-300 opacity-80 text-center whitespace-nowrap">
                  Risk Level
                </th>
                <th className="px-6 md:px-10 py-6 text-[13px] font-medium tracking-[0.3em] capitalize text-primary text-right pr-6 md:pr-12 whitespace-nowrap">
                  Action
                </th>
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
                      {/* Visitor */}
                      <td className="block sm:table-cell px-2 sm:px-6 md:px-10 py-4 sm:py-8 border-b border-white/5 sm:border-none">
                        <span className="text-[13px] font-bold tracking-[0.2em] text-primary/60 capitalize block sm:hidden mb-4">
                          Visitor
                        </span>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                          <div>
                            <p className="text-white capitalize text-[13px] font-medium tracking-widest mb-1.5 group-hover:text-primary transition-colors break-words">
                              {item.name}
                            </p>
                            <p className="text-gray-300/80 capitalize text-[13px] font-medium tracking-[0.2em] font-mono">
                              {item.docId}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Reason */}
                      <td className="block sm:table-cell px-2 sm:px-10 py-4 sm:py-8 border-b border-white/5 sm:border-none">
                        <span className="text-[13px] font-bold tracking-[0.2em] text-primary/60 capitalize block sm:hidden mb-4">
                          Blacklist Reason
                        </span>
                        <div className="flex flex-col gap-2">
                          <p className="text-white/80 capitalize text-[13px] font-medium tracking-widest leading-relaxed max-w-full sm:max-w-md break-words">
                            {item.reason}
                          </p>
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

                      {/* Risk Level */}
                      <td className="block sm:table-cell px-2 sm:px-10 py-4 sm:py-8 border-b border-white/5 sm:border-none">
                        <span className="text-[13px] font-bold tracking-[0.2em] text-primary/60 capitalize block sm:hidden mb-4">
                          Risk Level
                        </span>
                        <RestrictionLevel level={item.level} />
                      </td>

                      {/* Actions */}
                      <td className="block sm:table-cell px-2 sm:px-10 py-4 sm:py-8 text-right sm:pr-12">
                        <span className="text-[13px] font-bold tracking-[0.2em] text-primary/60 capitalize block sm:hidden mb-4 text-left">
                          Action
                        </span>
                        <div className="flex justify-start sm:justify-end gap-3">
                          {/* ── View Details button ── */}
                          <button
                            onClick={() => handleViewDetails(item)}
                            title="View Details"
                            className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-500/5 border border-blue-500/20 text-blue-400 hover:text-white hover:bg-blue-500 hover:border-blue-500 transition-all duration-500 shadow-xl group/btn"
                          >
                            <Eye size={16} className="group-hover/btn:scale-110 transition-transform" />
                          </button>

                          {/* Delete */}
                          <button
                            title="Remove from Blacklist"
                            className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/[0.02] border border-white/5 text-gray-300 hover:text-white hover:bg-primary hover:border-primary transition-all duration-500 shadow-xl group/btn"
                          >
                            <Trash2 size={16} className="group-hover/btn:scale-110 transition-transform" />
                          </button>

                          {/* Navigate */}
                          <button
                            title="Go to profile"
                            className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/[0.02] border border-white/5 text-gray-300 hover:text-white hover:bg-[var(--color-bg-paper)] hover:border-white/20 transition-all duration-500 shadow-xl group/btn"
                          >
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
                          <h3 className="text-white text-lg font-bold capitalize tracking-[0.2em] mb-2">
                            No Restricted Identities
                          </h3>
                          <p className="text-gray-300/60 text-sm capitalize tracking-widest">
                            Enforcement registry is currently clear.
                          </p>
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
    </div>
  </>
);
};

export default BlacklistTable;
