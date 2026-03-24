import React, { useState } from 'react';
import Sidebar from '../components/Dashboard/Layout/Sidebar';
import Header from '../components/Dashboard/Layout/Header';
import QRCodeManagement from '../components/Dashboard/QR/QRCodeManagement';
import SecurityMonitoring from '../components/Dashboard/Security/SecurityMonitoring';
import BlacklistTable from '../components/Dashboard/Security/BlacklistTable';
import VisitorTable from '../components/Dashboard/Visitors/VisitorTable';
import VisitorDetailView from '../components/Dashboard/Visitors/VisitorDetailView';
import ApprovalModal from '../components/Dashboard/Visitors/ApprovalModal';
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
                { id: 'qrcode', label: 'QR Clearance', desc: 'Generate entry tokens', icon: QrCode, color: 'white' },
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
                  <h3 className="text-[12px] font-black text-white uppercase tracking-[0.3em] mb-2 leading-none">{link.label}</h3>
                  <p className="text-[9px] text-mas-text-dim uppercase tracking-[0.2em] font-black opacity-0 group-hover:opacity-100 transition-all duration-300">
                    {link.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* System Status Node - Solid */}
            <div className="bg-[#0F0F10] border border-white/5 p-12 flex flex-col items-center justify-center">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_10px_#22c55e]"></div>
                  <span className="text-[10px] font-black text-white uppercase tracking-[0.5em]">System Core Operational</span>
                </div>
                <p className="text-[10px] text-mas-text-dim uppercase tracking-[0.2em] max-w-md text-center leading-loose font-black">
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
      case 'qrcode':
        return <div className="p-0 h-full"><QRCodeManagement /></div>;
      case 'security':
        return <div className="p-0 h-full"><SecurityMonitoring /></div>;
      case 'blacklist':
        return <div className="p-0 h-full"><BlacklistTable /></div>;
      default:
        return (
          <div className="p-20 text-center mas-glass">
            <h2 className="text-3xl font-black uppercase tracking-[0.2em] text-mas-text-dim">{activeTab.replace('-', ' ')}</h2>
            <p className="mt-4 text-mas-red font-bold uppercase tracking-widest text-xs italic">Experimental Module Node</p>
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
                  <span className="text-[10px] text-mas-red font-black uppercase tracking-[0.5em]">Command Center</span>
                </div>
                <h1 className="text-3xl font-black text-white uppercase tracking-tighter leading-none px-1">
                  System Overview
                </h1>
              </div>
              <div className="hidden lg:flex items-center gap-8 text-mas-text-dim">
                <div className="text-right">
                  <p className="text-[10px] uppercase font-black tracking-[0.2em] mb-1">Node Status</p>
                  <p className="text-xs font-black text-green-500 tracking-widest flex items-center justify-end gap-2">
                    <span className="w-1.4 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_5px_#22c55e]"></span>
                    OPERATIONAL
                  </p>
                </div>
                <div className="w-[1px] h-8 bg-white/10"></div>
                <div className="text-right">
                  <p className="text-[10px] uppercase font-black tracking-[0.2em] mb-1">Global Time</p>
                  <p className="text-xs font-black text-white tracking-widest leading-none italic uppercase">14:18:22 GMT+5:30</p>
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
          if (viewMode === 'details') setViewMode('list');
        }}
      />
    </div>
  );
};

export default Dashboard;
