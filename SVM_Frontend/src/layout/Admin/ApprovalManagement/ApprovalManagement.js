import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import Header from '../../../components/Admin/Layout/Header';
import VisitorTable from "../../../components/Admin/ApprovalManagement/VisitorTable";
import VisitorDetailView from "../../../components/Admin/ApprovalManagement/VisitorDetailView";
import ApprovalModal from "../../../components/Admin/ApprovalManagement/ApprovalModal";
import QRSuccessModal from "../../../components/Admin/ApprovalManagement/QRSuccessModal";
import {
  setSearchTerm as setAdminSearchTerm,
  updateVisitorStatus,
} from "../../../reducers/adminSlice";

const ApprovalManagement = () => {
  const dispatch = useDispatch();
  const { visitorList, searchTerm } = useSelector(
    (state) => state.admin.approvals,
  );

  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [viewMode, setViewMode] = useState("list"); // 'list' or 'details'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("Approve");
  const [showQRModal, setShowQRModal] = useState(false);
  const [approvedVisitorData, setApprovedVisitorData] = useState(null);

  // Filtered list based on Redux searchTerm
  const filteredVisitors = visitorList.filter(
    (v) =>
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.batchId.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleViewDetails = (visitor) => {
    setSelectedVisitor(visitor);
    setViewMode("details");
  };

  const handleBackToList = () => {
    setSelectedVisitor(null);
    setViewMode("list");
  };

  const handleAction = (visitor, type) => {
    setSelectedVisitor(visitor);
    setModalType(type);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col min-w-0 bg-[var(--color-bg-default)] min-h-screen">
      <Header />
      
      <div className="flex-1 p-4 md:p-10 space-y-6 md:space-y-12 animate-fade-in-slow overflow-y-auto bg-[var(--color-bg-default)] relative">
        {/* Dynamic Operational Aura */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>

        <div className="max-w-[1700px] mx-auto relative z-10">
          <div className="space-y-6 md:space-y-12">
            {viewMode === "list" && (
              <div className="flex justify-between items-center -mb-8 relative z-20">
                <div className="relative group w-full max-w-md">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none opacity-70 group-focus-within:opacity-100 transition-opacity">
                    <div className="w-1.5 h-[1px] bg-primary mr-2"></div>
                  </div>
                  <input
                    type="text"
                    placeholder="SCAN REGISTRY / ENTER IDENTIFIER..."
                    className="w-full bg-[var(--color-bg-paper)] border border-white/5 rounded-2xl px-10 py-5 text-white uppercase text-[14px] font-medium tracking-widest focus:border-primary/50 focus:bg-[#161618] outline-none transition-all shadow-2xl placeholder:opacity-70"
                    value={searchTerm}
                    onChange={(e) => dispatch(setAdminSearchTerm(e.target.value))}
                  />
                </div>
              </div>
            )}

            <AnimatePresence mode="wait">
              {viewMode === "list" ? (
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
                dispatch(
                  updateVisitorStatus({
                    id,
                    status: type === "Approve" ? "Approved" : "Rejected",
                  }),
                );

                if (type === "Approve") {
                  setApprovedVisitorData(
                    visitorList.find((v) => v.id === id) || selectedVisitor,
                  );
                  setShowQRModal(true);
                }
                if (viewMode === "details") setViewMode("list");
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
    </div>
  );
};

export default ApprovalManagement;
