import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import {
  GetVisitRequestsByVisitor,
  UpdateVisitRequest,
} from "../../../actions/VisitRequestAction";
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
} from "lucide-react";
import { motion } from "framer-motion";

const StatusBadge = ({ status }) => {
  const s = (status || "").toString().trim().toUpperCase();
  switch (s) {
    case "A":
    case "APPROVED":
      return (
        <div className="px-3 py-1 bg-green-500/10 border border-green-500/20 text-green-500 rounded-lg text-[10px] font-bold tracking-[0.1em] uppercase flex items-center gap-2 w-max">
          <CheckCircle2 size={12} /> Approved
        </div>
      );
    case "R":
    case "REJECTED":
      return (
        <div className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary rounded-lg text-[10px] font-bold tracking-[0.1em] uppercase flex items-center gap-2 w-max">
          <XCircle size={12} /> Rejected
        </div>
      );
    case "P":
    case "PENDING":
    default:
      return (
        <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-500 rounded-lg text-[10px] font-bold tracking-[0.1em] uppercase flex items-center gap-2 w-max">
          <Clock size={12} /> Pending
        </div>
      );
  }
};

const MyRequests = () => {
  const dispatch = useDispatch();
  const { visitRequestsByVis, isLoading, error } = useSelector(
    (state) => state.visitRequestsState,
  );

  // Extract Visitor ID from login session
  const user = useSelector((state) => state.login.user);
  const userEmail = user?.ResultSet?.[0]?.VA_Email;
  const [visitorId, setVisitorId] = useState(null);

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
        console.log("All Visitors:", visitors);
        console.log("Logged user email:", userEmail);

        const match = visitors.find(
          (v) =>
            v?.VV_Email?.trim().toLowerCase() ===
            userEmail?.trim().toLowerCase(),
        );

        if (match) {
          console.log("Matched Visitor:", match);
          setVisitorId(match.VV_Visitor_id);
        } else {
          console.error("No visitor found for:", userEmail);
          setVisitorId(null);
        }
      } catch (err) {
        console.error("Error loading visitor:", err);
        setVisitorId(null);
      }
    };

    if (userEmail) {
      loadVisitorId();
    }
  }, [userEmail]);

  useEffect(() => {
    if (visitorId) {
      dispatch(GetVisitRequestsByVisitor(visitorId));
    }
  }, [dispatch, visitorId]);

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
    <div className="min-h-screen bg-[var(--color-bg-default)] text-white p-6 md:p-12 font-sans relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-[1400px] mx-auto relative z-10">
        <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <span className="text-primary font-black uppercase tracking-[0.4em] text-xs">
              Security Clearance
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-white mt-2 uppercase tracking-tighter">
              My Visit <span className="text-primary italic">Requests</span>
            </h1>
          </div>

          <div className="flex items-center bg-black/40 border border-white/10 rounded-2xl px-5 py-4 w-full md:w-[400px]">
            <Search size={18} className="text-gray-400 mr-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search IDs or Purpose..."
              className="bg-transparent border-none outline-none text-white text-sm tracking-widest uppercase w-full placeholder:text-gray-600"
            />
          </div>
        </header>

        <div className="bg-black/20 border border-white/5 rounded-[40px] overflow-hidden backdrop-blur-xl shadow-2xl">
          {isLoading ? (
            <div className="p-24 flex flex-col items-center justify-center">
              <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              <p className="mt-6 text-gray-400 font-bold uppercase tracking-[0.4em] text-xs">
                Accessing System Registry...
              </p>
            </div>
          ) : error ? (
            <div className="p-24 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary border border-primary/20">
                <AlertCircle size={32} />
              </div>
              <p className="text-primary font-bold uppercase tracking-[0.2em]">
                {error}
              </p>
            </div>
          ) : (
            <TableContainer
              component={Paper}
              className="bg-transparent shadow-none border-none"
            >
              <Table sx={{ minWidth: 650 }}>
                <TableHead className="bg-white/[0.02]">
                  <TableRow>
                    <TableCell className="text-gray-500 font-black uppercase tracking-widest text-[10px] border-b-white/5 py-8 px-10">
                      Protocol ID
                    </TableCell>
                    <TableCell className="text-gray-500 font-black uppercase tracking-widest text-[10px] border-b-white/5 py-8 px-10">
                      Date
                    </TableCell>
                    <TableCell className="text-gray-500 font-black uppercase tracking-widest text-[10px] border-b-white/5 py-8 px-10">
                      Destination
                    </TableCell>
                    <TableCell className="text-gray-500 font-black uppercase tracking-widest text-[10px] border-b-white/5 py-8 px-10">
                      Purpose
                    </TableCell>
                    <TableCell className="text-gray-500 font-black uppercase tracking-widest text-[10px] border-b-white/5 py-8 px-10">
                      Status
                    </TableCell>
                    <TableCell
                      className="text-gray-500 font-black uppercase tracking-widest text-[10px] border-b-white/5 py-8 px-10"
                      align="right"
                    >
                      Controls
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredRequests.length > 0 ? (
                    filteredRequests.map((req) => (
                      <TableRow
                        key={req.VVR_Request_id}
                        hover
                        className="hover:bg-white/[0.02] transition-all"
                      >
                        <TableCell className="px-10 py-8 border-b-white/5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                              <Hash size={14} />
                            </div>
                            <span className="text-white font-mono tracking-tighter text-lg">
                              #{req.VVR_Request_id}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="px-10 py-8 border-b-white/5">
                          <div className="flex items-center gap-3 text-gray-300">
                            <Calendar size={14} className="text-primary/50" />
                            <span className="text-[13px] font-bold tracking-widest uppercase">
                              {req.VVR_Visit_Date
                                ? req.VVR_Visit_Date.split("T")[0]
                                : "N/A"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="px-10 py-8 border-b-white/5">
                          <div className="flex items-center gap-3 text-gray-300">
                            <MapPin size={14} className="text-primary/50" />
                            <span className="text-[13px] font-bold tracking-widest uppercase">
                              {req.VVR_Places_to_Visit || "-"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="px-10 py-8 border-b-white/5">
                          <p className="text-white font-medium tracking-wide text-sm opacity-80 line-clamp-1">
                            {req.VVR_Purpose || "-"}
                          </p>
                        </TableCell>
                        <TableCell className="px-10 py-8 border-b-white/5">
                          <StatusBadge status={req.VVR_Status} />
                        </TableCell>
                        <TableCell
                          className="px-10 py-8 border-b-white/5"
                          align="right"
                        >
                          <button
                            onClick={() => openEditModal(req)}
                            className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-primary/10 hover:border-primary/30 transition-all text-primary"
                            title="Edit Request"
                          >
                            <Edit size={18} />
                          </button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        align="center"
                        className="py-24 border-none text-gray-600 font-bold uppercase tracking-[0.3em] text-xs"
                      >
                        No active visitation requests detected
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </div>
      </div>

      {/* Edit Modal (Visitor side) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-md animate-fade-in">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-[#0A0A0A] border border-white/10 rounded-[40px] shadow-2xl w-full max-w-xl overflow-hidden relative"
          >
            <div className="p-10 border-b border-white/5 bg-white/[0.01] flex justify-between items-center">
              <div>
                <span className="text-primary font-black uppercase tracking-[0.4em] text-[10px]">
                  Correction Protocol
                </span>
                <h2 className="text-2xl font-black text-white mt-1 uppercase tracking-tight">
                  Review & Edit{" "}
                  <span className="text-primary italic">Request</span>
                </h2>
              </div>
              <button
                onClick={closeModal}
                className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-8">
              <div className="grid grid-cols-1 gap-8">
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] ml-1">
                    Visit Date
                  </label>
                  <div className="relative group">
                    <Calendar
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40 group-focus-within:text-primary transition-colors"
                      size={18}
                    />
                    <input
                      required
                      type="date"
                      name="VVR_Visit_Date"
                      value={formData.VVR_Visit_Date}
                      onChange={handleInputChange}
                      className="w-full bg-black/40 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-white text-sm font-bold uppercase tracking-widest focus:outline-none focus:border-primary/50 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] ml-1">
                    Visiting Areas
                  </label>
                  <div className="relative group">
                    <MapPin
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40 group-focus-within:text-primary transition-colors"
                      size={18}
                    />
                    <input
                      required
                      type="text"
                      name="VVR_Places_to_Visit"
                      value={formData.VVR_Places_to_Visit}
                      onChange={handleInputChange}
                      className="w-full bg-black/40 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-white text-sm font-bold uppercase tracking-widest focus:outline-none focus:border-primary/50 transition-all placeholder:text-gray-700"
                      placeholder="E.G. MAIN PRODUCTION FLOOR"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] ml-1">
                    Updated Purpose
                  </label>
                  <div className="relative group">
                    <ClipboardList
                      className="absolute left-4 top-5 text-primary/40 group-focus-within:text-primary transition-colors"
                      size={18}
                    />
                    <textarea
                      required
                      name="VVR_Purpose"
                      value={formData.VVR_Purpose}
                      onChange={handleInputChange}
                      rows="4"
                      className="w-full bg-black/40 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-white text-sm font-bold tracking-wide focus:outline-none focus:border-primary/50 transition-all resize-none placeholder:text-gray-700"
                      placeholder="Clarify the purpose of your visit..."
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-5 bg-white/5 border border-white/10 rounded-2xl text-gray-400 font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
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
