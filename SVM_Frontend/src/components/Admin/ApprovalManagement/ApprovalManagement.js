import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Activity, Clock, Users, CheckCircle2, AlertCircle, Search, Filter, RefreshCw, Zap } from 'lucide-react';
import VisitorTable from './VisitorTable';
import VisitorDetailView from './VisitorDetailView';
import ApprovalModal from './ApprovalModal';
import QRSuccessModal from './QRSuccessModal';
import { setSearchTerm as setAdminSearchTerm, updateVisitorStatus } from '../../../reducers/adminSlice';

const ApprovalManagementMain = () => {
  const dispatch = useDispatch();
  const { visitorList, searchTerm } = useSelector(state => state.admin.approvals);

  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'details'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('Approve');
  const [showQRModal, setShowQRModal] = useState(false);
  const [approvedVisitorData, setApprovedVisitorData] = useState(null);
  const [nodeTime, setNodeTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setNodeTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filtered list based on Redux searchTerm
  const filteredVisitors = visitorList.filter(v =>
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.batchId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDetails = (visitor) => {
    setSelectedVisitor(visitor);
    setViewMode('details');
  };

  const handleBackToList = () => {
    setSelectedVisitor(null);
    setViewMode('list');
  };

  const handleAction = (visitor, type) => {
    setSelectedVisitor(visitor);
    setModalType(type);
    setIsModalOpen(true);
  };

  return (
    <div className="flex-1 p-10 space-y-12 animate-fade-in-slow overflow-y-auto bg-[#0A0A0B] relative">
      {/* Dynamic Operational Aura */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[1px] bg-gradient-to-r from-transparent via-mas-red/30 to-transparent"></div>

      <div className="max-w-[1700px] mx-auto relative z-10">
        {/* Command Intelligence Header */}
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 pb-12 border-b border-white/5">
          <div className="flex items-center gap-8">
            <div className="relative">
              <div className="w-20 h-20 rounded-[28px] bg-mas-red/10 border border-mas-red/20 flex items-center justify-center text-mas-red shadow-[0_0_50px_rgba(200,16,46,0.15)] group transition-all duration-700 hover:rotate-[360deg]">
                <Shield size={36} strokeWidth={1.5} />
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute inset-0 rounded-[28px] border-2 border-mas-red/40 blur-[4px]"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-[2px] bg-mas-red"></div>
                <span className="text-mas-red text-[10px] font-black uppercase tracking-[0.6em] italic">Personnel Authorization Dashboard</span>
              </div>
              <h1 className="text-white text-4xl font-black uppercase tracking-widest italic leading-none flex items-center gap-5">
                Authorization Hub
                <div className="h-6 w-[1px] bg-white/10 mx-2"></div>
                <span className="text-mas-text-dim/20 font-light text-2xl tracking-[0.2em] italic">Access Node Oversight</span>
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
            <div className="flex items-center gap-6 bg-white/[0.02] border border-white/5 p-5 px-8 rounded-3xl backdrop-blur-3xl shadow-2xl group hover:border-mas-red/20 transition-all duration-500">
              <div className="text-right">
                <p className="text-mas-text-dim/20 text-[8px] uppercase font-black tracking-widest mb-1">Operational_Mode</p>
                <div className="flex items-center justify-end gap-3">
                  <span className="text-green-500 text-[10px] font-black uppercase tracking-widest italic flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22C55E]"></div>
                    STABLE_AUTH_ENFORCED
                  </span>
                </div>
              </div>
              <div className="h-10 w-[1px] bg-white/10"></div>
              <div className="text-right">
                <p className="text-mas-text-dim/20 text-[8px] uppercase font-black tracking-widest mb-1">Node_Health</p>
                <span className="text-white text-[10px] font-mono font-black uppercase tracking-widest">99.98%_UPTIME</span>
              </div>
            </div>
          </div>
        </header>

        {/* Oversight Metrics Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12 mb-16">
          {[
            { label: 'Clearance Queue', val: filteredVisitors.length, desc: 'PENDING_PROTOCOLS', icon: Users, color: 'text-white' },
            { label: 'Active Auth Nodes', val: '04/04', desc: 'GLOBAL_ENFORCEMENT', icon: Activity, color: 'text-mas-red' },
            { label: 'Security Integrity', val: 'LEVEL_03', desc: 'THREAT_MITIGATION', icon: Zap, color: 'text-white' },
            { label: 'Registry Sync', val: 'STABLE', desc: 'NODAL_SYNC_ACTIVE', icon: RefreshCw, color: 'text-white' },
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
                <div className={`p-2 rounded-lg bg-white/[0.02] border border-white/5 ${m.color} group-hover:scale-110 transition-transform shadow-inner`}>
                  <m.icon size={14} />
                </div>
              </div>
              <p className={`text-3xl font-black italic tracking-tighter mb-2 ${m.color}`}>{m.val}</p>
              <p className="text-mas-text-dim/20 text-[8px] font-black uppercase tracking-[0.2em]">{m.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="space-y-12">
          {viewMode === 'list' && (
            <div className="flex justify-between items-center -mb-8 relative z-20">
              <div className="relative group w-full max-w-md">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none opacity-20 group-focus-within:opacity-100 transition-opacity">
                  <div className="w-1.5 h-[1px] bg-mas-red mr-2"></div>
                </div>
                <input
                  type="text"
                  placeholder="SCAN REGISTRY / ENTER IDENTIFIER..."
                  className="w-full bg-[#121214] border border-white/5 rounded-2xl px-10 py-5 text-white uppercase text-[11px] font-black tracking-widest focus:border-mas-red/50 focus:bg-[#161618] outline-none transition-all shadow-2xl placeholder:opacity-20"
                  value={searchTerm}
                  onChange={(e) => dispatch(setAdminSearchTerm(e.target.value))}
                />
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            {viewMode === 'list' ? (
              <motion.div
                key="list"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <VisitorTable
                  visitors={filteredVisitors}
                  onViewDetails={handleViewDetails}
                  onAction={handleAction}
                />
              </motion.div>
            ) : (
              <motion.div
                key="details"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <VisitorDetailView
                  visitor={selectedVisitor}
                  onBack={handleBackToList}
                  onAction={handleAction}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <ApprovalModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            visitor={selectedVisitor}
            type={modalType}
            onConfirm={(id, type, comment) => {
              dispatch(updateVisitorStatus({
                id,
                status: type === 'Approve' ? 'Approved' : 'Rejected'
              }));

              if (type === 'Approve') {
                setApprovedVisitorData(visitorList.find(v => v.id === id) || selectedVisitor);
                setShowQRModal(true);
              }
              if (viewMode === 'details') setViewMode('list');
              setIsModalOpen(false);
            }}
          />

          <QRSuccessModal
            isOpen={showQRModal}
            onClose={() => setShowQRModal(false)}
            visitorData={approvedVisitorData}
          />
        </div>
      </div>
    </div>
  );
};

export default ApprovalManagementMain;
