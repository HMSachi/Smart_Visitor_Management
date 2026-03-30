import React, { useState, useEffect } from 'react';
import { Check, X, Download, Search, Eye, ChevronUp, ChevronDown, User, Calendar, MapPin, Hash, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const StatusBadge = ({ status }) => {
  const styles = {
    'Approved': 'border-green-500/20 text-green-500 bg-green-500/5',
    'Pending': 'border-mas-red/20 text-mas-red bg-mas-red/5',
    'Rejected': 'border-white/10 text-mas-text-dim bg-white/5',
    'Checked In': 'border-blue-500/20 text-blue-500 bg-blue-500/5',
    'Checked Out': 'border-white/5 text-mas-text-dim/40 bg-transparent',
  };

  return (
    <div className={`px-4 py-1.5 rounded-full text-[9px] font-black tracking-[0.2em] uppercase border flex items-center gap-2 w-fit mx-auto ${styles[status] || styles['Pending']}`}>
      <div className={`w-1 h-1 rounded-full ${status === 'Approved' || status === 'Checked In' ? 'bg-green-500 shadow-[0_0_5px_#22c55e]' : status === 'Pending' ? 'bg-mas-red shadow-[0_0_5px_#C8102E] animate-pulse' : 'bg-mas-text-dim opacity-40'}`}></div>
      {status}
    </div>
  );
};

const VisitorTable = ({ visitors, onViewDetails, onAction }) => {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [expandedBatches, setExpandedBatches] = useState([]);

  const toggleBatch = (batchId) => {
    setExpandedBatches(prev =>
      prev.includes(batchId) ? prev.filter(id => id !== batchId) : [...prev, batchId]
    );
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return (
    <div className="bg-[#121214] border border-white/5 p-12 rounded-[40px] animate-pulse shadow-2xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-8">
        <div className="h-10 w-64 bg-white/[0.03] rounded-2xl"></div>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="h-12 w-full sm:w-48 bg-white/[0.03] rounded-2xl"></div>
          <div className="h-12 w-full sm:w-32 bg-white/[0.03] rounded-2xl"></div>
        </div>
      </div>
      <div className="space-y-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-24 bg-white/[0.02] w-full rounded-[24px]"></div>
        ))}
      </div>
    </div>
  );

  const filteredVisitors = (visitors || []).filter(visitor => {
    const matchesSearch = visitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (visitor.batchId && visitor.batchId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (visitor.nic && visitor.nic.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'All' || visitor.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-[#121214] border border-white/5 rounded-[40px] overflow-hidden flex flex-col shadow-2xl animate-fade-in-slow relative">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-mas-red/20 to-transparent"></div>

      {/* 1. Step Indicator Style Header */}
      <div className="px-10 pt-8 pb-8 border-b border-white/5 relative bg-[#121214]">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <span className="text-mas-red text-[11px] font-black tracking-[0.4em] uppercase mb-1">Global Registry</span>
              <p className="text-mas-text-dim text-[9px] font-black uppercase tracking-widest opacity-40 italic">Personnel Authorization Ledger Node 04</p>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-mas-red text-2xl font-black italic">01</span>
            <span className="text-white/10 text-sm font-black italic">/</span>
            <span className="text-white/20 text-xs font-black italic tracking-widest">REGISTRY</span>
          </div>
        </div>
      </div>

      {/* Filter Hub */}
      <div className="p-8 border-b border-white/5 bg-[#161618] flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8 shadow-inner relative z-10">
        <div className="flex items-center gap-6">
          <div className="w-1.5 h-10 bg-mas-red rounded-full shadow-[0_0_10px_#C8102E]"></div>
          <div>
            <h2 className="uppercase text-white text-[11px] font-black tracking-[0.4em]">Auth Protocol Hub</h2>
            <p className="text-mas-text-dim uppercase text-[9px] font-black tracking-widest mt-1 opacity-40 italic">Global Clearance Management System</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 w-full xl:w-auto">
          <div className="relative group flex-1 xl:w-96">
            <input
              type="text"
              placeholder="SEARCH PROTOCOL IDENTIFIER..."
              className="w-full pl-12 pr-6 py-4 bg-[#0A0A0B] border border-white/5 rounded-2xl uppercase text-[10px] font-black tracking-[0.2em] text-white placeholder:opacity-20 focus:border-mas-red/40 outline-none transition-all shadow-xl group-hover:border-white/10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-mas-red/40 group-focus-within:text-mas-red transition-colors" />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative group min-w-[200px]">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-6 pr-12 py-4 bg-[#0A0A0B] border border-white/5 rounded-2xl uppercase text-[10px] font-black tracking-[0.2em] text-mas-text-dim focus:text-white focus:border-mas-red/40 transition-all cursor-pointer outline-none appearance-none shadow-xl"
              >
                <option value="All">ALL_STATUS</option>
                <option value="Pending">PENDING_REVIEW</option>
                <option value="Approved">STABLE_AUTH</option>
                <option value="Rejected">DENIED_NODE</option>
                <option value="Checked In">PROTOCOL_ENGAGED</option>
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-20 group-hover:opacity-100 transition-opacity">
                <ChevronDown size={14} />
              </div>
            </div>

            <button className="flex items-center justify-center gap-3 px-8 py-4 bg-white/[0.02] border border-white/5 rounded-2xl uppercase text-[10px] font-black tracking-[0.3em] text-white hover:bg-white hover:text-black transition-all group shrink-0 shadow-xl">
              <Download size={14} className="group-hover:scale-125 transition-transform" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-[#0A0A0B]">
        {/* DESKTOP TABLE VIEW */}
        <table className="w-full text-left border-collapse hidden md:table">
          <thead>
            <tr className="bg-[#121214] border-b border-white/5">
              <th className="px-8 py-6 text-[10px] font-black tracking-[0.3em] uppercase text-mas-text-dim opacity-40 text-center w-24">Node</th>
              <th className="px-8 py-6 text-[10px] font-black tracking-[0.3em] uppercase text-mas-text-dim opacity-40">Personnel Identity</th>
              <th className="px-8 py-6 text-[10px] font-black tracking-[0.3em] uppercase text-mas-text-dim opacity-40">Protocol Reference</th>
              <th className="px-8 py-6 text-[10px] font-black tracking-[0.3em] uppercase text-mas-text-dim opacity-40">Schedule Matrix</th>
              <th className="px-8 py-6 text-[10px] font-black tracking-[0.3em] uppercase text-mas-text-dim opacity-40 text-center">Auth Status</th>
              <th className="px-8 py-6 text-[10px] font-black tracking-[0.3em] uppercase text-mas-red text-right pr-10 italic">Control</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.02]">
            {filteredVisitors.map((visitor) => (
              <React.Fragment key={visitor.batchId}>
                <tr className={`group transition-all duration-500 ${expandedBatches.includes(visitor.batchId) ? 'bg-mas-red/[0.02]' : 'hover:bg-white/[0.01]'}`}>
                  <td className="px-8 py-8 text-center">
                    <button
                      onClick={() => toggleBatch(visitor.batchId)}
                      className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all duration-500 shadow-lg ${expandedBatches.includes(visitor.batchId) ? 'bg-mas-red text-white border-mas-red rotate-180' : 'bg-[#0A0A0B] border-white/5 text-mas-text-dim hover:text-white hover:border-mas-red/50'}`}
                    >
                      {expandedBatches.includes(visitor.batchId) ? <ChevronUp size={16} /> : <div className="text-[10px] font-black">{visitor.members.length + 1}</div>}
                    </button>
                  </td>
                  <td className="px-8 py-8">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-[#121214] border border-white/5 rounded-2xl flex items-center justify-center text-mas-red text-sm font-black italic group-hover:border-mas-red/50 group-hover:scale-110 transition-all duration-500 shadow-xl overflow-hidden relative">
                        <div className="absolute inset-0 bg-mas-red/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        {visitor.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-white uppercase text-[11px] font-black tracking-widest mb-1">{visitor.name}</p>
                        <div className="flex items-center gap-2">
                          <div className="w-1 h-1 bg-mas-red rounded-full"></div>
                          <p className="text-mas-text-dim/40 uppercase text-[9px] font-black tracking-widest">Lead Personnel</p>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-8">
                    <p className="text-white uppercase text-[10px] font-black mb-1.5 font-mono tracking-[0.2em]">{visitor.batchId}</p>
                    <p className="text-mas-text-dim/40 uppercase text-[9px] font-black tracking-widest flex items-center gap-2 italic"><User size={10} className="text-mas-red/40" /> {visitor.contactPerson}</p>
                  </td>
                  <td className="px-8 py-8">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <Calendar size={12} className="text-mas-red/60" />
                        <span className="text-white uppercase text-[10px] font-black tracking-widest">{visitor.date}</span>
                        <span className="text-mas-text-dim/20">|</span>
                        <span className="text-mas-red text-[10px] font-black tracking-widest">{visitor.timeIn}</span>
                      </div>
                      <p className="text-mas-text-dim/40 uppercase text-[9px] font-black tracking-widest truncate max-w-[220px] flex items-center gap-2 italic"><MapPin size={10} className="text-mas-red/40" /> {visitor.areas.join(' | ')}</p>
                    </div>
                  </td>
                  <td className="px-8 py-8 text-center">
                    <StatusBadge status={visitor.status} />
                  </td>
                  <td className="px-8 py-8 text-right pr-10">
                    <div className="flex justify-end gap-3">
                      {visitor.status === 'Pending' && (
                        <>
                          <button onClick={() => onAction(visitor, 'Approve')} title="AUTHORIZE BATCH" className="w-10 h-10 rounded-xl flex items-center justify-center bg-green-500/5 border border-green-500/20 text-green-500 hover:bg-green-500 hover:text-white hover:border-green-500 transition-all duration-500 shadow-xl group/btn">
                            <Check size={16} strokeWidth={3} className="group-hover/btn:scale-110 transition-transform" />
                          </button>
                          <button onClick={() => onAction(visitor, 'Reject')} title="DENY BATCH" className="w-10 h-10 rounded-xl flex items-center justify-center bg-mas-red/5 border border-mas-red/20 text-mas-red hover:bg-mas-red hover:text-white hover:border-mas-red transition-all duration-500 shadow-xl group/btn">
                            <X size={16} strokeWidth={3} className="group-hover/btn:scale-110 transition-transform" />
                          </button>
                        </>
                      )}
                      <button onClick={() => onViewDetails(visitor)} title="INSPECT PROTOCOL" className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/[0.02] border border-white/5 text-mas-text-dim hover:text-white hover:bg-[#121214] hover:border-white/20 transition-all duration-500 shadow-xl group/btn">
                        <Eye size={16} className="group-hover/btn:rotate-12 transition-transform" />
                      </button>
                    </div>
                  </td>
                </tr>
                {/* Expandable Members Area (Desktop) */}
                <AnimatePresence>
                  {expandedBatches.includes(visitor.batchId) && visitor.members.length > 0 && (
                    <motion.tr
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-[#0A0A0B] border-b border-mas-red/10"
                    >
                      <td colSpan="6" className="px-0 py-0 overflow-hidden">
                        <div className="p-10 pl-32 space-y-6 bg-gradient-to-br from-[#0A0A0B] to-[#0E0E10] shadow-inner relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-64 h-64 bg-mas-red/5 rounded-full blur-[100px] pointer-events-none"></div>

                          <div className="flex items-center gap-4 mb-8">
                            <div className="w-1 h-4 bg-mas-red rounded-full shadow-[0_0_8px_#C8102E]"></div>
                            <p className="text-mas-red text-[11px] font-black uppercase tracking-[0.3em] italic">Personnel Unit Breakdown <span className="text-mas-text-dim/20 ml-2">// Institutional Registry</span></p>
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
                            {visitor.members.map((member, idx) => (
                              <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="flex items-center justify-between p-6 bg-[#121214] border border-white/5 hover:border-mas-red/30 transition-all duration-500 rounded-[24px] group/member shadow-2xl"
                              >
                                <div className="flex items-center gap-5">
                                  <div className="w-10 h-10 rounded-xl bg-[#0A0A0B] border border-white/5 flex items-center justify-center text-mas-text-dim text-[10px] font-bold group-hover/member:border-mas-red transition-all">
                                    {(idx + 2).toString().padStart(2, '0')}
                                  </div>
                                  <div className="flex flex-col gap-1">
                                    <span className="text-white text-[11px] font-black uppercase tracking-widest group-hover/member:text-mas-red transition-colors">{member.name}</span>
                                    <span className="text-mas-text-dim/40 text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2"><Hash size={10} className="text-mas-red/40" /> {member.nic}</span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <span className="text-[8px] text-mas-text-dim/20 font-black uppercase tracking-[0.3em] block mb-1">Contact Protocol</span>
                                  <span className="px-4 py-2 bg-black/40 border border-white/5 text-white/60 text-[10px] font-black tracking-widest rounded-xl shadow-inner group-hover/member:border-mas-red/20 transition-all">{member.contact}</span>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </td>
                    </motion.tr>
                  )}
                </AnimatePresence>
              </React.Fragment>
            ))}
          </tbody>
        </table>

        {/* MOBILE CARDS VIEW */}
        <div className="md:hidden flex flex-col p-8 gap-8">
          {filteredVisitors.map((visitor) => (
            <div key={visitor.batchId} className="bg-[#121214] border border-white/5 rounded-[32px] overflow-hidden shadow-2xl relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-mas-red/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

              {/* Mobile Card Header */}
              <div className="p-6 border-b border-white/5 flex justify-between items-start bg-black/20 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#0A0A0B] border border-white/5 flex items-center justify-center text-mas-red text-sm font-black italic rounded-2xl shrink-0 shadow-lg">
                    {visitor.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-white uppercase text-[11px] font-black tracking-widest mb-1 leading-tight">{visitor.name}</p>
                    <p className="text-mas-text-dim/40 uppercase text-[9px] font-black tracking-widest font-mono italic">{visitor.batchId}</p>
                  </div>
                </div>
                <StatusBadge status={visitor.status} />
              </div>

              {/* Mobile Card Body */}
              <div className="p-6 space-y-5 relative z-10">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] border-b border-white/[0.03] pb-4">
                  <span className="text-mas-text-dim/40 flex items-center gap-2"><Calendar size={12} className="text-mas-red/60" /> Deployed</span>
                  <span className="text-white">{visitor.date} <span className="text-mas-red mx-1">//</span> {visitor.timeIn}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] border-b border-white/[0.03] pb-4">
                  <span className="text-mas-text-dim/40 flex items-center gap-2"><MapPin size={12} className="text-mas-red/60" /> Zones</span>
                  <span className="text-white text-right max-w-[150px] truncate italic">{visitor.areas.join(' | ')}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] border-b border-white/[0.03] pb-4">
                  <span className="text-mas-text-dim/40 flex items-center gap-2"><User size={12} className="text-mas-red/60" /> Lead</span>
                  <span className="text-white truncate max-w-[150px]">{visitor.contactPerson}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em]">
                  <span className="text-mas-text-dim/40 flex items-center gap-2"><Shield size={12} className="text-mas-red/60" /> Unit Size</span>
                  <span className="text-mas-red bg-mas-red/10 px-3 py-1 rounded-full text-[9px]">{visitor.members.length + 1} PERSONNEL</span>
                </div>
              </div>

              {/* Expandable Members Area (Mobile) */}
              {visitor.members.length > 0 && (
                <div className="relative z-10">
                  <button
                    onClick={() => toggleBatch(visitor.batchId)}
                    className={`w-full py-5 px-6 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.3em] border-t transition-all ${expandedBatches.includes(visitor.batchId) ? 'bg-mas-red/5 border-mas-red/20 text-mas-red' : 'bg-black/20 border-white/5 text-mas-text-dim/40 hover:text-white'
                      }`}
                  >
                    <span>Unit Breakdown</span>
                    {expandedBatches.includes(visitor.batchId) ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  <AnimatePresence>
                    {expandedBatches.includes(visitor.batchId) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-black/40 relative"
                      >
                        <div className="p-6 space-y-4">
                          {visitor.members.map((member, idx) => (
                            <div key={idx} className="bg-[#0A0A0B] border border-white/5 p-5 rounded-2xl flex justify-between items-center shadow-lg group/mem">
                              <div>
                                <span className="text-white text-[10px] font-black uppercase tracking-widest block mb-1 group-hover/mem:text-mas-red transition-colors">{idx + 2}. {member.name}</span>
                                <span className="text-mas-text-dim/30 text-[9px] font-black uppercase tracking-[0.2em] block font-mono">NIC_: {member.nic}</span>
                              </div>
                              <div className="text-right">
                                <span className="text-[8px] text-mas-text-dim/20 font-black uppercase tracking-widest block mb-1">Contact</span>
                                <span className="text-white/60 text-[9px] font-black font-mono">{member.contact}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Mobile Card Actions */}
              <div className="p-6 border-t border-white/5 bg-black/40 flex gap-4 relative z-10">
                {visitor.status === 'Pending' && (
                  <>
                    <button onClick={() => onAction(visitor, 'Approve')} className="flex-1 h-14 flex justify-center items-center gap-3 bg-green-500/5 border border-green-500/20 text-green-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-green-500 hover:text-white transition-all shadow-xl">
                      <Check size={16} strokeWidth={3} /> <span>Approve</span>
                    </button>
                    <button onClick={() => onAction(visitor, 'Reject')} className="flex-1 h-14 flex justify-center items-center gap-3 bg-mas-red/5 border border-mas-red/20 text-mas-red text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-mas-red hover:text-white transition-all shadow-xl">
                      <X size={16} strokeWidth={3} /> <span>Reject</span>
                    </button>
                  </>
                )}
                <button onClick={() => onViewDetails(visitor)} className="flex-1 h-14 flex justify-center items-center gap-3 bg-white/[0.02] border border-white/5 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-white hover:text-black transition-all shadow-xl">
                  <Eye size={16} /> <span>Inspect</span>
                </button>
              </div>
            </div>
          ))}
          {filteredVisitors.length === 0 && (
            <div className="p-16 text-center bg-white/[0.01] border border-white/5 rounded-[40px] shadow-2xl">
              <div className="w-16 h-16 bg-[#121214] rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/5">
                <Shield size={24} className="text-mas-red opacity-20" />
              </div>
              <p className="text-mas-text-dim text-[11px] font-black uppercase tracking-[0.4em] opacity-40">No matching records found</p>
            </div>
          )}
        </div>
      </div>

      {/* Pagination Hub */}
      <div className="p-8 border-t border-white/5 flex flex-col xl:flex-row justify-between items-center bg-[#121214] gap-8 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-2 h-2 bg-mas-red rounded-full animate-pulse shadow-[0_0_8px_#C8102E]"></div>
          <p className="text-mas-text-dim uppercase text-[10px] font-black tracking-[0.3em] opacity-40 italic">
            Showing {filteredVisitors.length} <span className="text-white/20 mx-1">/</span> 28 synchronized entries
          </p>
        </div>

        <div className="flex items-center gap-4 w-full xl:w-auto">
          <button className="flex-1 xl:flex-none px-10 py-4 bg-white/[0.02] border border-white/5 text-mas-text-dim/40 text-[10px] font-black uppercase tracking-[0.4em] hover:text-white hover:border-mas-red/40 transition-all rounded-2xl shadow-xl">Prev</button>

          <div className="hidden xl:flex gap-3">
            <button className="w-12 h-12 flex items-center justify-center bg-mas-red text-white text-[10px] font-black rounded-xl shadow-[0_0_20px_rgba(200,16,46,0.3)]">1</button>
            <button className="w-12 h-12 flex items-center justify-center bg-white/[0.02] border border-white/5 text-mas-text-dim/40 text-[10px] font-black rounded-xl hover:text-white hover:border-mas-red/40 transition-all">2</button>
          </div>

          <button className="flex-1 xl:flex-none px-10 py-4 bg-white/[0.02] border border-white/5 text-mas-text-dim/40 text-[10px] font-black uppercase tracking-[0.4em] hover:text-white hover:border-mas-red/40 transition-all rounded-2xl shadow-xl">Next</button>
        </div>
      </div>
    </div>
  );
};

export default VisitorTable;
