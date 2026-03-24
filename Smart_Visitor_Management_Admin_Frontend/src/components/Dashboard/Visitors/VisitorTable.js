import React, { useState, useEffect } from 'react';
import { MoreVertical, Check, X, Filter, Download, Search, Eye, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ApprovalModal from './ApprovalModal';

const StatusBadge = ({ status }) => {
  const styles = {
    'Approved': 'bg-black text-green-500 border-green-500',
    'Pending': 'bg-black text-yellow-500 border-yellow-500',
    'Rejected': 'bg-black text-mas-red border-mas-red',
    'Checked In': 'bg-black text-blue-500 border-blue-500',
    'Checked Out': 'bg-black text-mas-text-dim border-mas-text-dim',
  };

  return (
    <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider border ${styles[status] || styles['Pending']}`}>
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
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);


  if (loading) return (
    <div className="mas-panel p-8 animate-pulse">
      <div className="flex justify-between items-center mb-8">
        <div className="h-8 w-64 bg-mas-gray"></div>
        <div className="flex gap-4">
          <div className="h-10 w-40 bg-mas-gray"></div>
          <div className="h-10 w-32 bg-mas-gray"></div>
        </div>
      </div>
      <div className="space-y-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-16 bg-mas-gray/50 w-full"></div>
        ))}
      </div>
    </div>
  );

  const filteredVisitors = (visitors || []).filter(visitor => {
    const matchesSearch = visitor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         visitor.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (visitor.batchId && visitor.batchId.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         visitor.nic.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || visitor.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-[#0F0F10] border border-white/5 overflow-hidden">
      {/* 1. Step Indicator Style Header */}
      <div className="px-8 pt-4 pb-6 border-b border-white/5 relative bg-[#0F0F10]">
        <div className="flex justify-between items-end mb-4">
          <div className="flex gap-2 text-[12px] font-bold text-white italic">
            <span className="text-mas-red">01</span>
            <span className="text-white/20">/</span>
            <span className="text-white/40">01</span>
          </div>
          <p className="text-[10px] font-bold text-mas-text-dim uppercase tracking-[0.5em]">Authorization Registry</p>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/5">
          <div className="w-1/4 h-[3px] bg-mas-red -mt-[1px]"></div>
        </div>
      </div>

      {/* Table Title & Filters */}
      <div className="p-6 border-b border-white/5 bg-[#121212] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-8 h-[2px] bg-mas-red"></div>
          <div>
            <h2 className="text-lg font-bold uppercase tracking-tighter text-white leading-none">Visitor Authorization</h2>
            <p className="text-[8px] text-mas-text-dim uppercase tracking-[0.4em] mt-2 font-bold">Clearance Protocol Hub</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <input 
              type="text" 
              placeholder="SEARCH BY NAME, NIC, OR ID..." 
              className="w-full pl-10 pr-4 py-2.5 bg-[#0F0F10] border border-white/10 text-[9px] uppercase font-bold tracking-widest text-white placeholder:text-white/20 focus:border-mas-red outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-mas-text-dim" />
          </div>
          
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-5 py-2.5 bg-[#0F0F10] border border-white/10 text-[9px] uppercase font-bold tracking-[0.2em] text-mas-text-dim focus:text-white focus:border-mas-red transition-all cursor-pointer outline-none appearance-none"
          >
            <option value="All">ALL STATUS</option>
            <option value="Pending">PENDING</option>
            <option value="Approved">APPROVED</option>
            <option value="Rejected">REJECTED</option>
            <option value="Checked In">CHECKED IN</option>
          </select>

          <button className="flex items-center gap-3 px-5 py-2.5 border border-white/10 text-[9px] uppercase font-bold tracking-[0.2em] text-mas-text-dim hover:text-white hover:border-mas-red transition-all group">
            <Download size={12} className="group-hover:text-mas-red" /> Export
          </button>
        </div>
      </div>

      <div className="overflow-x-auto overflow-y-hidden bg-[#0F0F10]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#121212] border-b border-white/5 text-[8px]">
              <th className="px-8 py-4 uppercase tracking-[0.4em] font-bold text-mas-text-dim text-center w-16 italic">Unit</th>
              <th className="px-8 py-4 uppercase tracking-[0.4em] font-bold text-mas-text-dim">Main Identity</th>
              <th className="px-8 py-4 uppercase tracking-[0.4em] font-bold text-mas-text-dim">Reference / Contact</th>
              <th className="px-8 py-4 uppercase tracking-[0.4em] font-bold text-mas-text-dim">Schedule Protocol</th>
              <th className="px-8 py-4 uppercase tracking-[0.4em] font-bold text-mas-text-dim text-center">Authorization</th>
              <th className="px-8 py-4 uppercase tracking-[0.4em] font-bold text-mas-text-dim text-right pr-12 text-mas-red italic">Control</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03]">
            {filteredVisitors.map((visitor) => (
              <React.Fragment key={visitor.batchId}>
                <tr className={`group transition-all ${expandedBatches.includes(visitor.batchId) ? 'bg-[#121212]' : 'hover:bg-white/[0.01]'}`}>
                  <td className="px-8 py-4 text-center">
                    <button 
                      onClick={() => toggleBatch(visitor.batchId)}
                      className={`w-6 h-6 border flex items-center justify-center transition-all ${expandedBatches.includes(visitor.batchId) ? 'bg-mas-red text-white border-mas-red' : 'bg-black border-white/10 text-mas-text-dim hover:text-white hover:border-white'}`}
                    >
                      {expandedBatches.includes(visitor.batchId) ? <ChevronUp size={10} /> : <div className="text-[8px] font-bold">{visitor.members.length + 1}</div>}
                    </button>
                  </td>
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-5">
                      <div className="w-9 h-9 bg-black border border-white/10 flex items-center justify-center text-[10px] font-bold text-mas-red group-hover:border-mas-red transition-all shrink-0">
                        {visitor.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold text-white uppercase tracking-tighter mb-1 leading-none">{visitor.name}</p>
                        <p className="text-[7.5px] text-mas-red/60 font-bold tracking-[0.4em] uppercase italic">Lead Personnel</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <p className="text-[9px] text-white font-semibold uppercase tracking-widest mb-1 leading-none">{visitor.batchId}</p>
                    <p className="text-[7.5px] text-mas-text-dim font-bold tracking-[0.2em] uppercase">{visitor.contactPerson}</p>
                  </td>
                  <td className="px-8 py-4">
                    <p className="text-[10px] text-white font-semibold uppercase mb-1 leading-none">{visitor.date} @ {visitor.timeIn}</p>
                    <p className="text-[7.5px] text-mas-text-dim uppercase font-bold tracking-tighter line-clamp-1 italic">{visitor.areas.join(' | ')}</p>
                  </td>
                  <td className="px-8 py-4 text-center">
                    <StatusBadge status={visitor.status} />
                  </td>
                  <td className="px-8 py-4 text-right pr-12">
                    <div className="flex justify-end gap-3 text-[10px]">
                      {visitor.status === 'Pending' && (
                        <>
                          <button onClick={() => onAction(visitor, 'Approve')} title="APPROVE BATCH" className="p-2 border border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-all">
                            <Check size={16} />
                          </button>
                          <button onClick={() => onAction(visitor, 'Reject')} title="REJECT BATCH" className="p-2 border border-mas-red text-mas-red hover:bg-mas-red hover:text-white transition-all">
                            <X size={16} />
                          </button>
                        </>
                      )}
                      <button onClick={() => onViewDetails(visitor)} title="VIEW DETAILS" className="p-2 border border-white/10 text-white hover:bg-white hover:text-black transition-all">
                        <Eye size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
                {/* Expandable Members Area - NO TRANSPARENCY */}
                <AnimatePresence>
                  {expandedBatches.includes(visitor.batchId) && visitor.members.length > 0 && (
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="bg-black"
                    >
                      <td colSpan="6" className="px-0 py-0 overflow-hidden">
                        <div className="p-6 pl-24 space-y-4 border-l-4 border-mas-red mb-6 mt-2 bg-[#0F0F10]">
                          <p className="text-[9px] text-mas-red font-bold uppercase tracking-[0.5em] mb-6 italic">Personnel Unit Breakdown (Institutional Registry)</p>
                          {visitor.members.map((member, idx) => (
                            <div key={idx} className="flex items-center justify-between p-6 bg-[#121212] border border-white/5 hover:border-mas-red/20 transition-all">
                              <div className="flex items-center gap-8">
                                <span className="text-[11px] font-bold text-white/20">{(idx + 2).toString().padStart(2, '0')}</span>
                                <div className="flex flex-col gap-1">
                                  <span className="text-sm font-semibold text-white uppercase tracking-tighter leading-none">{member.name}</span>
                                  <span className="text-[10px] text-mas-text-dim uppercase tracking-[0.3em] font-bold">NIC: {member.nic}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-12">
                                <div className="text-right">
                                  <p className="text-[9px] text-mas-text-dim uppercase tracking-[0.4em] font-bold mb-1">Direct Contact</p>
                                  <p className="text-[11px] text-white font-medium leading-none italic">{member.contact}</p>
                                </div>
                                <div className="px-4 py-2 bg-black border border-white/10 text-[9px] text-mas-text-dim uppercase font-bold tracking-[0.3em]">
                                  Authorization Active
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                    </motion.tr>
                  )}
                </AnimatePresence>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="p-6 border-t border-mas-border flex flex-col sm:flex-row justify-between items-center bg-mas-dark/20 gap-4">
        <p className="text-[9px] text-mas-text-dim uppercase tracking-[0.3em] font-bold">Showing 3 of 28 synchronized entries</p>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 border border-mas-border text-[9px] text-mas-text-dim hover:text-white hover:border-mas-red transition-all uppercase font-bold tracking-widest">Previous</button>
          <button className="px-3 py-1.5 border border-mas-red text-white bg-mas-red/5 text-[9px] uppercase font-bold tracking-widest">1</button>
          <button className="px-3 py-1.5 border border-mas-border text-[9px] text-mas-text-dim hover:text-white hover:border-mas-red transition-all uppercase font-bold tracking-widest">2</button>
          <button className="px-3 py-1.5 border border-mas-border text-[9px] text-mas-text-dim hover:text-white hover:border-mas-red transition-all uppercase font-bold tracking-widest">Next</button>
        </div>
      </div>
    </div>
  );
};

export default VisitorTable;
