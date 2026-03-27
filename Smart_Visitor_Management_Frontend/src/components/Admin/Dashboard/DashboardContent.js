import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VisitorTable from './Visitors/VisitorTable';
import VisitorDetailView from './Visitors/VisitorDetailView';
import SecurityMonitoring from './Security/SecurityMonitoring';
import BlacklistTable from './Security/BlacklistTable';
import ApprovalModal from './Visitors/ApprovalModal';
import QuickAccessHub from './Overview/QuickAccessHub';
import SystemStatusNode from './Overview/SystemStatusNode';
import QRSuccessModal from './QR/QRSuccessModal';

const DashboardContent = ({ activeTab, setActiveTab }) => {
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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-12"
          >
            <QuickAccessHub setActiveTab={setActiveTab} />
            <SystemStatusNode />
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
          <div className="p-20 text-center">
            <h2 className="uppercase text-mas-text-dim">{activeTab.replace('-', ' ')}</h2>
            <p className="mt-4 text-mas-red uppercase">Experimental Module Node</p>
          </div>
        );
    }
  };

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {renderTabContent()}
        </motion.div>
      </AnimatePresence>

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

      <QRSuccessModal 
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        visitorData={approvedVisitorData}
      />
    </>
  );
};

export default DashboardContent;
