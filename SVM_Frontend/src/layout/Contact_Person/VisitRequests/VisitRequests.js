import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Menu,
  MenuItem,
} from "@mui/material";
import {
  AddVisitRequest,
  UpdateVisitRequest,
  GetVisitRequestsByCP,
  ApproveVisitRequest,
} from "../../../actions/VisitRequestAction";
import { GetVisitorsByCP, GetAllVisitors } from "../../../actions/VisitorAction";
import { AddVehicle } from "../../../actions/VehicleAction";
import ContactPersonService from "../../../services/ContactPersonService";
import Header from "../../../components/Contact_Person/Layout/Header";
import Sidebar from "../../../components/Contact_Person/Layout/Sidebar";
import { useThemeMode } from "../../../theme/ThemeModeContext";
import {
  Search,
  Plus,
  X,
  Calendar,
  MapPin,
  ClipboardList,
  Send,
  Edit,
  CheckCircle2,
  XCircle,
  Clock,
  Hash,
  User,
  AlertCircle,
  Filter,
  ChevronDown,
  Car,
  MoreVertical,
} from "lucide-react";

const StatusBadge = ({ status }) => {
  const s = (status || "").toString().trim().toUpperCase();
  switch (s) {
    case "A":
    case "APPROVED":
      return (
        <div className="px-2 py-0.5 bg-green-500/10 border border-green-500/20 text-green-500 rounded-md text-[10px] font-bold tracking-[0.1em] uppercase flex items-center justify-center w-max shadow-sm">
          Approved
        </div>
      );
    case "R":
    case "REJECTED":
      return (
        <div className="px-2 py-0.5 bg-primary/10 border border-primary/20 text-primary rounded-md text-[10px] font-bold tracking-[0.1em] uppercase flex items-center justify-center w-max shadow-sm">
          Rejected
        </div>
      );
    case "ACCEPTED":
      return (
        <div className="px-2 py-0.5 bg-purple-500/10 border border-purple-500/20 text-purple-500 rounded-md text-[10px] font-bold tracking-[0.1em] uppercase flex items-center justify-center w-max">
          Accepted
        </div>
      );
    case "SENT":
      return (
        <div className="px-2 py-0.5 bg-orange-500/10 border border-orange-500/20 text-orange-500 rounded-md text-[10px] font-bold tracking-[0.1em] uppercase flex items-center justify-center w-max">
          Syncing
        </div>
      );
    case "P":
    case "PENDING":
    default:
      return (
        <div className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-500 rounded-md text-[10px] font-bold tracking-[0.1em] uppercase flex items-center justify-center w-max shadow-sm">
          Pending
        </div>
      );
  }
};

const capitalizeName = (name) => {
  if (!name) return "";
  return name
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const VisitRequests = () => {
  const dispatch = useDispatch();
  const { visitRequestsByCP, isLoading, error } = useSelector(
    (state) => state.visitRequestsState,
  );
  const { visitorsByCP, visitors } = useSelector((state) => state.visitorManagement);
  const { themeMode } = useThemeMode();
  const isLight = themeMode === "light";

  const user = useSelector((state) => state.login.user);
  const userEmail = user?.ResultSet?.[0]?.VA_Email;
  const [cpId, setCpId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [formData, setFormData] = useState({
    VVR_Request_id: "",
    VVR_Visitor_id: "",
    VVR_Contact_person_id: "",
    VVR_Visit_Date: "",
    VVR_Places_to_Visit: "",
    VVR_Purpose: "",
    VV_Vehicle_Type: "",
    VV_Vehicle_Number: "",
  });

  // Action Menu State
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedReq, setSelectedReq] = useState(null);

  const handleMenuOpen = (event, req) => {
    setAnchorEl(event.currentTarget);
    setSelectedReq(req);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedReq(null);
  };

  const handleDisableRequest = async () => {
    if (selectedReq) {
      const payload = {
        VVR_Request_id: selectedReq.VVR_Request_id,
        VVR_Visit_Date: selectedReq.VVR_Visit_Date ? selectedReq.VVR_Visit_Date.split("T")[0] : "",
        VVR_Places_to_Visit: selectedReq.VVR_Places_to_Visit || "",
        VVR_Purpose: selectedReq.VVR_Purpose || "",
        VVR_Status: "R",
        VVR_Contact_person_id: cpId
      };
      await dispatch(UpdateVisitRequest(payload));
    }
    handleMenuClose();
  };

  const handleSendToAdmin = async () => {
    if (selectedReq) {
      const payload = {
        VVR_Request_id: selectedReq.VVR_Request_id,
        VVR_Visit_Date: selectedReq.VVR_Visit_Date ? selectedReq.VVR_Visit_Date.split("T")[0] : "",
        VVR_Places_to_Visit: selectedReq.VVR_Places_to_Visit || "",
        VVR_Purpose: selectedReq.VVR_Purpose || "",
        VVR_Status: "SENT",
        VVR_Contact_person_id: cpId
      };
      await dispatch(UpdateVisitRequest(payload));
      alert("Request protocol initiated. Sent to Cloud Admin for final approval.");
    }
    handleMenuClose();
  };

  useEffect(() => {
    const loadContactPersonId = async () => {
      try {
        const response = await ContactPersonService.GetAllContactPersons();
        const contactPersons = response?.data?.ResultSet || [];
        const match = contactPersons.find(
          (cp) =>
            cp?.VCP_Email?.trim().toLowerCase() ===
            userEmail?.trim().toLowerCase(),
        );

        if (match?.VCP_Contact_person_id) {
          setCpId(match.VCP_Contact_person_id);
          return;
        }

        setCpId(user?.ResultSet?.[0]?.VCP_Contact_person_id || null);
      } catch (err) {
        console.error("Error loading contact person:", err);
        setCpId(user?.ResultSet?.[0]?.VCP_Contact_person_id || null);
      }
    };

    if (userEmail) {
      loadContactPersonId();
    } else {
      setCpId(user?.ResultSet?.[0]?.VCP_Contact_person_id || null);
    }
  }, [userEmail, user]);

  useEffect(() => {
    if (!cpId) return;
    dispatch(GetVisitRequestsByCP(cpId));
    dispatch(GetVisitorsByCP(cpId));
    dispatch(GetAllVisitors());
    setFormData((prev) => ({ ...prev, VVR_Contact_person_id: cpId }));
  }, [dispatch, cpId]);

  const openModal = (mode, request = null) => {
    setModalMode(mode);
    if (request) {
      setFormData({
        VVR_Request_id: request.VVR_Request_id,
        VVR_Visitor_id: request.VVR_Visitor_id,
        VVR_Contact_person_id: cpId,
        VVR_Visit_Date: request.VVR_Visit_Date
          ? request.VVR_Visit_Date.split("T")[0]
          : "",
        VVR_Places_to_Visit: request.VVR_Places_to_Visit,
        VVR_Purpose: request.VVR_Purpose,
        VV_Vehicle_Type: "", // Reset for edit mode unless we fetch existing vehicle
        VV_Vehicle_Number: "",
      });
    } else {
      setFormData({
        VVR_Request_id: "",
        VVR_Visitor_id: "",
        VVR_Contact_person_id: cpId,
        VVR_Visit_Date: "",
        VVR_Places_to_Visit: "",
        VVR_Purpose: "",
        VV_Vehicle_Type: "",
        VV_Vehicle_Number: "",
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (modalMode === "add") {
        response = await dispatch(AddVisitRequest(formData));

        // Extract Request ID for vehicle registration
        const requestId =
          response?.ResultSet?.[0]?.VVR_Request_id ||
          response?.VVR_Request_id ||
          0;

        // If vehicle details provided, add them
        if (
          requestId &&
          (formData.VV_Vehicle_Number || formData.VV_Vehicle_Type)
        ) {
          dispatch(
            AddVehicle({
              VV_Vehicle_Type: formData.VV_Vehicle_Type || "N/A",
              VV_Vehicle_Number: formData.VV_Vehicle_Number || "N/A",
              VVR_Request_id: requestId,
            }),
          );
        }
      } else {
        dispatch(UpdateVisitRequest(formData));
      }
    } catch (err) {
      console.error("Submission failed:", err);
    }
    closeModal();
  };

  const handleAction = (id, status) => {
    dispatch(ApproveVisitRequest(id, status));
    setTimeout(() => dispatch(GetVisitRequestsByCP(cpId)), 2000);
  };

  const filteredRequests = visitRequestsByCP
    ? visitRequestsByCP.filter(
      (req) =>
        String(req.VVR_Request_id).includes(searchTerm) ||
        req.VVR_Purpose?.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    : [];

  const activeVisitors = (visitorsByCP || []).filter((visitor) => {
    const status = (visitor?.VV_Status || "").toString().trim().toUpperCase();
    return status === "A" || status === "ACTIVE";
  });

  return (
    <div className={`flex overflow-hidden h-screen w-full transition-colors duration-500 ${isLight ? "bg-[#F8F9FA] text-[#1A1A1A]" : "bg-[var(--color-bg-default)] text-white"}`}>
      <Sidebar />

      <div className={`flex-1 flex flex-col min-w-0 overflow-y-auto relative ${isLight ? "bg-[#F8F9FA]" : "bg-[var(--color-bg-default)]"}`}>
        <Header title="Visitation Node Management" />

        <div className="p-4 md:p-8 animate-fade-in-slow relative max-w-[1700px] mx-auto w-full z-10">
          <header className={`mb-10 flex flex-col md:flex-row justify-between items-start md:items-end border-b pb-8 gap-6 relative ${isLight ? "border-gray-100" : "border-white/[0.03]"}`}>
            <div>
              <h2 className={`text-lg font-bold tracking-tight uppercase ${isLight ? "text-[#1A1A1A]" : "text-white"}`}>Active Visit Requests</h2>
              <p className={`text-[11px] font-bold uppercase tracking-[0.2em] mt-1 opacity-90 ${isLight ? "text-gray-500" : "text-white/50"}`}>Manage visitor applications</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-5 w-full md:w-auto items-center">
              <div className={`flex items-center border transition-all rounded-xl px-5 py-3.5 min-w-[340px] group shadow-sm ${isLight ? "bg-white border-gray-200 hover:border-primary/20 focus-within:border-primary/40" : "bg-black/40 border-white/10 focus-within:border-primary hover:border-white/20"}`}>
                <Search size={14} className={`transition-colors mr-4 ${isLight ? "text-gray-400 group-focus-within:text-primary" : "text-white/20 group-focus-within:text-primary"}`} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="SEARCH VISITOR..."
                  className={`bg-transparent text-[12px] focus:outline-none w-full uppercase tracking-widest ${isLight ? "text-[#1A1A1A] placeholder:text-gray-400" : "text-white placeholder:text-white/20"}`}
                />
              </div>

              <button
                onClick={() => openModal("add")}
                className="flex items-center gap-3 bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-xl text-[12px] font-bold uppercase tracking-[0.2em] transition-all shadow-[0_8px_20px_rgba(200,16,46,0.3)] active:scale-95 group"
              >
                <Plus size={16} className="group-hover:rotate-90 transition-transform" /> Create Visit Request
              </button>
            </div>
          </header>

          <div className={`border rounded-[24px] overflow-hidden relative ${isLight ? "bg-white border-gray-200 shadow-xl shadow-gray-200/50" : "bg-[#0F0F10] border-white/5"}`}>

            {isLoading ? (
              <div className="p-24 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 border-2 border-white/5 border-t-primary rounded-full animate-spin mb-8 shadow-[0_0_15px_var(--color-primary)]"></div>
                <p className="text-gray-400 text-[11px] uppercase tracking-[0.4em] font-bold animate-pulse">
                  Initializing Security Protocol...
                </p>
              </div>
            ) : error ? (
              <div className="p-24 text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-primary/20 text-primary shadow-2xl">
                  <AlertCircle size={32} />
                </div>
                <p className="text-primary text-[13px] font-bold uppercase tracking-[0.3em]">
                  {error}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto custom-scrollbar relative z-10">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className={`border-b ${isLight ? "bg-[#F8F9FA] border-gray-100" : "bg-black/40 border-b-white/5"}`}>
                      <th className={`px-6 py-4 text-left font-bold uppercase tracking-[0.2em] text-[13px] ${isLight ? "text-primary/60" : "text-primary"}`}>
                        Visitor Node
                      </th>
                      <th className={`px-6 py-4 text-left font-bold uppercase tracking-[0.2em] text-[13px] ${isLight ? "text-gray-400" : "text-white/40"}`}>
                        Visitor Name
                      </th>
                      <th className={`px-6 py-4 text-center font-bold uppercase tracking-[0.2em] text-[13px] ${isLight ? "text-gray-400" : "text-white/40"}`}>
                        Date to Visit
                      </th>
                      <th className={`px-6 py-4 text-left font-bold uppercase tracking-[0.2em] text-[13px] ${isLight ? "text-gray-400" : "text-white/40"}`}>
                        Objective
                      </th>
                      <th className={`px-6 py-4 text-left font-bold uppercase tracking-[0.2em] text-[13px] ${isLight ? "text-gray-400" : "text-white/40"}`}>
                        Clearance Area
                      </th>
                      <th className={`px-6 py-4 text-left font-bold uppercase tracking-[0.2em] text-[13px] ${isLight ? "text-gray-400" : "text-white/40"}`}>
                        Status
                      </th>
                      <th className={`px-6 py-4 text-right font-bold uppercase tracking-[0.2em] text-[13px] ${isLight ? "text-gray-400" : "text-white/40"}`}>
                        Operations
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredRequests && filteredRequests.length > 0 ? (
                      filteredRequests.map((req) => (
                        <tr
                          key={req.VVR_Request_id}
                          className={`group border-b transition-all duration-300 relative overflow-hidden ${isLight ? "hover:bg-[#F8F9FA] border-gray-50" : "hover:bg-white/[0.02] border-white/5"}`}
                        >
                          <td className={`px-6 py-5 font-bold text-[13px] uppercase tracking-wider ${isLight ? "text-[#1A1A1A]" : "text-white"}`}>
                            {req.VVR_Visitor_id}
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <span className={`font-bold text-[13px] uppercase tracking-wider ${isLight ? "text-[#1A1A1A]" : "text-white"}`}>
                                {(() => {
                                  const matched = (visitors || []).find(v => String(v.VV_Visitor_id) === String(req.VVR_Visitor_id));
                                  return capitalizeName(matched?.VV_Name || req.VVR_Visitor_Name || `Visitor ${req.VVR_Visitor_id}`);
                                })()}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <div className={`flex flex-col items-center justify-center gap-2.5 text-[13px] ${isLight ? "text-gray-500" : "text-white/70"}`}>
                              <span className="font-bold tracking-wide">
                                {req.VVR_Visit_Date ? req.VVR_Visit_Date.split("T")[0].split(" ")[0] : "N/A"}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="max-w-[200px]">
                              <p className={`font-bold uppercase tracking-wider text-[13px] truncate ${isLight ? "text-[#1A1A1A]" : "text-white/90"}`}>
                                {req.VVR_Purpose || "-"}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <div className={`flex items-center gap-2 text-[13px] font-bold tracking-wide ${isLight ? "text-gray-400" : "text-white/50"}`}>
                              <MapPin size={13} className="opacity-40" />
                              <span>{req.VVR_Places_to_Visit || "-"}</span>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <StatusBadge status={req.VVR_Status} />
                          </td>
                          <td className="px-6 py-5 text-right">
                            <div className="flex items-center justify-end gap-3 opacity-40 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => openModal("edit", req)}
                                className="p-1.5 rounded-lg text-blue-400 hover:bg-blue-400/10 border border-transparent hover:border-blue-400/20 transition-all"
                                title="Modify Protocol"
                              >
                                <Edit size={13} />
                              </button>
                              <button
                                onClick={(e) => handleMenuOpen(e, req)}
                                className={`p-2 rounded-lg border border-transparent transition-all ${isLight ? "text-gray-400 hover:bg-black/5 hover:border-black/10" : "text-gray-400 hover:bg-white/5 hover:border-white/10"}`}
                                title="Operational Menu"
                              >
                                <MoreVertical size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={7}
                          className="py-24 text-center"
                        >
                           <div className="flex flex-col items-center justify-center opacity-20">
                             <ClipboardList size={48} className={`mb-4 ${isLight ? "text-[#1A1A1A]" : "text-white"}`} />
                             <p className={`uppercase tracking-[0.4em] text-[10px] font-bold ${isLight ? "text-[#1A1A1A]" : "text-white"}`}>
                               No Active Visit Requests Detected
                             </p>
                           </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Modal for Add/Update Visit Request */}
        {isModalOpen && (
          <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in overflow-y-auto ${isLight ? "bg-black/40 backdrop-blur-sm" : "bg-black/90 backdrop-blur-md"}`}>
            <div className={`${isLight ? "bg-white border-gray-200 shadow-2xl shadow-gray-200/50" : "bg-[#0A0A0B] border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)]"} border rounded-[32px] w-full max-w-lg overflow-hidden relative my-auto border-t-primary/20`}>
              <div className={`absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none opacity-50`}></div>

              <div className="flex justify-between items-center p-8 border-b border-white/5 relative z-10 bg-white/[0.01]">
                <div className="flex items-center gap-4">
                  <div className="w-1.5 h-8 bg-primary rounded-full shadow-[0_0_10px_var(--color-primary)]"></div>
                  <div>
                    <p className="text-primary text-[10px] font-bold uppercase tracking-[0.3em] mb-1">Authorization Layer</p>
                    <h2 className={`text-lg font-bold uppercase tracking-[0.1em] ${isLight ? "text-[#1A1A1A]" : "text-white"}`}>
                        {modalMode === "add" ? "Initialize Request" : "Modify Request"}
                    </h2>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-white transition-all bg-white/5 p-2.5 rounded-xl border border-white/5 hover:border-white/20"
                >
                  <X size={20} />
                </button>
              </div>

              <form
                onSubmit={handleSubmit}
                className="p-8 space-y-7 relative z-10"
              >
                <div className="space-y-5">
                  {modalMode === "add" && (
                    <div className="space-y-2">
                      <label className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold px-1 opacity-70">
                         Target Visitor Node
                      </label>
                      <select
                        required
                        name="VVR_Visitor_id"
                        value={formData.VVR_Visitor_id}
                        onChange={handleInputChange}
                        className={`w-full border rounded-xl px-5 py-4 text-[13px] focus:outline-none focus:border-primary/50 appearance-none cursor-pointer transition-all ${
                          isLight 
                            ? "bg-gray-50 border-gray-200 text-[#1A1A1A] hover:bg-gray-100" 
                            : "bg-white/[0.03] border-white/10 text-white hover:bg-white/[0.05]"
                        }`}
                      >
                        <option value="" className={isLight ? "bg-white text-[#1A1A1A]" : "bg-[#0A0A0B] text-white"}>SELECT AUTHORIZED VISITOR</option>
                        {activeVisitors.map((v) => (
                          <option
                            key={v.VV_Visitor_id}
                            value={v.VV_Visitor_id}
                            className={isLight ? "bg-white text-[#1A1A1A]" : "bg-[#0A0A0B] text-white"}
                          >
                            {v.VV_Name} (ID: {v.VV_Visitor_id})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="space-y-2 text-white">
                    <label className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold px-1 opacity-70">
                       Proposed Synchronization Date
                    </label>
                    <input
                      required
                      type="date"
                      name="VVR_Visit_Date"
                      value={formData.VVR_Visit_Date}
                      onChange={handleInputChange}
                      className={`w-full border rounded-xl px-5 py-4 text-[13px] focus:outline-none focus:border-primary/50 transition-all ${
                        isLight 
                          ? "bg-gray-50 border-gray-200 text-[#1A1A1A] hover:bg-gray-100" 
                          : "bg-white/[0.03] border-white/10 text-white hover:bg-white/[0.05]"
                      }`}
                      style={{ colorScheme: isLight ? 'light' : 'dark' }}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold px-1 opacity-70">
                       Designated Clearance Area
                    </label>
                    <input
                      required
                      type="text"
                      name="VVR_Places_to_Visit"
                      value={formData.VVR_Places_to_Visit}
                      onChange={handleInputChange}
                      className={`w-full border rounded-xl px-5 py-4 text-[13px] focus:outline-none focus:border-primary/50 transition-all ${
                        isLight 
                          ? "bg-gray-50 border-gray-200 text-[#1A1A1A] hover:bg-gray-100" 
                          : "bg-white/[0.03] border-white/10 text-white hover:bg-white/[0.05]"
                      }`}
                      placeholder="ENTER CLEARANCE ZONE..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold px-1 opacity-70">
                       Protocol Objective
                    </label>
                    <textarea
                      required
                      name="VVR_Purpose"
                      value={formData.VVR_Purpose}
                      onChange={handleInputChange}
                      rows="3"
                      className={`w-full border rounded-xl px-5 py-4 text-[13px] focus:outline-none focus:border-primary/50 resize-none transition-all ${
                        isLight 
                          ? "bg-gray-50 border-gray-200 text-[#1A1A1A] hover:bg-gray-100" 
                          : "bg-white/[0.03] border-white/10 text-white hover:bg-white/[0.05]"
                      }`}
                      placeholder="SPECIFY CLEARANCE REASON..."
                    ></textarea>
                  </div>

                  <div className="pt-4 border-t border-white/5 space-y-4">
                    <p className="text-[10px] font-bold text-primary uppercase tracking-[0.3em]">Logistic Assets</p>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="VV_Vehicle_Type"
                        value={formData.VV_Vehicle_Type}
                        onChange={handleInputChange}
                        className={`w-full border rounded-xl px-4 py-3.5 text-[12px] focus:outline-none focus:border-primary/40 placeholder:text-gray-400 ${
                          isLight 
                            ? "bg-gray-50 border-gray-200 text-[#1A1A1A] hover:bg-gray-100" 
                            : "bg-white/[0.03] border-white/5 text-white hover:bg-white/[0.05]"
                        }`}
                        placeholder="VEHICLE CLASS"
                      />
                      <input
                        type="text"
                        name="VV_Vehicle_Number"
                        value={formData.VV_Vehicle_Number}
                        onChange={handleInputChange}
                        className={`w-full border rounded-xl px-4 py-3.5 text-[12px] focus:outline-none focus:border-primary/40 placeholder:text-gray-400 ${
                          isLight 
                            ? "bg-gray-50 border-gray-200 text-[#1A1A1A] hover:bg-gray-100" 
                            : "bg-white/[0.03] border-white/5 text-white hover:bg-white/[0.05]"
                        }`}
                        placeholder="PLATE ID"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 flex justify-end gap-4 border-t border-white/5">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-6 py-4 rounded-xl text-[11px] font-bold text-gray-500 hover:text-white hover:bg-white/5 uppercase tracking-[0.2em] transition-all"
                  >
                    Abort
                  </button>
                  <button
                    type="submit"
                    className="px-10 py-4 rounded-xl bg-primary hover:bg-primary-hover text-white text-[11px] font-bold uppercase tracking-[0.2em] shadow-[0_8px_25px_rgba(200,16,46,0.3)] transition-all"
                  >
                     {modalMode === "add" ? "Confirm Request" : "Update Records"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Actions Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            className: `${isLight ? "bg-white border-gray-200 text-[#1A1A1A] shadow-xl" : "bg-[#18181B] border-white/10 text-white shadow-2xl"} border min-w-[200px] overflow-hidden rounded-xl py-1`
          }}
          MenuListProps={{
            className: "py-0"
          }}
        >
          <MenuItem
            onClick={handleDisableRequest}
            className="px-4 py-3 text-[12px] uppercase font-bold tracking-widest text-primary hover:bg-primary/5 transition-colors border-b border-white/5"
          >
            <div className="flex items-center gap-3">
              <XCircle size={14} /> Disable Visit Request
            </div>
          </MenuItem>
          <MenuItem
            onClick={handleSendToAdmin}
            className="px-4 py-3 text-[12px] uppercase font-bold tracking-widest text-green-500 hover:bg-green-500/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <CheckCircle2 size={14} /> Send to Admin for Approve
            </div>
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
};

export default VisitRequests;
