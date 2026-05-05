import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../../../components/Admin/Layout/Header";
import VisitorTable from "../../../components/Admin/ApprovalManagement/VisitorTable";
import PersonnelAuthProtocol from "../../../components/common/PersonnelAuthProtocol";
import ApprovalModal from "../../../components/Admin/ApprovalManagement/ApprovalModal";
import QRSuccessModal from "../../../components/Admin/ApprovalManagement/QRSuccessModal";
import { ArrowLeft, Shield, CheckCircle2, AlertCircle, QrCode } from "lucide-react";
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
import { useThemeMode } from "../../../theme/ThemeModeContext";
import VisitGroupService from "../../../services/VisitGroupService";
import ItemCarriedService from "../../../services/ItemCarriedService";
import VehicleService from "../../../services/VehicleService";

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
  const [vehiclesForVisitor, setVehiclesForVisitor] = useState([]);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const formScrollRef = React.useRef(null);

  React.useEffect(() => {
    dispatch(GetAllVisitRequests());
    dispatch(GetAllVisitors());
    dispatch(GetAllVehicles());
    dispatch(GetAllGatePasses());
  }, [dispatch]);

  // Load visitor group, items, and vehicles when a visitor is selected
  React.useEffect(() => {
    if (selectedVisitor && viewMode === "details") {
      const loadDetails = async () => {
        setDetailsLoading(true);
        try {
          // Load visiting people (group members)
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

          // Load items carried
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

          // Load vehicles for this request
          const vehiclesRes = await VehicleService.GetAllVehicles();
          const allVehicles = vehiclesRes?.data?.ResultSet || vehiclesRes?.data || [];
          const matchedVehicles = (Array.isArray(allVehicles) ? allVehicles : [])
            .filter(
              (v) => String(v.VVR_Request_id) === String(selectedVisitor.id),
            )
            .map((v) => ({
              id: v.VV_Vehicle_id,
              vehicleType: v.VV_Vehicle_Type,
              plateNumber: v.VV_Vehicle_Number,
            }));
          setVehiclesForVisitor(matchedVehicles);
        } catch (err) {
          console.error("Error loading details in Admin view:", err);
        } finally {
          setDetailsLoading(false);
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
        if (s === "SENT" || s === "SENT_TO_ADMIN")
          displayStatus = "Accepted by Contact Person";
        else if (s === "A" || s === "APPROVED")
          displayStatus = "Admin Approved";
        else if (s === "R" || s === "REJECTED") displayStatus = "Rejected";
        else if (s === "ACCEPTED") displayStatus = "Accepted by Visitor";

        return {
          id: req.VVR_Request_id?.toString() || "",
          batchId: `BATCH-${new Date(req.VVR_Visit_Date).getFullYear()}-${req.VVR_Request_id?.toString().padStart(3, "0")}`,
          name:
            req?.VV_Name ||
            req?.VVR_Visitor_Name ||
            visitor?.VV_Name ||
            `Visitor #${req.VVR_Visitor_id}`,
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
    <div className="flex flex-col min-w-0 bg-[var(--color-bg-default)] h-screen">
      <Header 
        title={viewMode === "details" ? "Approval Management" : undefined}
        showBack={viewMode === "details"}
        onBack={handleBackToList}
      />

      <div className="flex-1 p-2 md:p-4 space-y-2 animate-fade-in-slow overflow-y-auto bg-[var(--color-bg-default)] relative">
        {/* Dynamic Operational Aura */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>

        <div className="max-w-[1700px] mx-auto relative z-10 flex flex-col min-h-full">

          <div className="flex-1 flex flex-col space-y-3 md:space-y-6">
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
                  className="flex-1 flex flex-col"
                >
                  <div
                    ref={formScrollRef}
                    className="flex-1 flex flex-col space-y-2"
                  >
                      <div className="flex items-center justify-end gap-2">
                        {selectedVisitor?.status === "Accepted by Contact Person" && (
                          <div className="flex flex-row items-center gap-2">
                            <button
                              onClick={() => handleAction(selectedVisitor, "Approve")}
                              className="px-4 py-2 bg-[#00B14F] hover:bg-[#009e46] text-white text-[9px] font-bold tracking-[0.15em] uppercase rounded-lg transition-all shadow-sm flex items-center gap-2"
                            >
                              <CheckCircle2 size={12} />
                              ACCEPT
                            </button>
                            <button
                              onClick={() => handleAction(selectedVisitor, "Reject")}
                              className="px-4 py-2 bg-primary hover:bg-[#A00D25] text-white text-[9px] font-bold tracking-[0.15em] uppercase rounded-lg transition-all shadow-sm flex items-center gap-2"
                            >
                              <AlertCircle size={12} />
                              REJECT
                            </button>
                          </div>
                        )}
                      </div>
                    {detailsLoading ? (
                      <div className="flex items-center justify-center py-16">
                        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : (
                      <PersonnelAuthProtocol
                        visitor={selectedVisitor}
                        onBack={handleBackToList}
                        onAction={handleAction}
                        showStatusForAdmin={true}
                        groupMembers={visitorGroupMembers}
                        itemsCarried={itemsCarried}
                        vehiclesList={vehiclesForVisitor}
                      />
                    )}
                  </div>
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
