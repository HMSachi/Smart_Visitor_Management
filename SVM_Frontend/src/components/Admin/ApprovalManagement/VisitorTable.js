import React, { useState, useEffect } from 'react';
import { Check, X, Download, Search, Eye, ChevronUp, ChevronDown, User, Calendar, MapPin, Hash, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const StatusBadge = ({ status }) => {
  const styles = {
    'Approved': 'bg-black text-green-500 border-green-500',
    'Pending': 'bg-black text-yellow-500 border-yellow-500',
    'Rejected': 'bg-black text-mas-red border-mas-red',
    'Checked In': 'bg-black text-blue-500 border-blue-500',
    'Checked Out': 'bg-black text-mas-text-dim border-mas-text-dim',
  };

  return (
    <span className={`px-2 py-1 text-[10px] sm:text-[11px] font-bold tracking-widest uppercase border ${styles[status] || styles['Pending']}`}>
      {status}
    </span>
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
    <div className="mas-panel p-8 animate-pulse border border-white/5">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="h-8 w-48 sm:w-64 bg-white/5 rounded"></div>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="h-10 w-full sm:w-40 bg-white/5 rounded"></div>
          <div className="h-10 w-full sm:w-32 bg-white/5 rounded"></div>
        </div>
      </div>
      <div className="space-y-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-20 sm:h-16 bg-white/[0.02] w-full rounded"></div>
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
    <div className="bg-[#0F0F10] border border-white/5 overflow-hidden flex flex-col">
      {/* 1. Step Indicator Style Header */}
      <div className="px-6 sm:px-8 pt-4 pb-6 border-b border-white/5 relative bg-[#0F0F10]">
        <div className="flex justify-between items-end mb-4">
          <div className="flex gap-2 text-white items-baseline">
            <span className="text-mas-red text-xl sm:text-base font-black">01</span>
            <span className="text-white/20">/</span>
            <span className="text-white/40">01</span>
          </div>
          <p className="text-mas-text-dim uppercase text-[10px] sm:text-xs font-bold tracking-[0.2em]">Authorization Registry</p>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/5">
          <div className="w-[120px] h-[3px] bg-mas-red -mt-[1px]"></div>
        </div>
      </div>

      {/* Table Title & Filters */}
      <div className="p-6 border-b border-white/5 bg-[#121212] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-8 h-[2px] bg-mas-red hidden sm:block"></div>
          <div>
            <h2 className="uppercase text-white text-base sm:text-lg tracking-wide font-black italic">Visitor Authorization</h2>
            <p className="text-gray-500 uppercase text-[9px] sm:text-[10px] font-bold tracking-[0.2em] mt-1">Clearance Protocol Hub</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row flex-wrap gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <input 
              type="text" 
              placeholder="SEARCH PROTOCOL..." 
              className="w-full pl-10 pr-4 py-3 sm:py-2 bg-[#0F0F10] border border-white/10 uppercase text-[10px] sm:text-xs font-bold text-white placeholder:text-gray-600 focus:border-mas-red outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          </div>
          
          <div className="flex gap-4">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 px-4 py-3 sm:py-2 bg-[#0F0F10] border border-white/10 uppercase text-[10px] sm:text-xs font-bold text-gray-400 focus:text-white focus:border-mas-red transition-all cursor-pointer outline-none appearance-none"
            >
              <option value="All">ALL STATUS</option>
              <option value="Pending">PENDING</option>
              <option value="Approved">APPROVED</option>
              <option value="Rejected">REJECTED</option>
              <option value="Checked In">CHECKED IN</option>
            </select>

            <button className="flex items-center justify-center gap-2 px-6 sm:px-4 py-3 sm:py-2 bg-white/[0.02] border border-white/10 uppercase text-[10px] sm:text-xs font-black tracking-widest text-white hover:bg-white hover:text-black transition-all group shrink-0">
              <Download size={14} className="group-hover:translate-y-px transition-transform" /> <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-[#0F0F10]">
        {/* DESKTOP TABLE VIEW */}
        <table className="w-full text-left border-collapse hidden md:table">
          <thead>
            <tr className="bg-[#121212] border-b border-white/5">
              <th className="px-6 py-4 text-[10px] font-black tracking-[0.2em] uppercase text-gray-500 text-center w-16">Unit</th>
              <th className="px-6 py-4 text-[10px] font-black tracking-[0.2em] uppercase text-gray-500">Main Identity</th>
              <th className="px-6 py-4 text-[10px] font-black tracking-[0.2em] uppercase text-gray-500">Reference / Contact</th>
              <th className="px-6 py-4 text-[10px] font-black tracking-[0.2em] uppercase text-gray-500">Schedule Protocol</th>
              <th className="px-6 py-4 text-[10px] font-black tracking-[0.2em] uppercase text-gray-500 text-center">Authorization</th>
              <th className="px-6 py-4 text-[10px] font-black tracking-[0.2em] uppercase text-mas-red text-right pr-6 italic">Control</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03]">
            {filteredVisitors.map((visitor) => (
              <React.Fragment key={visitor.batchId}>
                <tr className={`group transition-all ${expandedBatches.includes(visitor.batchId) ? 'bg-[#121212]' : 'hover:bg-white/[0.02]'}`}>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => toggleBatch(visitor.batchId)}
                      className={`w-8 h-8 border flex items-center justify-center transition-all ${expandedBatches.includes(visitor.batchId) ? 'bg-mas-red text-white border-mas-red' : 'bg-black border-white/10 text-gray-500 hover:text-white hover:border-white/30'}`}
                    >
                      {expandedBatches.includes(visitor.batchId) ? <ChevronUp size={14} /> : <div className="text-xs font-bold">{visitor.members.length + 1}</div>}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-mas-red/10 border border-mas-red/20 flex items-center justify-center text-mas-red text-sm font-black italic group-hover:bg-mas-red group-hover:text-white transition-all shrink-0">
                        {visitor.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-white uppercase text-xs font-black tracking-wide mb-1">{visitor.name}</p>
                        <p className="text-mas-red/70 uppercase text-[9px] font-bold tracking-widest">Lead Personnel</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-white uppercase text-xs font-bold mb-1 font-mono tracking-wider">{visitor.batchId}</p>
                    <p className="text-gray-500 uppercase text-[10px] font-bold tracking-widest flex items-center gap-1"><User size={10} /> {visitor.contactPerson}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-white uppercase text-xs font-bold mb-1 flex items-center gap-2"><Calendar size={12} className="text-mas-red/50" /> {visitor.date} @ {visitor.timeIn}</p>
                    <p className="text-gray-500 uppercase text-[10px] font-bold tracking-widest truncate max-w-[200px] flex items-center gap-1"><MapPin size={10} /> {visitor.areas.join(' | ')}</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <StatusBadge status={visitor.status} />
                  </td>
                  <td className="px-6 py-4 text-right pr-6">
                    <div className="flex justify-end gap-2">
                       {visitor.status === 'Pending' && (
                        <>
                          <button onClick={() => onAction(visitor, 'Approve')} title="AUTHORIZE BATCH" className="w-8 h-8 flex items-center justify-center bg-white/[0.02] border border-green-500/30 text-green-500 hover:bg-green-500 hover:text-white hover:border-green-500 transition-all">
                            <Check size={14} strokeWidth={3} />
                          </button>
                          <button onClick={() => onAction(visitor, 'Reject')} title="DENY BATCH" className="w-8 h-8 flex items-center justify-center bg-white/[0.02] border border-mas-red/30 text-mas-red hover:bg-mas-red hover:text-white hover:border-mas-red transition-all">
                            <X size={14} strokeWidth={3} />
                          </button>
                        </>
                      )}
                      <button onClick={() => onViewDetails(visitor)} title="INSPECT PROTOCOL" className="w-8 h-8 flex items-center justify-center bg-white/[0.02] border border-white/10 text-white hover:bg-white hover:text-black hover:border-white transition-all">
                        <Eye size={14} />
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
                      className="bg-black border-b-2 border-mas-red/20"
                    >
                      <td colSpan="6" className="px-0 py-0 overflow-hidden">
                        <div className="p-8 pl-24 space-y-4 border-l-4 border-mas-red bg-[#0F0F10] shadow-inner">
                          <p className="text-mas-red text-[10px] font-black uppercase tracking-[0.2em] mb-6 italic">Personnel Unit Breakdown (Institutional Registry)</p>
                          <div className="grid grid-cols-2 gap-4">
                              {visitor.members.map((member, idx) => (
                                <div key={idx} className="flex items-center justify-between p-5 bg-white/[0.02] border border-white/5 hover:border-mas-red/20 transition-colors rounded-xl group/member">
                                  <div className="flex items-start gap-4">
                                    <span className="text-gray-600 font-mono font-bold text-xs mt-0.5">{(idx + 2).toString().padStart(2, '0')}</span>
                                    <div className="flex flex-col gap-1">
                                      <span className="text-white text-xs font-black uppercase tracking-wide group-hover/member:text-mas-red transition-colors">{member.name}</span>
                                      <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1"><Hash size={10} /> {member.nic}</span>
                                    </div>
                                  </div>
                                  <div className="text-right flex flex-col items-end">
                                      <span className="text-[9px] text-gray-600 font-bold uppercase tracking-widest mb-1">Contact Status</span>
                                      <span className="px-3 py-1 bg-white/5 border border-white/10 text-white text-[10px] font-bold rounded">{member.contact}</span>
                                  </div>
                                </div>
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
        <div className="md:hidden flex flex-col p-4 gap-4">
            {filteredVisitors.map((visitor) => (
                <div key={visitor.batchId} className="bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden shadow-lg">
                    {/* Mobile Card Header */}
                    <div className="p-4 border-b border-white/5 flex justify-between items-start bg-black/40">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-mas-red/10 border border-mas-red/20 flex items-center justify-center text-mas-red text-sm font-black italic rounded-xl shrink-0">
                                {visitor.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                                <p className="text-white uppercase text-xs font-black tracking-wide mb-1 leading-tight">{visitor.name}</p>
                                <p className="text-gray-500 uppercase text-[9px] font-bold tracking-widest font-mono">{visitor.batchId}</p>
                            </div>
                        </div>
                        <StatusBadge status={visitor.status} />
                    </div>

                    {/* Mobile Card Body */}
                    <div className="p-4 space-y-4">
                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest border-b border-white/[0.02] pb-3">
                            <span className="text-gray-500 flex items-center gap-1.5"><Calendar size={12} className="text-mas-red" /> Deployed</span>
                            <span className="text-white">{visitor.date} @ {visitor.timeIn}</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest border-b border-white/[0.02] pb-3">
                            <span className="text-gray-500 flex items-center gap-1.5"><MapPin size={12} className="text-mas-red" /> Zones</span>
                            <span className="text-white text-right max-w-[150px] truncate">{visitor.areas.join(' | ')}</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest border-b border-white/[0.02] pb-3">
                            <span className="text-gray-500 flex items-center gap-1.5"><User size={12} className="text-mas-red" /> Contact</span>
                            <span className="text-white truncate max-w-[150px]">{visitor.contactPerson}</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                            <span className="text-gray-500 flex items-center gap-1.5"><Shield size={12} className="text-mas-red" /> Group Size</span>
                            <span className="text-white bg-white/10 px-2 py-0.5 rounded">{visitor.members.length + 1} Persons</span>
                        </div>
                    </div>

                    {/* Expandable Members Area (Mobile) */}
                    {visitor.members.length > 0 && (
                        <div>
                             <button
                                onClick={() => toggleBatch(visitor.batchId)}
                                className={`w-full py-3 px-4 flex justify-between items-center text-[10px] font-black uppercase tracking-widest border-t transition-colors ${
                                    expandedBatches.includes(visitor.batchId) ? 'bg-mas-red/10 border-mas-red/20 text-mas-red' : 'bg-black/40 border-white/5 text-gray-400 hover:text-white'
                                }`}
                            >
                                <span>View Unit Breakdown</span>
                                {expandedBatches.includes(visitor.batchId) ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            </button>
                            <AnimatePresence>
                                {expandedBatches.includes(visitor.batchId) && (
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: 'auto' }}
                                        exit={{ height: 0 }}
                                        className="overflow-hidden bg-black/60 relative"
                                    >
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-mas-red/50"></div>
                                        <div className="p-4 space-y-3">
                                            {visitor.members.map((member, idx) => (
                                                <div key={idx} className="bg-white/[0.03] border border-white/5 p-3 rounded-xl flex justify-between items-center">
                                                    <div>
                                                        <span className="text-white text-[10px] font-black uppercase tracking-wide block mb-1">{idx + 2}. {member.name}</span>
                                                        <span className="text-gray-500 text-[9px] font-bold uppercase tracking-widest block font-mono">NIC: {member.nic}</span>
                                                    </div>
                                                    <div className="text-right">
                                                         <span className="text-gray-600 text-[8px] font-bold uppercase tracking-widest block mb-1">Contact</span>
                                                         <span className="text-white text-[9px] font-black">{member.contact}</span>
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
                    <div className="p-4 border-t border-white/5 bg-[#121212] flex gap-2">
                        {visitor.status === 'Pending' && (
                            <>
                                <button onClick={() => onAction(visitor, 'Approve')} className="flex-1 py-3 flex justify-center items-center gap-2 bg-green-500/10 border border-green-500/30 text-green-500 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-green-500 hover:text-white transition-all">
                                    <Check size={14} strokeWidth={3} /> <span className="hidden sm:inline">Approve</span>
                                </button>
                                <button onClick={() => onAction(visitor, 'Reject')} className="flex-1 py-3 flex justify-center items-center gap-2 bg-mas-red/10 border border-mas-red/30 text-mas-red text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-mas-red hover:text-white transition-all">
                                    <X size={14} strokeWidth={3} /> <span className="hidden sm:inline">Reject</span>
                                </button>
                            </>
                        )}
                        <button onClick={() => onViewDetails(visitor)} className="flex-1 py-3 flex justify-center items-center gap-2 bg-white/[0.03] border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-white hover:text-black transition-all">
                            <Eye size={14} /> <span className="hidden sm:inline">Inspect</span>
                        </button>
                    </div>
                </div>
            ))}
            {filteredVisitors.length === 0 && (
                 <div className="p-8 text-center bg-white/[0.01] border border-white/5 rounded-2xl">
                     <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">No matching records found</p>
                 </div>
            )}
        </div>
      </div>
      
      {/* Pagination Footer */}
      <div className="p-4 sm:p-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center bg-[#121212] gap-4 z-10">
        <p className="text-gray-500 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] order-2 sm:order-1 text-center sm:text-left w-full sm:w-auto">
            Showing {filteredVisitors.length} of 28 synchronized entries
        </p>
        <div className="flex gap-2 order-1 sm:order-2 w-full sm:w-auto justify-center">
          <button className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-2 border border-white/10 text-gray-400 text-[10px] font-black uppercase tracking-widest hover:text-white hover:border-mas-red hover:bg-white/[0.02] transition-all rounded-lg sm:rounded-none">Prev</button>
          
          <button className="hidden sm:block px-4 py-2 border border-mas-red text-white bg-mas-red/5 text-[10px] font-black uppercase transition-all">1</button>
          <button className="hidden sm:block px-4 py-2 border border-white/10 text-gray-400 text-[10px] font-black uppercase hover:text-white hover:border-mas-red transition-all">2</button>
          
          <button className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-2 border border-white/10 text-gray-400 text-[10px] font-black uppercase tracking-widest hover:text-white hover:border-mas-red hover:bg-white/[0.02] transition-all rounded-lg sm:rounded-none">Next</button>
        </div>
      </div>
    </div>
  );
};

export default VisitorTable;
