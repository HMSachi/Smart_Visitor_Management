import React, { useState, useEffect } from 'react';
import { Check, X, Eye, ChevronUp, ChevronDown, User, Calendar, MapPin, Hash, Shield, QrCode } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const StatusBadge = ({ status }) => {
  const styles = {
    'Approved': 'border-green-500/20 text-green-500 bg-green-500/5',
    'Accepted by Admin': 'border-green-500/20 text-green-500 bg-green-500/5',
    'Pending': 'border-primary/20 text-primary bg-primary/5',
    'Sent to Admin': 'border-orange-500/20 text-orange-500 bg-orange-500/5',
    'Accepted': 'border-purple-500/20 text-purple-500 bg-purple-500/5',
    'Rejected': 'border-white/10 text-gray-300 bg-white/5',
    'Checked In': 'border-blue-500/20 text-blue-500 bg-blue-500/5',
    'Checked Out': 'border-white/5 text-gray-300/80 bg-transparent',
  };

  return (
    <div className={`px-4 py-1.5 rounded-full text-[12px] font-medium tracking-[0.2em] capitalize border flex items-center gap-2 w-fit mx-auto ${styles[status] || styles['Pending']}`}>
      <div className={`w-1 h-1 rounded-full ${status === 'Approved' || status === 'Accepted by Admin' || status === 'Checked In' ? 'bg-green-500 shadow-[0_0_5px_#22c55e]' : status === 'Accepted' ? 'bg-purple-500 shadow-[0_0_5px_#a855f7]' : status === 'Sent to Admin' ? 'bg-orange-500 shadow-[0_0_5px_#f97316] animate-pulse' : status === 'Pending' ? 'bg-primary shadow-[0_0_5px_var(--color-primary)] animate-pulse' : 'bg-mas-text-dim opacity-80'}`}></div>
      {status}
    </div>
  );
};

const VisitorTable = ({ visitors, onViewDetails, onAction, gatePasses = [] }) => {
  const hasGatePass = (requestId) => {
    if (!requestId) return false;
    const list = Array.isArray(gatePasses) ? gatePasses : (gatePasses?.gatePasses || gatePasses?.ResultSet || []);
    return list.some(gp => {
      const gpRequestId = gp.VVR_Request_id || gp.VGP_Request_id || gp.vvr_Request_id || gp.vgp_Request_id;
      return String(gpRequestId) === String(requestId);
    });
  };
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [expandedBatches, setExpandedBatches] = useState([]);
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'

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
    <div className="bg-[var(--color-bg-paper)] border border-white/5 p-6 md:p-12 rounded-[40px] animate-pulse shadow-2xl">
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

  const filteredVisitors = (visitors || [])
    .filter(visitor => {
      const matchesSearch = visitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        visitor.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (visitor.batchId && visitor.batchId.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (visitor.nic && visitor.nic.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = statusFilter === 'All' || visitor.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

  return (
    <div className="bg-[var(--color-bg-paper)] border border-white/5 rounded-[40px] overflow-hidden flex flex-col shadow-2xl animate-fade-in-slow relative">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>

      {/* Filter Hub */}
      <div className="p-8 border-b border-white/5 bg-[#161618] flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8 shadow-inner relative z-10">
        <div className="flex items-center gap-6">
          <div className="w-1.5 h-10 bg-primary rounded-full shadow-[0_0_10px_var(--color-primary)]"></div>
          <div>
            <h2 className="capitalize text-white text-[14px] font-bold tracking-[0.4em]">Approval List</h2>
            <p className="text-white/90 capitalize text-[12px] font-medium tracking-widest mt-1">Monitor and manage visitor requests</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 mt-4 xl:mt-0">
          {[
            { id: 'All', label: 'All Forms' },
            { id: 'Pending', label: 'Pending' },
            { id: 'Sent to Admin', label: 'Sent to Admin' },
            { id: 'Accepted by Admin', label: 'Accepted by Admin' },
            { id: 'Rejected', label: 'Rejected' },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setStatusFilter(btn.id)}
              className={`px-5 py-2.5 rounded-xl text-[12px] font-bold uppercase tracking-[0.2em] transition-all duration-300 border ${
                statusFilter === btn.id
                  ? 'bg-primary border-primary text-white shadow-[0_0_15px_rgba(200,16,46,0.2)]'
                  : 'bg-white/[0.03] border-white/5 text-gray-400 hover:text-white hover:border-white/20'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-[var(--color-bg-default)]">
        {/* DESKTOP TABLE VIEW */}
        <table className="w-full text-left border-collapse hidden md:table">
          <thead>
            <tr className="bg-[var(--color-bg-paper)] border-b border-white/5">
              <th className="px-8 py-6 text-[13px] font-medium tracking-[0.3em] capitalize text-white/70 text-center w-24">No.</th>
              <th className="px-8 py-6 text-[13px] font-medium tracking-[0.3em] capitalize text-white/70">Visitor</th>
              <th 
                className="px-8 py-6 text-[13px] font-medium tracking-[0.3em] capitalize text-white/70 cursor-pointer hover:text-primary transition-colors group"
                onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              >
                <div className="flex items-center gap-2">
                  Visit Details
                  <div className={`transition-transform duration-300 ${sortOrder === 'asc' ? 'rotate-180' : ''}`}>
                    <ChevronDown size={14} className={sortOrder ? 'text-primary' : 'text-gray-500'} />
                  </div>
                </div>
              </th>
              <th className="px-8 py-6 text-[13px] font-medium tracking-[0.3em] capitalize text-white/70 text-center">Status</th>
              <th className="px-8 py-6 text-[13px] font-medium tracking-[0.3em] capitalize text-primary text-right pr-12">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.02]">
            {filteredVisitors.map((visitor) => (
              <React.Fragment key={visitor.batchId}>
                <tr className={`group transition-all duration-500 ${expandedBatches.includes(visitor.batchId) ? 'bg-primary/[0.02]' : 'hover:bg-white/[0.01]'}`}>
                  <td className="px-8 py-8 text-center">
                    <button
                      onClick={() => toggleBatch(visitor.batchId)}
                      className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all duration-500 shadow-lg ${expandedBatches.includes(visitor.batchId) ? 'bg-primary text-white border-primary rotate-180' : 'bg-[var(--color-bg-default)] border-white/5 text-gray-300 hover:text-white hover:border-primary/50'}`}
                    >
                      {expandedBatches.includes(visitor.batchId) ? <ChevronUp size={16} /> : <div className="text-[13px] font-medium">{visitor.members.length + 1}</div>}
                    </button>
                  </td>
                  <td className="px-8 py-8">
                    <p className="text-white capitalize text-[13px] font-medium tracking-widest mb-1">{visitor.name}</p>
                  </td>
                  <td className="px-8 py-8">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <Calendar size={12} className="text-primary/60" />
                        <span className="text-white capitalize text-[13px] font-medium tracking-widest">{visitor.date}</span>
                      </div>
                      <p className="text-white/70 capitalize text-[12px] font-medium tracking-widest truncate max-w-[220px] flex items-center gap-2"><MapPin size={10} className="text-primary/70" /> {visitor.areas.join(' | ')}</p>
                    </div>
                  </td>
                  <td className="px-8 py-8 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <StatusBadge status={visitor.status} />
                      {hasGatePass(visitor.id) && (
                        <button
                          onClick={() => onAction(visitor, 'ViewGatePass')}
                          className="flex items-center gap-2 text-[10px] items-center justify-center font-bold capitalize tracking-[0.2em] text-primary hover:text-white transition-colors group/gp"
                        >
                          <QrCode size={12} className="group-hover/gp:scale-110 transition-transform" />
                          View Gate Pass
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-8 text-right pr-10">
                    <div className="flex justify-end gap-3">
                      {(visitor.status === 'Pending' || visitor.status === 'Sent to Admin') && (
                        <>
                          <button onClick={() => onAction(visitor, 'Approve')} title="AUTHORIZE BATCH" className="w-10 h-10 rounded-xl flex items-center justify-center bg-green-500/5 border border-green-500/20 text-green-500 hover:bg-green-500 hover:text-white hover:border-green-500 transition-all duration-500 shadow-xl group/btn">
                            <Check size={16} strokeWidth={3} className="group-hover/btn:scale-110 transition-transform" />
                          </button>
                          <button onClick={() => onAction(visitor, 'Reject')} title="DENY BATCH" className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary/5 border border-primary/20 text-primary hover:bg-primary hover:text-white hover:border-primary transition-all duration-500 shadow-xl group/btn">
                            <X size={16} strokeWidth={3} className="group-hover/btn:scale-110 transition-transform" />
                          </button>
                        </>
                      )}
                      <button onClick={() => onViewDetails(visitor)} title="INSPECT PROTOCOL" className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/[0.02] border border-white/5 text-gray-300 hover:text-white hover:bg-[var(--color-bg-paper)] hover:border-white/20 transition-all duration-500 shadow-xl group/btn">
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
                      className="bg-[var(--color-bg-default)] border-b border-primary/10"
                    >
                      <td colSpan="6" className="px-0 py-0 overflow-hidden">
                        <div className="p-4 md:p-10 pl-32 space-y-6 bg-gradient-to-br from-[var(--color-bg-default)] to-[#0E0E10] shadow-inner relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>

                          <div className="flex items-center gap-4 mb-8">
                            <div className="w-1 h-4 bg-primary rounded-full shadow-[0_0_8px_var(--color-primary)]"></div>
                            <p className="text-primary text-[13px] font-medium capitalize tracking-[0.3em]">Personnel Unit Breakdown <span className="text-gray-300/80 ml-2">// Institutional Registry</span></p>
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
                            {visitor.members.map((member, idx) => (
                              <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="flex items-center justify-between p-6 bg-[var(--color-bg-paper)] border border-white/5 hover:border-primary/30 transition-all duration-500 rounded-[24px] group/member shadow-2xl"
                              >
                                <div className="flex items-center gap-5">
                                  <div className="w-10 h-10 rounded-xl bg-[var(--color-bg-default)] border border-white/5 flex items-center justify-center text-gray-300 text-[13px] font-medium group-hover/member:border-primary transition-all">
                                    {(idx + 2).toString().padStart(2, '0')}
                                  </div>
                                  <div className="flex flex-col gap-1">
                                    <span className="text-white text-[13px] font-medium capitalize tracking-widest group-hover/member:text-primary transition-colors">{member.name}</span>
                                    <span className="text-gray-300/80 text-[12px] font-medium capitalize tracking-[0.2em] flex items-center gap-2"><Hash size={10} className="text-primary/40" /> {member.nic}</span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <span className="text-[13px] text-gray-300/80 font-medium capitalize tracking-[0.3em] block mb-1">Contact Protocol</span>
                                  <span className="px-4 py-2 bg-black/40 border border-white/5 text-white/90 text-[13px] font-medium tracking-widest rounded-xl shadow-inner group-hover/member:border-primary/20 transition-all">{member.contact}</span>
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
            <div key={visitor.batchId} className="bg-[var(--color-bg-paper)] border border-white/5 rounded-[32px] overflow-hidden shadow-2xl relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

              {/* Mobile Card Header */}
              <div className="p-6 border-b border-white/5 flex justify-between items-start bg-black/20 relative z-10">
                <div>
                  <p className="text-white capitalize text-[13px] font-medium tracking-widest mb-1 leading-tight">{visitor.name}</p>
                  <p className="text-gray-300/80 capitalize text-[12px] font-medium tracking-widest font-mono">{visitor.batchId}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <StatusBadge status={visitor.status} />
                  {hasGatePass(visitor.id) && (
                    <button
                      onClick={() => onAction(visitor, 'ViewGatePass')}
                      className="flex items-center gap-2 text-[10px] font-bold capitalize tracking-[0.2em] text-primary hover:text-white transition-colors group/gp"
                    >
                      <QrCode size={12} className="group-hover/gp:scale-110 transition-transform" />
                      View Pass
                    </button>
                  )}
                </div>
              </div>

              {/* Mobile Card Body */}
              <div className="p-6 space-y-5 relative z-10">
                <div className="flex justify-between items-center text-[13px] font-medium capitalize tracking-[0.2em] border-b border-white/[0.03] pb-4">
                  <span className="text-gray-300/80 flex items-center gap-2"><Calendar size={12} className="text-primary/60" /> Deployed</span>
                  <span className="text-white">{visitor.date} <span className="text-primary mx-1">//</span> {visitor.timeIn}</span>
                </div>
                <div className="flex justify-between items-center text-[13px] font-medium capitalize tracking-[0.2em] border-b border-white/[0.03] pb-4">
                  <span className="text-gray-300/80 flex items-center gap-2"><MapPin size={12} className="text-primary/60" /> Zones</span>
                  <span className="text-white text-right max-w-[150px] truncate">{visitor.areas.join(' | ')}</span>
                </div>
                <div className="flex justify-between items-center text-[13px] font-medium capitalize tracking-[0.2em]">
                  <span className="text-gray-300/80 flex items-center gap-2"><Shield size={12} className="text-primary/60" /> Unit Size</span>
                  <span className="text-primary bg-primary/10 px-3 py-1 rounded-full text-[12px]">{visitor.members.length + 1} PERSONNEL</span>
                </div>
              </div>

              {/* Expandable Members Area (Mobile) */}
              {visitor.members.length > 0 && (
                <div className="relative z-10">
                  <button
                    onClick={() => toggleBatch(visitor.batchId)}
                    className={`w-full py-5 px-6 flex justify-between items-center text-[13px] font-medium capitalize tracking-[0.3em] border-t transition-all ${expandedBatches.includes(visitor.batchId) ? 'bg-primary/5 border-primary/20 text-primary' : 'bg-black/20 border-white/5 text-gray-300/80 hover:text-white'
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
                            <div key={idx} className="bg-[var(--color-bg-default)] border border-white/5 p-5 rounded-2xl flex justify-between items-center shadow-lg group/mem">
                              <div>
                                <span className="text-white text-[13px] font-medium capitalize tracking-widest block mb-1 group-hover/mem:text-primary transition-colors">{idx + 2}. {member.name}</span>
                                <span className="text-gray-300/30 text-[12px] font-medium capitalize tracking-[0.2em] block font-mono">NIC_: {member.nic}</span>
                              </div>
                              <div className="text-right">
                                <span className="text-[13px] text-gray-300/80 font-medium capitalize tracking-widest block mb-1">Contact</span>
                                <span className="text-white/90 text-[12px] font-medium font-mono">{member.contact}</span>
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
                {(visitor.status === 'Pending' || visitor.status === 'Sent to Admin') && (
                  <>
                    <button onClick={() => onAction(visitor, 'Approve')} className="flex-1 h-14 flex justify-center items-center gap-3 bg-green-500/5 border border-green-500/20 text-green-500 text-[13px] font-medium capitalize tracking-[0.2em] rounded-2xl hover:bg-green-500 hover:text-white transition-all shadow-xl">
                      <Check size={16} strokeWidth={3} /> <span>Approve</span>
                    </button>
                    <button onClick={() => onAction(visitor, 'Reject')} className="flex-1 h-14 flex justify-center items-center gap-3 bg-primary/5 border border-primary/20 text-primary text-[13px] font-medium capitalize tracking-[0.2em] rounded-2xl hover:bg-primary hover:text-white transition-all shadow-xl">
                      <X size={16} strokeWidth={3} /> <span>Reject</span>
                    </button>
                  </>
                )}
                <button onClick={() => onViewDetails(visitor)} className="flex-1 h-14 flex justify-center items-center gap-3 bg-white/[0.02] border border-white/5 text-white text-[13px] font-medium capitalize tracking-[0.2em] rounded-2xl hover:bg-white hover:text-black transition-all shadow-xl">
                  <Eye size={16} /> <span>Inspect</span>
                </button>
              </div>
            </div>
          ))}
          {filteredVisitors.length === 0 && (
            <div className="p-16 text-center bg-white/[0.01] border border-white/5 rounded-[40px] shadow-2xl">
              <div className="w-16 h-16 bg-[var(--color-bg-paper)] rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/5">
                <Shield size={24} className="text-primary opacity-70" />
              </div>
              <p className="text-gray-300 text-[13px] font-medium capitalize tracking-[0.4em] opacity-80">No matching records found</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default VisitorTable;
