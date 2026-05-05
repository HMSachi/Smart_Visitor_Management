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
  const styles = {
    "Admin Approved": "border-green-500/20 text-green-500 bg-green-500/5",
    "Accepted by Admin": "border-green-500/20 text-green-500 bg-green-500/5",
    "Accepted by Visitor":
      "border-yellow-500/20 text-yellow-500 bg-yellow-500/5",
    "Sent to Visitor": "border-blue-500/20 text-blue-500 bg-blue-500/5",
    "Accepted by Contact Person":
      "border-orange-500/20 text-orange-500 bg-orange-500/5",
    "Sent to Admin": "border-orange-500/20 text-orange-500 bg-orange-500/5",
    Accepted: "border-purple-500/20 text-purple-500 bg-purple-500/5",
    Rejected: "border-white/10 text-gray-300 bg-white/5",
    "Checked In": "border-blue-500/20 text-blue-500 bg-blue-500/5",
    "Checked Out": "border-white/5 text-gray-300/80 bg-transparent",
    Pending: "border-white/10 text-gray-300 bg-white/5",
  };

  return (
    <div
      className={`px-2 sm:px-3 py-1 rounded-full text-[8px] sm:text-[9px] md:text-[10px] font-medium tracking-[0.08em] sm:tracking-[0.1em] md:tracking-[0.15em] uppercase border flex items-center gap-1 md:gap-1.5 w-fit mx-auto ${styles[status] || styles.Pending}`}
    >
      <span
        className={`w-1 md:w-1.5 h-1 md:h-1.5 rounded-full ${status === "Admin Approved" || status === "Accepted by Admin" || status === "Checked In" ? "bg-green-500 shadow-[0_0_5px_#22c55e]" : status === "Accepted" ? "bg-purple-500 shadow-[0_0_5px_#a855f7]" : status === "Sent to Admin" ? "bg-orange-500 shadow-[0_0_5px_#f97316] animate-pulse" : status === "Pending" ? "bg-primary shadow-[0_0_5px_var(--color-primary)] animate-pulse" : "bg-mas-text-dim opacity-80"}`}
      />
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
    height: "calc(100vh - 16rem)",
    minHeight: "400px",
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
              <thead className="sticky top-0 z-20 bg-[var(--color-bg-paper)]">
                <tr className="border-b border-white/5 bg-[var(--color-bg-paper)]">
                  <th className="px-3 md:px-4 lg:px-6 py-2 md:py-3 text-[8px] md:text-[9px] lg:text-[10px] font-bold tracking-[0.2em] md:tracking-[0.3em] uppercase text-[var(--color-text-secondary)] text-center w-16 md:w-20 opacity-60">
                    NO.
                  </th>
                  <th className="px-3 md:px-4 lg:px-6 py-2 md:py-3 text-[8px] md:text-[9px] lg:text-[10px] font-bold tracking-[0.2em] md:tracking-[0.3em] uppercase text-[var(--color-text-secondary)] opacity-60">
                    VISITOR NAME
                  </th>
                  <th
                    className="px-3 md:px-4 lg:px-6 py-2 md:py-3 text-[9px] md:text-[10px] lg:text-[12px] font-medium tracking-[0.2em] md:tracking-[0.3em] capitalize text-white/70 cursor-pointer hover:text-primary transition-colors group"
                    onClick={() =>
                      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
                    }
                  >
                    <div className="flex flex-col md:flex-row items-center gap-2 md:gap-2">
                      VISIT DATE & TIME
                      <div
                        className={`transition-transform duration-300 ${sortOrder === "asc" ? "rotate-180" : ""}`}
                      >
                        <ChevronDown
                          size={12}
                          className={
                            sortOrder
                              ? "text-primary"
                              : "text-[var(--color-text-dim)]"
                          }
                        />
                      </div>
                    </div>
                  </th>
                  <th className="px-3 md:px-4 lg:px-6 py-2 md:py-3 text-[8px] md:text-[9px] lg:text-[10px] font-bold tracking-[0.2em] md:tracking-[0.3em] uppercase text-[var(--color-text-secondary)] text-center">
                    STATUS
                  </th>
                  <th className="px-3 md:px-4 lg:px-6 py-2 md:py-3 text-[8px] md:text-[9px] lg:text-[11px] font-bold tracking-[0.2em] md:tracking-[0.3em] uppercase text-primary text-right md:pr-4 lg:pr-6">
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
                      <tr
                        className={`group transition-colors duration-300 ${isExpanded ? "bg-primary/[0.03]" : "hover:bg-white/[0.02]"}`}
                      >
                        <td className="px-3 md:px-4 lg:px-6 py-2 md:py-4 text-center align-middle">
                          {memberList.length > 0 ? (
                            <button
                              onClick={() => toggleBatch(visitor.batchId)}
                              className={`w-8 h-8 md:w-9 md:h-9 rounded-lg border flex items-center justify-center transition-all duration-500 shadow-lg ${isExpanded ? "bg-primary text-white border-primary rotate-180" : "bg-[var(--color-bg-default)] border-white/5 text-gray-300 hover:text-white hover:border-primary/50"}`}
                            >
                              {isExpanded ? (
                                <ChevronUp
                                  size={12}
                                  className="md:w-[14px] md:h-[14px]"
                                />
                              ) : (
                                <div className="text-[11px] md:text-[12px] font-medium">
                                  {index + 1}
                                </div>
                              )}
                            </button>
                          ) : (
                            <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg border flex items-center justify-center transition-all duration-500 shadow-lg bg-[var(--color-bg-default)] border-white/5 text-gray-300 mx-auto">
                              <div className="text-[11px] md:text-[12px] font-medium">
                                {index + 1}
                              </div>
                            </div>
                          )}
                        </td>
                        <td className="px-3 md:px-4 lg:px-6 py-2 md:py-4 align-middle">
                          <p className="text-white capitalize text-[11px] md:text-[12px] font-medium tracking-widest mb-0.5">
                            {visitor.name}
                          </p>
                        </td>
                        <td className="px-3 md:px-4 lg:px-6 py-2 md:py-4 align-middle">
                          <div className="flex flex-col gap-1">
                            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-2">
                              <Calendar size={10} className="text-primary/60" />
                              <span className="text-white capitalize text-[10px] md:text-[12px] font-medium tracking-widest">
                                {visitor.date}
                              </span>
                            </div>
                            <p className="text-white/70 capitalize text-[10px] md:text-[11px] font-medium tracking-widest truncate max-w-[180px] md:max-w-[200px] flex flex-col md:flex-row items-center gap-2 md:gap-2">
                              <MapPin size={9} className="text-primary/70" />
                              {Array.isArray(visitor.areas)
                                ? visitor.areas.join(" | ")
                                : visitor.areas}
                            </p>
                          </div>
                        </td>
                        <td className="px-3 md:px-4 lg:px-6 py-2 md:py-4 text-center align-middle">
                          <div className="flex flex-col items-center gap-1.5">
                            <StatusBadge status={visitor.status} />
                            {hasGatePass(visitor.id) &&
                              visitor.status === "Admin Approved" && (
                                <button
                                  onClick={() =>
                                    onAction(visitor, "ViewGatePass")
                                  }
                                  className="flex items-center justify-center gap-2 text-[10px] font-bold capitalize tracking-[0.2em] text-primary hover:text-white transition-colors group/gp"
                                >
                                  <QrCode
                                    size={11}
                                    className="group-hover/gp:scale-110 transition-transform"
                                  />
                                  View Gate Pass
                                </button>
                              )}
                          </div>
                        </td>
                        <td className="px-3 md:px-4 lg:px-6 py-2 md:py-4 text-right md:pr-4 lg:pr-6 align-middle">
                          <div className="flex justify-end gap-1 md:gap-2">
                            {(visitor.status === "Pending" ||
                              visitor.status === "Sent to Admin" ||
                              visitor.status === "Accepted by Visitor" ||
                              visitor.status ===
                                "Accepted by Contact Person") && (
                              <>
                                <button
                                  onClick={() => onAction(visitor, "Approve")}
                                  title="AUTHORIZE BATCH"
                                  className="w-9 h-9 rounded-lg flex items-center justify-center bg-green-500/5 border border-green-500/20 text-green-500 hover:bg-green-500 hover:text-white hover:border-green-500 transition-all duration-500 shadow-lg group/btn"
                                >
                                  <Check
                                    size={14}
                                    strokeWidth={3}
                                    className="group-hover/btn:scale-110 transition-transform"
                                  />
                                </button>
                                <button
                                  onClick={() => onAction(visitor, "Reject")}
                                  title="DENY BATCH"
                                  className="w-9 h-9 rounded-lg flex items-center justify-center bg-primary/5 border border-primary/20 text-primary hover:bg-primary hover:text-white hover:border-primary transition-all duration-500 shadow-lg group/btn"
                                >
                                  <X
                                    size={14}
                                    strokeWidth={3}
                                    className="group-hover/btn:scale-110 transition-transform"
                                  />
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => onViewDetails(visitor)}
                              title="INSPECT PROTOCOL"
                              className="w-9 h-9 rounded-lg flex items-center justify-center bg-white/[0.02] border border-white/5 text-gray-300 hover:text-white hover:bg-[var(--color-bg-paper)] hover:border-white/20 transition-all duration-500 shadow-lg group/btn"
                            >
                              <Eye
                                size={14}
                                className="group-hover/btn:rotate-12 transition-transform"
                              />
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
                              colSpan="5"
                              className="px-0 py-0 overflow-hidden"
                            >
                              <div className="p-4 md:p-6 pl-24 space-y-4 bg-gradient-to-br from-[var(--color-bg-default)] to-[#0E0E10] shadow-inner relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

                                <div className="flex flex-col md:flex-row items-center gap-3 md:gap-3 mb-6">
                                  <div className="w-1 h-3 bg-primary rounded-full shadow-[0_0_8px_var(--color-primary)]" />
                                  <p className="text-primary text-[12px] font-medium capitalize tracking-[0.3em]">
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
                                        <div className="w-9 h-9 rounded-lg bg-[var(--color-bg-default)] border border-white/5 flex items-center justify-center text-gray-300 text-[12px] font-medium group-hover/member:border-primary transition-all">
                                          {(idx + 2)
                                            .toString()
                                            .padStart(2, "0")}
                                        </div>
                                        <div className="flex flex-col gap-0.5">
                                          <span className="text-white text-[12px] font-medium capitalize tracking-widest group-hover/member:text-primary transition-colors">
                                            {member.name}
                                          </span>
                                          <span className="text-gray-300/80 text-[11px] font-medium capitalize tracking-[0.2em] flex flex-col md:flex-row items-center gap-3 md:gap-1.5">
                                            <Shield
                                              size={9}
                                              className="text-primary/40"
                                            />
                                            {member.nic}
                                          </span>
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <span className="text-[12px] text-gray-300/80 font-medium capitalize tracking-[0.3em] block mb-0.5">
                                          Contact
                                        </span>
                                        <span className="px-3 py-1.5 bg-black/40 border border-white/5 text-white/90 text-[12px] font-medium tracking-widest rounded-lg shadow-inner group-hover/member:border-primary/20 transition-all">
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

          <div className="md:hidden flex flex-col p-3 sm:p-4 gap-3 sm:gap-4">
            {filteredVisitors.map((visitor, index) => {
              const memberList = visitor.members || [];
              const isExpanded = expandedBatches.includes(visitor.batchId);

              return (
                <div className="bg-[var(--color-bg-paper)] border border-white/5 rounded-lg md:rounded-[32px] overflow-hidden shadow-2xl relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="p-3 sm:p-4 border-b border-white/5 flex justify-between items-start bg-black/20 relative z-10">
                    <div>
                      <p className="text-white capitalize text-[11px] sm:text-[12px] font-medium tracking-widest mb-0.5 leading-tight">
                        {visitor.name}
                      </p>
                      <p className="text-gray-300/80 capitalize text-[10px] sm:text-[11px] font-medium tracking-widest">
                        {visitor.batchId}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <StatusBadge status={visitor.status} />
                      {hasGatePass(visitor.id) &&
                        visitor.status === "Admin Approved" && (
                          <button
                            onClick={() => onAction(visitor, "ViewGatePass")}
                            className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-bold capitalize tracking-[0.15em] text-primary hover:text-white transition-colors group/gp"
                          >
                            <QrCode
                              size={10}
                              className="group-hover/gp:scale-110 transition-transform"
                            />
                            View Pass
                          </button>
                        )}
                    </div>
                  </div>

                  <div className="p-3 sm:p-4 space-y-3 sm:space-y-4 relative z-10">
                    <div className="flex justify-between items-center text-[11px] sm:text-[12px] font-medium capitalize tracking-[0.15em] sm:tracking-[0.2em] border-b border-white/[0.03] pb-2 sm:pb-3">
                      <span className="text-gray-300/80 flex items-center gap-2">
                        <Calendar size={10} className="text-primary/60" />
                        Deployed
                      </span>
                      <span className="text-white text-[10px] sm:text-[11px]">
                        {visitor.date}{" "}
                        <span className="text-primary mx-1">//</span>{" "}
                        {visitor.timeIn}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[11px] sm:text-[12px] font-medium capitalize tracking-[0.15em] sm:tracking-[0.2em] border-b border-white/[0.03] pb-2 sm:pb-3">
                      <span className="text-gray-300/80 flex items-center gap-2">
                        <MapPin size={10} className="text-primary/60" />
                        Zones
                      </span>
                      <span className="text-white text-right max-w-[120px] sm:max-w-[150px] truncate text-[10px] sm:text-[11px]">
                        {Array.isArray(visitor.areas)
                          ? visitor.areas.join(" | ")
                          : visitor.areas}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[11px] sm:text-[12px] font-medium capitalize tracking-[0.15em] sm:tracking-[0.2em]">
                      <span className="text-gray-300/80 flex items-center gap-2">
                        <Shield size={10} className="text-primary/60" />
                        Request
                      </span>
                      <span className="text-primary bg-primary/10 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-[11px]">
                        {index + 1}
                      </span>
                    </div>
                  </div>

                  {memberList.length > 0 && (
                    <div className="relative z-10">
                      <button
                        onClick={() => toggleBatch(visitor.batchId)}
                        className={`w-full py-2 sm:py-3 px-3 sm:px-4 flex justify-between items-center text-[11px] sm:text-[12px] font-medium capitalize tracking-[0.2em] sm:tracking-[0.3em] border-t transition-all ${isExpanded ? "bg-primary/5 border-primary/20 text-primary" : "bg-black/20 border-white/5 text-gray-300/80 hover:text-white"}`}
                      >
                        <span>Unit Breakdown</span>
                        {isExpanded ? (
                          <ChevronUp size={14} />
                        ) : (
                          <ChevronDown size={14} />
                        )}
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden bg-black/40 relative"
                          >
                            <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                              {memberList.map((member, idx) => (
                                <div
                                  key={idx}
                                  className="bg-[var(--color-bg-default)] border border-white/5 p-3 sm:p-4 rounded-lg flex justify-between items-center shadow-lg group/mem"
                                >
                                  <div>
                                    <span className="text-white text-[11px] sm:text-[12px] font-medium capitalize tracking-widest block mb-0.5 group-hover/mem:text-primary transition-colors">
                                      {idx + 2}. {member.name}
                                    </span>
                                    <span className="text-gray-300/30 text-[10px] sm:text-[11px] font-medium capitalize tracking-[0.15em] block">
                                      NIC_: {member.nic}
                                    </span>
                                  </div>
                                  <div className="text-right">
                                    <span className="text-[11px] sm:text-[12px] text-gray-300/80 font-medium capitalize tracking-widest block mb-0.5">
                                      Contact
                                    </span>
                                    <span className="text-white/90 text-[10px] sm:text-[11px] font-medium">
                                      {member.contact}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  <div className="p-4 border-t border-white/5 bg-black/40 flex flex-col md:flex-row gap-3 md:gap-3 relative z-10">
                    {(visitor.status === "Pending" ||
                      visitor.status === "Sent to Admin" ||
                      visitor.status === "Accepted by Visitor" ||
                      visitor.status === "Accepted by Contact Person") && (
                      <>
                        <button
                          onClick={() => onAction(visitor, "Approve")}
                          className="flex-1 h-10 sm:h-12 flex justify-center items-center gap-2 sm:gap-3 bg-green-500/5 border border-green-500/20 text-green-500 text-[11px] sm:text-[12px] font-medium capitalize tracking-[0.15em] sm:tracking-[0.2em] rounded-lg hover:bg-green-500 hover:text-white transition-all shadow-lg"
                        >
                          <Check
                            size={12}
                            className="sm:w-[14px] sm:h-[14px]"
                            strokeWidth={3}
                          />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => onAction(visitor, "Reject")}
                          className="flex-1 h-10 sm:h-12 flex justify-center items-center gap-2 sm:gap-3 bg-primary/5 border border-primary/20 text-primary text-[11px] sm:text-[12px] font-medium capitalize tracking-[0.15em] sm:tracking-[0.2em] rounded-lg hover:bg-primary hover:text-white transition-all shadow-lg"
                        >
                          <X
                            size={12}
                            className="sm:w-[14px] sm:h-[14px]"
                            strokeWidth={3}
                          />
                          <span>Reject</span>
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => onViewDetails(visitor)}
                      className="flex-1 h-10 sm:h-12 flex justify-center items-center gap-2 sm:gap-3 bg-white/[0.02] border border-white/5 text-white text-[11px] sm:text-[12px] font-medium capitalize tracking-[0.15em] sm:tracking-[0.2em] rounded-lg hover:bg-white hover:text-black transition-all shadow-lg"
                    >
                      <Eye size={12} className="sm:w-[14px] sm:h-[14px]" />{" "}
                      <span>Inspect</span>
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
