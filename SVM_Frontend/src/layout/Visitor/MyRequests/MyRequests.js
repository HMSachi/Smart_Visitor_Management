import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { GetVisitRequestsByVisitor } from "../../../actions/VisitRequestAction";
import { GetAllGatePasses } from "../../../actions/GatePassAction";
import VisitorService from "../../../services/VisitorService";
import {
  ClipboardList,
  Calendar,
  MapPin,
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

const canReviewRequest = (status) => {
  return true;
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

  const handleOpenReviewPage = (request) => {
    navigate(`/visitor/request-details/${request.VVR_Request_id}`, {
      state: {
        request,
        visitorName,
      },
    });
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
            <>
              <div className="hidden lg:block bg-black/20 border border-white/5 rounded-[20px] overflow-hidden backdrop-blur-xl shadow-2xl mb-4">
                <TableContainer
                  component={Paper}
                  className="bg-transparent shadow-none border-none"
                >
                  <Table size="small" sx={{ minWidth: 560 }}>
                    <TableHead className="bg-white/[0.02]">
                      <TableRow>
                        <TableCell className="text-gray-400 font-semibold uppercase tracking-[0.1em] text-[10px] border-b-white/5 py-3 px-4">
                          Protocol ID
                        </TableCell>
                        <TableCell className="text-gray-400 font-semibold uppercase tracking-[0.1em] text-[10px] border-b-white/5 py-3 px-4">
                          Date
                        </TableCell>
                        <TableCell className="text-gray-400 font-semibold uppercase tracking-[0.1em] text-[10px] border-b-white/5 py-3 px-4">
                          Destination
                        </TableCell>
                        <TableCell className="text-gray-400 font-semibold uppercase tracking-[0.1em] text-[10px] border-b-white/5 py-3 px-4">
                          Purpose
                        </TableCell>
                        <TableCell className="text-gray-400 font-semibold uppercase tracking-[0.1em] text-[10px] border-b-white/5 py-3 px-4">
                          Status
                        </TableCell>
                        <TableCell
                          className="text-gray-400 font-semibold uppercase tracking-[0.1em] text-[10px] border-b-white/5 py-3 px-4"
                          align="right"
                        >
                          Controls
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredRequests.map((req) => (
                        <TableRow
                          key={req.VVR_Request_id}
                          hover
                          className="hover:bg-white/[0.02] transition-all"
                        >
                          <TableCell className="px-4 py-3 border-b-white/5">
                            <div className="flex items-center gap-2.5">
                              <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                                <Hash size={11} />
                              </div>
                              <span className="text-white font-mono tracking-normal text-[13px]">
                                #{req.VVR_Request_id}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="px-4 py-3 border-b-white/5">
                            <div className="flex items-center gap-2 text-gray-300">
                              <Calendar size={11} className="text-primary/50" />
                              <span className="text-[12px] font-medium tracking-normal">
                                {req.VVR_Visit_Date
                                  ? req.VVR_Visit_Date.split("T")[0]
                                  : "N/A"}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="px-4 py-3 border-b-white/5">
                            <div className="flex items-center gap-2 text-gray-300">
                              <MapPin size={11} className="text-primary/50" />
                              <span className="text-[12px] font-medium tracking-normal">
                                {req.VVR_Places_to_Visit || "-"}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="px-4 py-3 border-b-white/5">
                            <p className="text-white font-medium tracking-wide text-[12px] opacity-80 line-clamp-1">
                              {req.VVR_Purpose || "-"}
                            </p>
                          </TableCell>
                          <TableCell className="px-4 py-3 border-b-white/5">
                            <div className="flex flex-col gap-1.5">
                              <StatusBadge status={req.VVR_Status} />
                              {hasGatePass(req.VVR_Request_id) &&
                                (req.VVR_Status === "A" ||
                                  req.VVR_Status === "APPROVED") && (
                                  <button
                                    onClick={() => handleViewGatePass(req)}
                                    className="flex items-center gap-1.5 text-[9px] justify-center font-black uppercase tracking-[0.12em] text-primary hover:text-white transition-all group/gp"
                                  >
                                    <QrCode
                                      size={10}
                                      className="group-hover/gp:scale-110 transition-transform"
                                    />
                                    View GatePass
                                  </button>
                                )}
                            </div>
                          </TableCell>
                          <TableCell
                            className="px-4 py-3 border-b-white/5"
                            align="right"
                          >
                            {canReviewRequest(req.VVR_Status) && (
                              <button
                                onClick={() => handleOpenReviewPage(req)}
                                className="px-3 py-1.5 border border-primary/30 bg-primary/10 text-primary rounded-lg text-[10px] font-bold uppercase tracking-[0.12em] hover:bg-primary hover:text-white transition-all"
                                title="Review Submitted Details"
                              >
                                Review
                              </button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:hidden gap-4 auto-rows-max">
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

                      <div className="pt-2 flex gap-2">
                        {canReviewRequest(req.VVR_Status) && (
                          <button
                            onClick={() => handleOpenReviewPage(req)}
                            className="flex-1 px-3 py-2 border border-primary/30 bg-primary/10 text-primary rounded-xl text-[10px] font-bold uppercase tracking-[0.12em] hover:bg-primary hover:text-white transition-all"
                            title="Review Submitted Details"
                          >
                            Review
                          </button>
                        )}
                        {hasGatePass(req.VVR_Request_id) &&
                          (req.VVR_Status === "A" ||
                            req.VVR_Status === "APPROVED") && (
                            <button
                              onClick={() => handleViewGatePass(req)}
                              className="flex-1 flex items-center justify-center gap-2 py-2 bg-primary/10 border border-primary/30 rounded-xl text-primary hover:bg-primary/20 hover:border-primary/50 transition-all font-bold uppercase tracking-[0.1em] text-[10px] group/btn"
                            >
                              <QrCode
                                size={13}
                                className="group-hover/btn:scale-110 transition-transform"
                              />
                              Gate Pass
                            </button>
                          )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
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

    </div>
  );
};

export default MyRequests;
