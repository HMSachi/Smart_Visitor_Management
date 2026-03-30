import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import VisitorTable from './VisitorTable';
import VisitorDetailView from './VisitorDetailView';
import ApprovalModal from './ApprovalModal';
import QRSuccessModal from './QRSuccessModal';
import { setSearchTerm as setAdminSearchTerm, updateVisitorStatus } from '../../../reducers/admin/adminSlice';

const ApprovalManagementMain = () => {
  const dispatch = useDispatch();
  const { visitorList, searchTerm } = useSelector(state => state.admin.approvals);

  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'details'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('Approve');
  const [showQRModal, setShowQRModal] = useState(false);
  const [approvedVisitorData, setApprovedVisitorData] = useState(null);

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
    <div className="flex-1 p-8 overflow-y-auto">
      <div className="max-w-[1600px] mx-auto">
        <header className="mb-6 flex justify-between items-end border-b border-white/[0.03] pb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-[2px] bg-mas-red"></div>
              <span className="text-mas-red uppercase tracking-wider text-xs font-semibold">Command Center</span>
            </div>
            <h1 className="text-white uppercase px-1 text-2xl font-bold tracking-tight">
              Approval Management
            </h1>
          </div>
          <div className="hidden lg:flex items-center gap-8 text-mas-text-dim">
            <div className="text-right">
              <p className="uppercase mb-1 text-[10px] tracking-[0.2em] font-medium">Access Node</p>
              <p className="text-mas-red font-bold tracking-widest text-xs uppercase">Restricted</p>
            </div>
          </div>
        </header>

        <div className="space-y-8">
          <div className="flex justify-between items-center mb-4">
             <div className="relative w-96">
                <input 
                  type="text" 
                  placeholder="SEARCH VISITOR BATCH / NAME..." 
                  className="w-full bg-white/5 border border-white/10 px-4 py-2 text-white uppercase text-xs focus:border-mas-red outline-none transition-all"
                  value={searchTerm}
                  onChange={(e) => dispatch(setAdminSearchTerm(e.target.value))}
                />
             </div>
          </div>

          <AnimatePresence mode="wait">
            {viewMode === 'list' ? (
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
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
