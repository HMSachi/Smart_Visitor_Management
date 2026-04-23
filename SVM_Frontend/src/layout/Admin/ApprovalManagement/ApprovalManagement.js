import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../../../components/Admin/Layout/Header";
import VisitorTable from "../../../components/Admin/ApprovalManagement/VisitorTable";
import PersonnelAuthProtocol from "../../../components/common/PersonnelAuthProtocol";
import ApprovalModal from "../../../components/Admin/ApprovalManagement/ApprovalModal";
import QRSuccessModal from "../../../components/Admin/ApprovalManagement/QRSuccessModal";
import {
  setSearchTerm as setAdminSearchTerm,
  updateVisitorStatus,
} from "../../../reducers/adminSlice";
import {
  GetAllVisitRequests,
  ApproveVisitRequest,
} from "../../../actions/VisitRequestAction";
import { GetAllVisitors } from "../../../actions/VisitorAction";
import { GetAllVehicles } from "../../../actions/VehicleAction";
import { GetAllGatePasses } from "../../../actions/GatePassAction";
import VisitorGroup from "../../../components/Visitor/Request/Step1/VisitorGroup";
import ItemsCarried from "../../../components/Visitor/Request/Step1/ItemsCarried";
import { useThemeMode } from "../../../theme/ThemeModeContext";
import VisitGroupService from "../../../services/VisitGroupService";
import ItemCarriedService from "../../../services/ItemCarriedService";

const ApprovalManagement = () => {
  const dispatch = useDispatch();
  const searchTerm = useSelector((state) => state.admin.approvals.searchTerm);
  const { visitRequests, isLoading: isVrLoading } = useSelector(
    (state) => state.visitRequestsState,
  );
  const { visitors } = useSelector((state) => state.visitorManagement);
  const { vehicles } = useSelector(
    (state) => state.vehicleState || { vehicles: [] },
  );
  const { gatePasses } = useSelector(
    (state) => state.gatePassState || { gatePasses: [] },
  );

  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [viewMode, setViewMode] = useState("list"); // 'list' or 'details'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("Approve");
  const [showQRModal, setShowQRModal] = useState(false);
  const [approvedVisitorData, setApprovedVisitorData] = useState(null);
  const { themeMode } = useThemeMode();
  const isLight = themeMode === "light";

  const [visitorGroupMembers, setVisitorGroupMembers] = useState([]);
  const [itemsCarried, setItemsCarried] = useState([]);

  const handleAddVisitor = () => {
    const newId =
      visitorGroupMembers.length > 0
        ? Math.max(...visitorGroupMembers.map((v) => v.id || 0)) + 1
        : 1;
    setVisitorGroupMembers([
      ...visitorGroupMembers,
      { id: newId, fullName: "", nic: "", contact: "" },
    ]);
  };
  const handleRemoveVisitor = (id) => {
    setVisitorGroupMembers(visitorGroupMembers.filter((v) => v.id !== id));
  };
  const handleUpdateVisitor = (id, field, value) => {
    setVisitorGroupMembers(
      visitorGroupMembers.map((v) =>
        v.id === id ? { ...v, [field]: value } : v,
      ),
    );
  };

  const handleAddItem = () => {
    const newId =
      itemsCarried.length > 0
        ? Math.max(...itemsCarried.map((i) => i.id || 0)) + 1
        : 1;
    setItemsCarried([
      ...itemsCarried,
      { id: newId, itemName: "", quantity: "" },
    ]);
  };
  const handleRemoveItem = (id) => {
    setItemsCarried(itemsCarried.filter((i) => i.id !== id));
  };
  const handleUpdateItem = (id, field, value) => {
    setItemsCarried(
      itemsCarried.map((i) => (i.id === id ? { ...i, [field]: value } : i)),
    );
  };

  React.useEffect(() => {
    dispatch(GetAllVisitRequests());
    dispatch(GetAllVisitors());
    dispatch(GetAllVehicles());
    dispatch(GetAllGatePasses());
  }, [dispatch]);

  // Load visitor group and items when a visitor is selected
  React.useEffect(() => {
    if (selectedVisitor && viewMode === "details") {
      const loadDetails = async () => {
        try {
          const groupRes = await VisitGroupService.GetAllVisitGroup();
          const allGroups = groupRes?.data?.ResultSet || groupRes?.data || [];
          const matchedMembers = (Array.isArray(allGroups) ? allGroups : [])
            .filter(
              (m) => String(m.VVR_Request_id) === String(selectedVisitor.id),
            )
            .map((m) => ({
              id: m.VVG_id,
              fullName: m.VVG_Visitor_Name,
              nic: m.VVG_NIC_Passport_Number,
              contact: m.VVG_Designation,
            }));
          setVisitorGroupMembers(matchedMembers);

          const itemsRes = await ItemCarriedService.GetAllItemsCarried();
          const allItems = itemsRes?.data?.ResultSet || itemsRes?.data || [];
          const matchedItems = (Array.isArray(allItems) ? allItems : [])
            .filter(
              (i) => String(i.VVR_Request_id) === String(selectedVisitor.id),
            )
            .map((i) => ({
              id: i.VIC_Item_id,
              itemName: i.VIC_Item_Name,
              quantity: i.VIC_Quantity,
            }));
          setItemsCarried(matchedItems);
        } catch (err) {
          console.error("Error loading group/items in Admin view:", err);
        }
      };
      loadDetails();
    }
  }, [selectedVisitor, viewMode]);

  // Combine and map data for the table
  const mappedRequests = React.useMemo(() => {
    return (visitRequests || [])
      .filter((req) => {
        const status = (req.VVR_Status || "").toString().trim().toUpperCase();
        // Include PENDING, SENT, APPROVED (A), REJECTED (R)
        return (
          status === "SENT" ||
          status === "A" ||
          status === "R" ||
          status === "ACCEPTED" ||
          status === "P" ||
          status === "PENDING" ||
          status === "SENT_TO_ADMIN"
        );
      })
      .map((req) => {
        const visitor = (visitors || []).find(
          (v) => String(v.VV_Visitor_id) === String(req.VVR_Visitor_id),
        );
        const vehicle = (vehicles || []).find(
          (veh) => String(veh.VVR_Request_id) === String(req.VVR_Request_id),
        );
        const s = (req.VVR_Status || "").toString().trim().toUpperCase();

        let displayStatus = "Sent to Visitor";
        if (s === "SENT" || s === "SENT_TO_ADMIN") displayStatus = "Accepted by Contact Person";
        else if (s === "A" || s === "APPROVED") displayStatus = "Admin Approved";
        else if (s === "R" || s === "REJECTED") displayStatus = "Rejected";
        else if (s === "ACCEPTED") displayStatus = "Accepted by Visitor";

        return {
          id: req.VVR_Request_id?.toString() || "",
          batchId: `BATCH-${new Date(req.VVR_Visit_Date).getFullYear()}-${req.VVR_Request_id?.toString().padStart(3, "0")}`,
          name: visitor?.VV_Name || `Visitor #${req.VVR_Visitor_id}`,
          contactPerson: `Admin Node`,
          date: req.VVR_Visit_Date ? req.VVR_Visit_Date.split("T")[0] : "N/A",
          timeIn: "08:30 AM",
          areas: req.VVR_Places_to_Visit
            ? req.VVR_Places_to_Visit.split("|")
            : ["MAIN RECEPTION"],
          status: displayStatus,
          nic: visitor?.VV_NIC_Passport_NO || "N/A",
          contact: visitor?.VV_Phone || "N/A",
          email: visitor?.VV_Email || "N/A",
          representingCompany: visitor?.VV_Company || "N/A",
          visitorClassification: visitor?.VV_Visitor_Type || "N/A",
          purpose: req.VVR_Purpose || "GENERAL VISIT",
          vehicle: vehicle
            ? `${vehicle.VV_Vehicle_Number} (${vehicle.VV_Vehicle_Type})`
            : "None",
          members: [], // Members logic might need additional API if they are separate
          raw: req,
        };
      });
  }, [visitRequests, visitors, vehicles]);

  // Filtered list based on Redux searchTerm
  const filteredVisitors = mappedRequests.filter(
    (v) =>
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.batchId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.id.includes(searchTerm),
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
    if (type === "ViewGatePass") {
      setApprovedVisitorData(visitor);
      setShowQRModal(true);
    } else {
      setModalType(type);
      setIsModalOpen(true);
    }
  };

  return (
    <div className="flex flex-col min-w-0 bg-[var(--color-bg-default)] min-h-screen">
      <Header />

      <div className="flex-1 p-4 md:p-8 !pt-2 space-y-3 md:space-y-6 animate-fade-in-slow overflow-y-auto bg-[var(--color-bg-default)] relative">
        {/* Dynamic Operational Aura */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>

        <div className="max-w-[1700px] mx-auto relative z-10">
          <header className="mb-4 flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/[0.03] pb-3 gap-4 relative z-10">
            <div className="bg-[var(--color-surface-1)] border-l-4 border-primary p-3 py-2 rounded-r-2xl backdrop-blur-sm w-full md:w-auto shadow-sm">
              <div className="flex flex-col md:flex-row items-center gap-2 md:gap-2 mb-1">
                <div className="w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_8px_var(--color-primary)]"></div>
                <span className="text-[var(--color-text-primary)] text-[12px] font-bold uppercase tracking-[0.3em]">
                  Approval Management
                </span>
              </div>
              <p className="text-[var(--color-text-secondary)] text-[10px] uppercase font-bold tracking-[0.2em] opacity-80 leading-tight">
                Monitor and authorize visitor access protocols
              </p>
            </div>
          </header>

          <div className="space-y-3 md:space-y-6">
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
                    gatePasses={gatePasses}
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
                  <form
                    className="space-y-2 max-h-[calc(100vh-240px)] overflow-y-auto pr-2 custom-scrollbar"
                    onSubmit={(e) => e.preventDefault()}
                  >
                    <PersonnelAuthProtocol
                      visitor={selectedVisitor}
                      onBack={handleBackToList}
                      onAction={handleAction}
                    />

                    <div
                      className={`mt-4 p-4 border rounded-xl ${isLight ? "bg-white border-gray-200 shadow-sm" : "bg-black/40 border-white/10"}`}
                    >
                      <VisitorGroup
                        visitors={visitorGroupMembers}
                        onAdd={handleAddVisitor}
                        onRemove={handleRemoveVisitor}
                        onChange={handleUpdateVisitor}
                        isLight={isLight}
                      />
                    </div>

                    <div
                      className={`mt-2 p-2 border rounded-xl ${isLight ? "bg-white border-gray-200 shadow-sm" : "bg-black/40 border-white/10"}`}
                    >
                      <ItemsCarried
                        items={itemsCarried}
                        onAdd={handleAddItem}
                        onRemove={handleRemoveItem}
                        onChange={handleUpdateItem}
                        isLight={isLight}
                      />
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            <ApprovalModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              visitor={selectedVisitor}
              type={modalType}
              onConfirm={async (id, type) => {
                const status = type === "Approve" ? "A" : "R";
                await dispatch(ApproveVisitRequest(id, status));
                dispatch(GetAllVisitRequests()); // Refresh
                dispatch(GetAllGatePasses()); // Refresh gate passes

                if (type === "Approve") {
                  setApprovedVisitorData(
                    mappedRequests.find((v) => v.id === id) || selectedVisitor,
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
              gatePasses={gatePasses}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovalManagement;
