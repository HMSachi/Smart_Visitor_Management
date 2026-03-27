import React, { useState } from 'react';
import Sidebar from '../../components/Admin/Dashboard/Layout/Sidebar';
import Header from '../../components/Admin/Dashboard/Layout/Header';
import SecurityMonitoring from '../../components/Admin/Dashboard/Security/SecurityMonitoring';
import BlacklistTable from '../../components/Admin/Dashboard/Security/BlacklistTable';
import VisitorTable from '../../components/Admin/Dashboard/Visitors/VisitorTable';
import VisitorDetailView from '../../components/Admin/Dashboard/Visitors/VisitorDetailView';
import ApprovalModal from '../../components/Admin/Dashboard/Visitors/ApprovalModal';
import { 
  CheckSquare, 
  ShieldAlert, 
  QrCode, 
  UserX 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [visitorList, setVisitorList] = useState([
    { 
      batchId: "BATCH-2026-001",
      id: "MAS-VAS-001", 
      name: 'Adithya Bandara', 
      isLeader: true,
      nic: '958273645V',
      contact: '+94 77 123 4567', 
      email: 'adithya@example.com',
      date: '2026-03-25',
      timeIn: '08:30 AM', 
      purpose: 'BUSINESS MEETING',
      visitorCount: 3,
      vehicle: 'WP CAS-1234 (Car)',
      areas: ['MAIN RECEPTION', 'PRODUCTION FLOOR 2'],
      status: 'Approved', 
      contactPerson: 'Saman Kumara',
      equipment: [],
      members: [
        { name: 'Sameera Perera', nic: '940012345V', contact: '+94 77 111 2222' },
        { name: 'Dulani Silva', nic: '967788990V', contact: '+94 77 333 4444' }
      ]
    },
    { 
      batchId: "BATCH-2026-002",
      id: "MAS-VAS-002", 
      name: 'Kasun Perera', 
      isLeader: true,
      nic: '921123456V',
      contact: '+94 71 987 6543', 
      email: 'kasun@gmail.com',
      date: '2026-03-25',
      timeIn: '09:15 AM', 
      purpose: 'CLIENT VISIT',
      visitorCount: 1,
      vehicle: 'None',
      areas: ['ADMIN BLOCK'],
      status: 'Pending', 
      contactPerson: 'Nimali Silva',
      equipment: ['Laptop (1)'],
      members: []
    },
    { 
      batchId: "BATCH-2026-003",
      id: "MAS-VAS-003", 
      name: 'Sarah Jenkins', 
      isLeader: true,
      nic: 'N/A (Passport)',
      contact: '+44 20 7123 4567', 
      email: 'sarah.j@global.com',
      date: '2026-03-24',
      timeIn: '10:00 AM', 
      purpose: 'TECHNICAL AUDIT',
      visitorCount: 2,
      vehicle: 'WP KN-5566 (Van)',
      areas: ['IT DEPARTMENT', 'DATA CENTER'],
      status: 'Checked Out', 
      contactPerson: 'Rohit Sharma',
      equipment: ['Diagnostic Kit (2)'],
      members: [
        { name: 'Michael Chen', nic: 'E1234567 (Passport)', contact: '+1 415 555 0123' }
      ]
    },
  ]);
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'details'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('Approve');
  const [showQRModal, setShowQRModal] = useState(false);
  const [approvedVisitorData, setApprovedVisitorData] = useState(null);

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

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-12"
          >
            {/* Quick Access Hub */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { id: 'approvals', label: 'Visitor Approvals', desc: 'Process pending requests', icon: CheckSquare, color: 'mas-red' },
                { id: 'security', label: 'Security Center', desc: 'Monitor site activity', icon: ShieldAlert, color: 'white' },
                { id: 'blacklist', label: 'Blacklist', desc: 'Manage restricted nodes', icon: UserX, color: 'white' },
              ].map((link) => (
                <div 
                  key={link.id}
                  onClick={() => setActiveTab(link.id)}
                  className="bg-[#0F0F10] border border-white/5 p-8 group cursor-pointer hover:border-mas-red transition-all duration-300 flex flex-col items-center text-center"
                >
                  <div className={`w-16 h-16 mb-6 flex items-center justify-center border border-white/10 group-hover:border-mas-red group-hover:bg-mas-red/[0.03] transition-all duration-300`}>
                    <link.icon size={28} className={link.id === 'approvals' ? 'text-mas-red' : 'text-white/40 group-hover:text-mas-red'} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-white uppercase mb-2">{link.label}</h3>
                  <p className="text-mas-text-dim uppercase opacity-0 group-hover:opacity-100 transition-all duration-300">
                    {link.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* System Status Node - Solid */}
            <div className="bg-[#0F0F10] border border-white/5 p-12 flex flex-col items-center justify-center">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_10px_#22c55e]"></div>
                  <span className="text-white uppercase">System Core Operational</span>
                </div>
                <p className="text-mas-text-dim uppercase max-w-md text-center">
                  All security protocols are active. Synchronization with MAS-HQ nodes is complete. No critical alerts pending in the current cycle.
                </p>
            </div>
          </motion.div>
        );
      case 'approvals':
        return (
          <AnimatePresence mode="wait">
            {viewMode === 'list' ? (
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <VisitorTable 
                  visitors={visitorList}
                  onViewDetails={handleViewDetails} 
                  onAction={handleAction}
                />
              </motion.div>
            ) : (
              <motion.div
                key="details"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <VisitorDetailView 
                  visitor={selectedVisitor} 
                  onBack={handleBackToList}
                  onAction={handleAction}
                />
              </motion.div>
            )}
          </AnimatePresence>
        );
      case 'security':
        return <div className="p-0 h-full"><SecurityMonitoring /></div>;
      case 'blacklist':
        return <div className="p-0 h-full"><BlacklistTable /></div>;
      default:
        return (
          <div className="p-20 text-center mas-glass">
            <h2 className="uppercase text-mas-text-dim">{activeTab.replace('-', ' ')}</h2>
            <p className="mt-4 text-mas-red uppercase">Experimental Module Node</p>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-mas-black overflow-x-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 ml-72 flex flex-col min-w-0 bg-[#0A0A0B]">
        <Header />
        
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-[1600px] mx-auto">
            <header className="mb-6 flex justify-between items-end border-b border-white/[0.03] pb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-[2px] bg-mas-red"></div>
                  <span className="text-mas-red uppercase">Command Center</span>
                </div>
                <h1 className="text-white uppercase px-1">
                  System Overview
                </h1>
              </div>
              <div className="hidden lg:flex items-center gap-8 text-mas-text-dim">
                <div className="text-right">
                  <p className="uppercase mb-1">Node Status</p>
                  <p className="text-green-500 flex items-center justify-end gap-2">
                    <span className="w-1.4 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_5px_#22c55e]"></span>
                    OPERATIONAL
                  </p>
                </div>
                <div className="w-[1px] h-8 bg-white/10"></div>
                <div className="text-right">
                  <p className="uppercase mb-1">Global Time</p>
                  <p className="text-white uppercase">14:18:22 GMT+5:30</p>
                </div>
              </div>
            </header>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>

      <ApprovalModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        visitor={selectedVisitor}
        type={modalType}
        onConfirm={(id, type, comment) => {
          setVisitorList(prev => prev.map(v => 
            v.id === id ? { ...v, status: type === 'Approve' ? 'Approved' : 'Rejected' } : v
          ));
          if (type === 'Approve') {
             setApprovedVisitorData(visitorList.find(v => v.id === id) || selectedVisitor);
             setShowQRModal(true);
          }
          if (viewMode === 'details') setViewMode('list');
        }}
      />

      {/* QR Code Generation Success Modal */}
      <AnimatePresence>
        {showQRModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[150]"
              onClick={() => setShowQRModal(false)}
            />
            <div className="fixed inset-0 flex items-center justify-center p-4 z-[151]">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-md bg-[#0F0F10] border border-white/10 shadow-2xl overflow-hidden"
              >
                 <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <CheckSquare size={20} className="text-[#00B14F]" />
                       <h2 className="text-white uppercase tracking-wider text-sm">Approval Concluded</h2>
                    </div>
                 </div>
                 <div className="p-8 flex flex-col items-center justify-center text-center">
                    <div className="w-32 h-32 bg-white flex items-center justify-center p-2 mb-6 shadow-[0_0_20px_rgba(0,177,79,0.15)] rounded">
                       {/* Placeholder for QR Code */}
                       <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=MAS-APPROVED" alt="Generated QR" className="w-full h-full object-contain" />
                    </div>
                    <div className="space-y-2">
                       <h3 className="text-[#00B14F] uppercase tracking-widest text-lg font-medium">Clearance Granted</h3>
                       <p className="text-white uppercase text-sm">{approvedVisitorData?.name}</p>
                       <p className="text-mas-text-dim text-xs leading-relaxed mt-2 uppercase">
                          The QR Code and encrypted approval message have been successfully dispatched to the Contact Person ({approvedVisitorData?.contactPerson}).
                       </p>
                    </div>
                 </div>
                 <div className="p-6 border-t border-white/5 bg-[#121212]">
                    <button 
                       onClick={() => setShowQRModal(false)}
                       className="w-full py-3 bg-white text-black hover:bg-[#00B14F] hover:text-white uppercase tracking-wider text-sm transition-all"
                    >
                       Acknowledge & Close
                    </button>
                 </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
