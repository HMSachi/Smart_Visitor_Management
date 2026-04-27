import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";
import {
  GetVisitRequestsByVisitor,
  UpdateVisitRequest,
} from "../../../actions/VisitRequestAction";
import { GetAllGatePasses } from "../../../actions/GatePassAction";
import VisitorService from "../../../services/VisitorService";
import {
  Search,
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
  AlertCircle,
  QrCode,
} from "lucide-react";
import { motion } from "framer-motion";

const StatusBadge = ({ status }) => {
  const s = (status || "").toString().trim().toUpperCase();
  switch (s) {
    case "A":
    case "APPROVED":
      return (
        <div className="px-2 py-0.5 bg-green-500/10 border border-green-500/20 text-green-500 rounded-md text-[9px] font-bold tracking-[0.08em] uppercase flex items-center gap-1.5 w-max shadow-[0_0_12px_rgba(34,197,94,0.1)]">
          <CheckCircle2 size={10} /> Approved
        </div>
      );
    case "R":
    case "REJECTED":
      return (
        <div className="px-2 py-0.5 bg-primary/10 border border-primary/20 text-primary rounded-md text-[9px] font-bold tracking-[0.08em] uppercase flex items-center gap-1.5 w-max">
          <XCircle size={10} /> Declined
        </div>
      );
    case "ACCEPTED":
      return (
        <div className="px-2 py-0.5 bg-purple-500/10 border border-purple-500/20 text-purple-500 rounded-md text-[9px] font-bold tracking-[0.08em] uppercase flex items-center gap-1.5 w-max">
          <CheckCircle2 size={10} /> Accepted
        </div>
      );
    case "P":
    case "PENDING":
    default:
      return (
        <div className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-500 rounded-md text-[9px] font-bold tracking-[0.08em] uppercase flex items-center gap-1.5 w-max">
          <Clock size={10} /> Pending
        </div>
      );
  }
};

const MyRequests = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { visitRequestsByVis, isLoading, error } = useSelector(
    (state) => state.visitRequestsState,
  );
  const { gatePasses } = useSelector(
    (state) => state.gatePassState || { gatePasses: [] },
  );

  // Extract Visitor ID from login session
  const user = useSelector((state) => state.login.user);
  const userEmail = user?.ResultSet?.[0]?.VA_Email;
  const [visitorId, setVisitorId] = useState(null);
  const [visitorName, setVisitorName] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    VVR_Request_id: "",
    VVR_Visit_Date: "",
    VVR_Places_to_Visit: "",
    VVR_Purpose: "",
  });

  useEffect(() => {
    const loadVisitorId = async () => {
      try {
        const response = await VisitorService.GetAllVisitors();

        const visitors = response?.data?.ResultSet || [];
        const match = visitors.find(
          (v) =>
            v?.VV_Email?.trim().toLowerCase() ===
            userEmail?.trim().toLowerCase(),
        );

        if (match) {
          setVisitorId(match.VV_Visitor_id);
          setVisitorName(match.VV_Name);
        }
      } catch (err) {
        console.error("Error loading visitor:", err);
      }
    };

    if (userEmail) {
      loadVisitorId();
    }
    dispatch(GetAllGatePasses());
  }, [userEmail, dispatch]);

  useEffect(() => {
    if (visitorId) {
      dispatch(GetVisitRequestsByVisitor(visitorId));
    }
  }, [dispatch, visitorId]);

  const handleViewGatePass = (req) => {
    // Find the gate pass ID from the gatePasses list
    const list = Array.isArray(gatePasses)
      ? gatePasses
      : gatePasses?.gatePasses || gatePasses?.ResultSet || [];
    const gatePass = list.find((gp) => {
      const gpRequestId =
        gp.VVR_Request_id ||
        gp.VGP_Request_id ||
        gp.vvr_Request_id ||
        gp.vgp_Request_id;
      return String(gpRequestId) === String(req.VVR_Request_id);
    });

    const gatePassId = gatePass?.VGP_Pass_id || gatePass?.vgp_Pass_id;

    if (!gatePassId) {
      console.error("Gate pass not found");
      return;
    }

    // Navigate with gatePassId as URL parameter
    navigate(`/visitor/gate-pass/${gatePassId}`);
  };

  const hasGatePass = (requestId) => {
    if (!requestId) return false;
    const list = Array.isArray(gatePasses)
      ? gatePasses
      : gatePasses?.gatePasses || gatePasses?.ResultSet || [];
    return list.some((gp) => {
      const gpRequestId =
        gp.VVR_Request_id ||
        gp.VGP_Request_id ||
        gp.vvr_Request_id ||
        gp.vgp_Request_id;
      return String(gpRequestId) === String(requestId);
    });
  };

  const openEditModal = (request) => {
    setFormData({
      VVR_Request_id: request.VVR_Request_id,
      VVR_Visit_Date: request.VVR_Visit_Date
        ? request.VVR_Visit_Date.split("T")[0]
        : "",
      VVR_Places_to_Visit: request.VVR_Places_to_Visit,
      VVR_Purpose: request.VVR_Purpose,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!visitorId) {
      console.error("Update blocked: visitorId is missing.");
      alert("Visitor ID not found for the logged user.");
      return;
    }

    console.log("visitorId being used:", visitorId);
    console.log("UpdateVisitRequest payload:", formData);

    dispatch(UpdateVisitRequest(formData));
    closeModal();

    setTimeout(() => dispatch(GetVisitRequestsByVisitor(visitorId)), 1500);
  };

  const filteredRequests = visitRequestsByVis
    ? visitRequestsByVis.filter(
        (req) =>
          String(req.VVR_Request_id).includes(searchTerm) ||
          req.VVR_Purpose?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : [];

  return (
    <div className="min-h-screen bg-[var(--color-bg-default)] text-white px-4 md:px-8 pt-24 md:pt-28 pb-6 md:pb-8 font-sans relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-[1100px] mx-auto relative z-10">
        <header className="mb-5">
          <div>
            <h1 className="text-[20px] md:text-[21px] font-semibold text-white mt-1 tracking-[0.02em]">
              My Visit Requests
            </h1>
          </div>
        </header>

        <div>
          {isLoading ? (
            <div className="bg-black/20 border border-white/5 rounded-[20px] overflow-hidden backdrop-blur-xl shadow-2xl p-24 flex flex-col items-center justify-center">
              <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              <p className="mt-6 text-gray-400 font-bold uppercase tracking-[0.4em] text-xs">
                Hang tight, we're loading your visit requests.
              </p>
            </div>
          ) : error ? (
            <div className="bg-black/20 border border-white/5 rounded-[20px] overflow-hidden backdrop-blur-xl shadow-2xl p-24 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary border border-primary/20">
                <AlertCircle size={32} />
              </div>
              <p className="text-primary font-bold uppercase tracking-[0.2em]">
                {error}
              </p>
            </div>
          ) : filteredRequests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-max">
              {filteredRequests.map((req) => (
                <motion.div
                  key={req.VVR_Request_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="group bg-black/20 border border-white/5 rounded-[20px] overflow-hidden backdrop-blur-xl shadow-2xl hover:border-white/10 hover:bg-black/30 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10"
                >
                  <div className="p-5 md:p-6 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5 flex-1 min-w-0">
                        <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center text-primary border border-primary/20 flex-shrink-0">
                          <Hash size={11} />
                        </div>
                        <span className="text-white font-mono tracking-normal text-[13px] font-semibold truncate">
                          #{req.VVR_Request_id}
                        </span>
                      </div>
                      <div className="flex-shrink-0">
                        <StatusBadge status={req.VVR_Status} />
                      </div>
                    </div>

                    <div className="h-px bg-gradient-to-r from-white/5 via-white/10 to-white/5"></div>

                    <div className="space-y-3.5">
                      <div>
                        <p className="text-gray-500 font-semibold uppercase tracking-[0.1em] text-[9px] mb-1.5">
                          Visit Date
                        </p>
                        <div className="flex items-center gap-2 text-gray-300">
                          <Calendar
                            size={14}
                            className="text-primary/50 flex-shrink-0"
                          />
                          <span className="text-[13px] font-medium tracking-normal">
                            {req.VVR_Visit_Date
                              ? req.VVR_Visit_Date.split("T")[0]
                              : "N/A"}
                          </span>
                        </div>
                      </div>

                      <div>
                        <p className="text-gray-500 font-semibold uppercase tracking-[0.1em] text-[9px] mb-1.5">
                          Destination
                        </p>
                        <div className="flex items-center gap-2 text-gray-300">
                          <MapPin
                            size={14}
                            className="text-primary/50 flex-shrink-0"
                          />
                          <span className="text-[13px] font-medium tracking-normal truncate">
                            {req.VVR_Places_to_Visit || "-"}
                          </span>
                        </div>
                      </div>

                      <div>
                        <p className="text-gray-500 font-semibold uppercase tracking-[0.1em] text-[9px] mb-1.5">
                          Purpose
                        </p>
                        <p className="text-white font-medium tracking-wide text-[13px] opacity-80 line-clamp-2">
                          {req.VVR_Purpose || "-"}
                        </p>
                      </div>
                    </div>

                    {hasGatePass(req.VVR_Request_id) &&
                      (req.VVR_Status === "A" ||
                        req.VVR_Status === "APPROVED") && (
                        <div className="pt-2">
                          <button
                            onClick={() => handleViewGatePass(req)}
                            className="w-full flex items-center justify-center gap-2 py-3 bg-primary/10 border border-primary/30 rounded-xl text-primary hover:bg-primary/20 hover:border-primary/50 transition-all font-bold uppercase tracking-[0.1em] text-[11px] group/btn"
                          >
                            <QrCode
                              size={14}
                              className="group-hover/btn:scale-110 transition-transform"
                            />
                            View Gate Pass
                          </button>
                        </div>
                      )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-black/20 border border-white/5 rounded-[20px] overflow-hidden backdrop-blur-xl shadow-2xl p-24 text-center">
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 text-gray-400 border border-white/5">
                <ClipboardList size={32} />
              </div>
              <p className="text-gray-400 font-bold uppercase tracking-[0.3em] text-xs">
                No active visitation requests detected
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal (Visitor side) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-fade-in">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white border border-gray-100 rounded-[40px] shadow-2xl w-full max-w-xl overflow-hidden relative"
          >
            <div className="p-8 md:p-10 border-b border-gray-100 bg-[#F8F9FA] flex justify-between items-center">
              <div>
                <span className="text-primary font-bold uppercase tracking-[0.3em] text-[10px]">
                  Edit Request
                </span>
                <h2 className="text-2xl font-black text-[#1A1A1A] mt-1 uppercase tracking-tight">
                  Review &amp; Update
                </h2>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="p-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-400 hover:text-primary rounded-2xl transition-all shadow-sm"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-8">
              <div className="grid grid-cols-1 gap-8">
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.2em] ml-1">
                    Visit Date
                  </label>
                  <div className="relative group">
                    <Calendar
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors"
                      size={18}
                    />
                    <input
                      required
                      type="date"
                      name="VVR_Visit_Date"
                      value={formData.VVR_Visit_Date}
                      onChange={handleInputChange}
                      className="w-full bg-[#F8F9FA] border border-gray-200 rounded-2xl pl-12 pr-6 py-4 text-[#1A1A1A] text-sm font-bold uppercase tracking-widest focus:outline-none focus:border-primary/50 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.2em] ml-1">
                    Visiting Areas
                  </label>
                  <div className="relative group">
                    <MapPin
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors"
                      size={18}
                    />
                    <input
                      required
                      type="text"
                      name="VVR_Places_to_Visit"
                      value={formData.VVR_Places_to_Visit}
                      onChange={handleInputChange}
                      className="w-full bg-[#F8F9FA] border border-gray-200 rounded-2xl pl-12 pr-6 py-4 text-[#1A1A1A] text-sm font-bold uppercase tracking-widest focus:outline-none focus:border-primary/50 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-gray-400"
                      placeholder="E.G. MAIN PRODUCTION FLOOR"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.2em] ml-1">
                    Updated Purpose
                  </label>
                  <div className="relative group">
                    <ClipboardList
                      className="absolute left-4 top-5 text-gray-400 group-focus-within:text-primary transition-colors"
                      size={18}
                    />
                    <textarea
                      required
                      name="VVR_Purpose"
                      value={formData.VVR_Purpose}
                      onChange={handleInputChange}
                      rows="4"
                      className="w-full bg-[#F8F9FA] border border-gray-200 rounded-2xl pl-12 pr-6 py-4 text-[#1A1A1A] text-[13px] font-medium tracking-wide focus:outline-none focus:border-primary/50 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all resize-none placeholder:text-gray-400"
                      placeholder="Clarify the purpose of your visit..."
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 md:gap-4 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-4 bg-white border border-gray-200 rounded-2xl text-gray-500 font-bold uppercase tracking-widest hover:bg-gray-50 hover:text-gray-700 hover:border-gray-300 transition-all shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-5 bg-primary rounded-2xl text-white font-black uppercase tracking-[0.2em] hover:bg-[var(--color-primary-hover)] transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3"
                >
                  <Send size={18} /> Confirm Changes
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default MyRequests;
