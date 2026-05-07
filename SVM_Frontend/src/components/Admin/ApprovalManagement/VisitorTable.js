import React, { useEffect, useMemo, useState } from "react";
import {
  Check,
  X,
  Eye,
  ChevronUp,
  ChevronDown,
  Calendar,
  MapPin,
  Shield,
  QrCode,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const StatusBadge = ({ status }) => {
  const variants = {
    "Admin Approved": "svm-status-pill--success",
    "Accepted by Admin": "svm-status-pill--success",
    "Accepted by Visitor": "svm-status-pill--warning",
    "Sent to Visitor": "svm-status-pill--info",
    "Accepted by Contact Person": "svm-status-pill--orange",
    "Sent to Admin": "svm-status-pill--orange",
    Accepted: "svm-status-pill--purple",
    Rejected: "svm-status-pill--danger",
    "Checked In": "svm-status-pill--info",
    "Checked Out": "svm-status-pill--muted",
    Pending: "svm-status-pill--muted",
  };

  return (
    <div
      className={`svm-status-pill w-[200px] mx-auto ${variants[status] || variants.Pending}`}
    >
      {status}
    </div>
  );
};

const VisitorTable = ({
  visitors,
  onViewDetails,
  onAction,
  gatePasses = [],
}) => {
  const desktopTableViewportStyle = {
    height: "calc(100vh - 8rem)",
    minHeight: "600px",
  };

  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [expandedBatches, setExpandedBatches] = useState([]);
  const [sortOrder, setSortOrder] = useState("desc");

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

  const toggleBatch = (batchId) => {
    setExpandedBatches((prev) =>
      prev.includes(batchId)
        ? prev.filter((id) => id !== batchId)
        : [...prev, batchId],
    );
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredVisitors = useMemo(() => {
    return (visitors || [])
      .filter(
        (visitor) => statusFilter === "All" || visitor.status === statusFilter,
      )
      .sort((a, b) => {
        const idA = parseInt(a.id, 10) || 0;
        const idB = parseInt(b.id, 10) || 0;
        return sortOrder === "desc" ? idB - idA : idA - idB; // newest request first
      });
  }, [visitors, statusFilter, sortOrder]);

  if (loading) {
    return (
      <div className="bg-[var(--color-bg-paper)] border border-white/5 p-6 md:p-12 rounded-[40px] animate-pulse shadow-2xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-8">
          <div className="h-10 w-64 bg-white/[0.03] rounded-2xl" />
          <div className="flex flex-col md:flex-row gap-4 md:gap-4 w-full md:w-auto">
            <div className="h-12 w-full sm:w-48 bg-white/[0.03] rounded-2xl" />
            <div className="h-12 w-full sm:w-32 bg-white/[0.03] rounded-2xl" />
          </div>
        </div>
        <div className="space-y-6">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-24 bg-white/[0.02] w-full rounded-[24px]"
            />
          ))}
        </div>
      </div>
    );
  }

  const statusOptions = [
    { id: "All", label: "All forms" },
    { id: "Sent to Visitor", label: "Sent to visitor" },
    { id: "Accepted by Contact Person", label: "Contact person accepted" },
    { id: "Accepted by Visitor", label: "Accepted by visitor" },
    { id: "Admin Approved", label: "Admin approved" },
    { id: "Rejected", label: "Rejected" },
  ];

  return (
    <div className="space-y-2 sm:space-y-3 md:space-y-4 animate-fade-in-slow">
      <div className="bg-[var(--color-bg-paper)] border border-white/5 rounded-lg sm:rounded-2xl md:rounded-[32px] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

        <div className="px-3 sm:px-4 md:px-5 py-2 border-b border-white/5 bg-transparent flex flex-col xl:flex-row justify-between items-start xl:items-center gap-2 sm:gap-3 md:gap-4 relative z-10">
          <div className="flex flex-wrap gap-2 md:gap-4 w-full md:w-auto relative max-w-full overflow-x-auto no-scrollbar">
            {statusOptions.map((btn) => (
              <button
                key={btn.id}
                onClick={() => setStatusFilter(btn.id)}
                className={`relative w-full md:w-auto md:flex-none px-2 sm:px-3 md:px-4 py-1.5 rounded-md text-[11px] font-medium tracking-wide transition-all duration-500 z-10 whitespace-nowrap min-w-0 ${statusFilter === btn.id ? "!text-white" : "text-[var(--color-text-dim)] hover:text-[var(--color-text-primary)]"}`}
              >
                {statusFilter === btn.id && (
                  <motion.div
                    layoutId="activeFilter"
                    className="absolute inset-0 bg-primary rounded-lg shadow-[0_0_20px_rgba(200,16,46,0.2)]"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{btn.label}</span>
              </button>
            ))}
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-black/20 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/80">
            <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_var(--color-primary)]" />
            {filteredVisitors.length} records
          </div>
        </div>
      </div>

      <div className="bg-[var(--color-bg-paper)] border border-white/5 rounded-lg sm:rounded-2xl md:rounded-[32px] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

        <div className="bg-transparent">
          <div
            className="hidden md:block overflow-auto no-scrollbar"
            style={desktopTableViewportStyle}
          >
            <table className="w-full min-w-[920px] text-left border-collapse">
              <thead className="sticky top-0 z-20 bg-[var(--color-bg-paper)] font-normal text-[12px]">
                <tr className="border-b border-white/5 bg-[var(--color-bg-paper)]">
                  <th className="px-3 md:px-2.5 lg:px-6 py-2 text-[12px] font-normal tracking-[0.3em] uppercase text-[var(--color-text-secondary)] text-left">
                    VISITOR NAME
                  </th>
                  <th className="px-3 md:px-2.5 lg:px-6 py-2 text-[12px] font-normal tracking-[0.3em] uppercase text-[var(--color-text-secondary)] text-center min-w-[180px]">
                    VISIT DATE
                  </th>
                  <th className="px-3 md:px-2.5 lg:px-6 py-2 text-[12px] font-normal tracking-[0.3em] uppercase text-[var(--color-text-secondary)] text-left min-w-[300px]">
                    VISITING PLACE
                  </th>
                  <th className="px-3 md:px-2.5 lg:px-6 py-2 text-[12px] font-normal tracking-[0.3em] uppercase text-[var(--color-text-secondary)] text-center w-[220px]">
                    STATUS
                  </th>
                  <th className="px-3 md:px-2.5 lg:px-6 py-2 text-[12px] font-normal tracking-[0.3em] uppercase text-[var(--color-text-secondary)] text-center w-28">
                    GATE PASS
                  </th>
                  <th className="px-3 md:px-2.5 lg:px-6 py-2 text-[12px] font-normal tracking-[0.3em] uppercase text-primary text-right md:pr-4 lg:pr-6 w-32">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filteredVisitors.map((visitor, index) => {
                  const memberList = visitor.members || [];
                  const isExpanded = expandedBatches.includes(visitor.batchId);

                  return (
                    <React.Fragment
                      key={visitor.batchId || visitor.id || index}
                    >
                      <tr className={`group transition-colors duration-200 ${isExpanded ? "bg-primary/[0.03]" : "hover:bg-white/[0.02]"}`}>
                        <td className="px-3 md:px-2.5 lg:px-6 py-1 align-middle font-normal text-[12px]">
                          <div className="flex items-center gap-2">
                            {memberList.length > 0 && (
                              <button
                                onClick={() => toggleBatch(visitor.batchId)}
                                className={`w-5 h-5 rounded flex items-center justify-center transition-all duration-300 ${isExpanded ? "bg-primary text-white" : "bg-white/5 text-gray-400 hover:text-white hover:bg-primary/20"}`}
                              >
                                <ChevronDown size={10} className={`transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
                              </button>
                            )}
                            <p className="text-white capitalize text-[12px] font-normal tracking-wide mb-0">
                              {visitor.name}
                            </p>
                          </div>
                        </td>
                        <td className="px-3 md:px-2.5 lg:px-6 py-1 text-center align-middle font-normal text-[12px]">
                          <span className="text-white/90 text-[12px] font-normal tracking-wide">
                            {visitor.date?.split(" ")[0]}
                          </span>
                        </td>
                        <td className="px-3 md:px-2.5 lg:px-6 py-1 align-middle font-normal text-[12px]">
                          <div className="flex items-center gap-1.5 text-white/60 text-[12px] font-normal tracking-wide max-w-[350px]">
                            <MapPin size={11} className="text-primary/50 shrink-0" />
                            <span className="truncate">
                              {Array.isArray(visitor.areas)
                                ? visitor.areas.join(" | ")
                                : visitor.areas}
                            </span>
                          </div>
                        </td>
                        <td className="px-3 md:px-2.5 lg:px-6 py-1 text-center align-middle font-normal text-[12px]">
                          <StatusBadge status={visitor.status} />
                        </td>
                        <td className="px-3 md:px-2.5 lg:px-6 py-1 text-center align-middle font-normal text-[12px]">
                          {hasGatePass(visitor.id) && (
                              <button
                                onClick={() =>
                                  onAction(visitor, "ViewGatePass")
                                }
                                className="w-8 h-8 rounded-lg flex items-center justify-center bg-green-500/5 border border-green-500/10 text-green-500 hover:bg-green-500 hover:text-white transition-all group/gp mx-auto shadow-sm"
                                title="View Gate Pass"
                              >
                                <QrCode
                                  size={13}
                                  className="group-hover/gp:scale-110 transition-transform"
                                />
                              </button>
                            )}
                        </td>
                        <td className="px-3 md:px-2.5 lg:px-6 py-1 text-right md:pr-4 lg:pr-6 align-middle font-normal text-[12px]">
                          <div className="flex justify-end gap-1.5">
                            {(visitor.status === "Pending" ||
                              visitor.status === "Sent to Admin" ||
                              visitor.status === "Accepted by Visitor" ||
                              visitor.status ===
                              "Accepted by Contact Person") && (
                                <>
                                  <button
                                    onClick={() => onAction(visitor, "Approve")}
                                    title="APPROVE"
                                    className="w-7 h-7 rounded-md flex items-center justify-center bg-green-500/5 border border-green-500/10 text-green-500 hover:bg-green-500 hover:text-white transition-all duration-300 group/btn"
                                  >
                                    <Check
                                      size={13}
                                      strokeWidth={3}
                                    />
                                  </button>
                                  <button
                                    onClick={() => onAction(visitor, "Reject")}
                                    title="REJECT"
                                    className="w-7 h-7 rounded-md flex items-center justify-center bg-primary/5 border border-primary/10 text-primary hover:bg-primary hover:text-white transition-all duration-300 group/btn"
                                  >
                                    <X
                                      size={13}
                                      strokeWidth={3}
                                    />
                                  </button>
                                </>
                              )}
                            <button
                              onClick={() => onViewDetails(visitor)}
                              title="VIEW DETAILS"
                              className="w-7 h-7 rounded-md flex items-center justify-center bg-white/[0.03] border border-white/5 text-gray-400 hover:text-white hover:border-white/20 transition-all duration-300"
                            >
                              <Eye size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>

                      <AnimatePresence>
                        {isExpanded && memberList.length > 0 && (
                          <motion.tr
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-[var(--color-bg-default)] border-b border-primary/10"
                          >
                            <td
                              colSpan="6"
                              className="px-0 py-0 overflow-hidden font-normal text-[12px]"
                            >
                              <div className="p-4 md:p-6 pl-24 space-y-4 bg-gradient-to-br from-[var(--color-bg-default)] to-[#0E0E10] shadow-inner relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

                                <div className="flex flex-col md:flex-row items-center gap-3 md:gap-3 mb-6">
                                  <div className="w-1 h-3 bg-primary rounded-full shadow-[0_0_8px_var(--color-primary)]" />
                                  <p className="text-primary text-[12px] font-normal capitalize tracking-[0.3em]">
                                    Personnel Unit Breakdown
                                    <span className="text-gray-300/80 ml-2">
                                      // Institutional Registry
                                    </span>
                                  </p>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 relative z-10">
                                  {memberList.map((member, idx) => (
                                    <motion.div
                                      key={idx}
                                      initial={{ opacity: 0, x: -20 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: idx * 0.1 }}
                                      className="flex items-center justify-between p-4 bg-[var(--color-bg-paper)] border border-white/5 hover:border-primary/30 transition-all duration-500 rounded-[20px] group/member shadow-lg"
                                    >
                                      <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4">
                                        <div className="w-9 h-9 rounded-lg bg-[var(--color-bg-default)] border border-white/5 flex items-center justify-center text-gray-300 text-[12px] font-normal group-hover/member:border-primary transition-all">
                                          {(idx + 2)
                                            .toString()
                                            .padStart(2, "0")}
                                        </div>
                                        <div className="flex flex-col gap-0.5">
                                          <span className="text-white text-[12px] font-normal capitalize tracking-widest group-hover/member:text-primary transition-colors">
                                            {member.name}
                                          </span>
                                          <span className="text-gray-300/80 text-[11px] font-normal capitalize tracking-[0.2em] flex flex-col md:flex-row items-center gap-3 md:gap-1.5">
                                            <Shield
                                              size={9}
                                              className="text-primary/40"
                                            />
                                            {member.nic}
                                          </span>
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <span className="text-[12px] text-gray-300/80 font-normal capitalize tracking-[0.3em] block mb-0.5">
                                          Contact
                                        </span>
                                        <span className="px-3 py-1.5 bg-black/40 border border-white/5 text-white/90 text-[12px] font-normal tracking-widest rounded-lg shadow-inner group-hover/member:border-primary/20 transition-all">
                                          {member.contact}
                                        </span>
                                      </div>
                                    </motion.div>
                                  ))}
                                </div>
                              </div>
                            </td>
                          </motion.tr>
                        )}
                      </AnimatePresence>
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="md:hidden flex flex-col p-2 gap-2">
            {filteredVisitors.map((visitor, index) => {
              const memberList = visitor.members || [];
              const isExpanded = expandedBatches.includes(visitor.batchId);

              return (
                <div
                  key={visitor.id || index}
                  className="bg-[var(--color-bg-paper)] border border-white/5 rounded-xl overflow-hidden shadow-lg relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="p-3 border-b border-white/5 flex justify-between items-start bg-black/10 relative z-10">
                    <div>
                      <p className="text-white capitalize text-[12px] font-semibold tracking-wide mb-0.5 leading-tight">
                        {visitor.name}
                      </p>
                      <p className="text-gray-400 text-[10px] font-medium tracking-widest uppercase">
                        {visitor.batchId || `ID: ${visitor.id}`}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <StatusBadge status={visitor.status} />
                      {hasGatePass(visitor.id) && (
                        <button
                          onClick={() => onAction(visitor, "ViewGatePass")}
                          className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-[0.1em] text-primary/80 hover:text-primary transition-colors"
                        >
                          <QrCode size={10} />
                          Gate Pass
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="p-3 space-y-2 relative z-10">
                    <div className="flex justify-between items-center text-[12px] font-medium tracking-wide border-b border-white/[0.03] pb-1.5">
                      <span className="text-gray-400 flex items-center gap-1.5">
                        <Calendar size={12} className="text-primary/60" />
                        Date
                      </span>
                      <span className="text-white/90">
                        {visitor.date?.split(" ")[0]}
                      </span>
                    </div>
                    <div className="flex justify-between items-start text-[12px] font-medium tracking-wide border-b border-white/[0.03] pb-1.5">
                      <span className="text-gray-400 flex items-center gap-1.5 shrink-0">
                        <MapPin size={12} className="text-primary/60" />
                        Zones
                      </span>
                      <span className="text-white/70 text-right truncate max-w-[150px]">
                        {Array.isArray(visitor.areas)
                          ? visitor.areas.join(" | ")
                          : visitor.areas}
                      </span>
                    </div>
                  </div>

                  <div className="p-2 bg-black/30 flex gap-2 relative z-10">
                    {(visitor.status === "Pending" ||
                      visitor.status === "Sent to Admin" ||
                      visitor.status === "Accepted by Visitor" ||
                      visitor.status === "Accepted by Contact Person") && (
                        <>
                          <button
                            onClick={() => onAction(visitor, "Approve")}
                            className="flex-1 h-8 flex justify-center items-center gap-1.5 bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] font-bold uppercase tracking-wider rounded-lg hover:bg-green-500 hover:text-white transition-all"
                          >
                            <Check size={11} strokeWidth={3} />
                            Approve
                          </button>
                          <button
                            onClick={() => onAction(visitor, "Reject")}
                            className="flex-1 h-8 flex justify-center items-center gap-1.5 bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider rounded-lg hover:bg-primary hover:text-white transition-all"
                          >
                            <X size={11} strokeWidth={3} />
                            Reject
                          </button>
                        </>
                      )}
                    <button
                      onClick={() => onViewDetails(visitor)}
                      className="flex-1 h-8 flex justify-center items-center gap-1.5 bg-white/[0.03] border border-white/5 text-gray-300 text-[10px] font-bold uppercase tracking-wider rounded-lg hover:bg-white hover:text-black transition-all"
                    >
                      <Eye size={11} />
                      Inspect
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredVisitors.length === 0 && (
              <div className="p-4 sm:p-8 md:p-10 text-center bg-white/[0.01] border border-white/5 rounded-lg md:rounded-[32px] shadow-lg">
                <div className="w-12 sm:w-14 h-12 sm:h-14 bg-[var(--color-bg-paper)] rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 border border-white/5">
                  <Shield
                    size={18}
                    className="sm:w-[20px] sm:h-[20px] text-primary opacity-70"
                  />
                </div>
                <p className="text-gray-300 text-[11px] sm:text-[12px] font-medium capitalize tracking-[0.2em] sm:tracking-[0.3em] opacity-80">
                  No matching records found
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitorTable;
