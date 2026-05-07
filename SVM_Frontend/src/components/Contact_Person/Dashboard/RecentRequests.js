import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight, User, Calendar, Clock as ClockIcon } from "lucide-react";
import { motion } from "framer-motion";

const RecentRequests = () => {
  const navigate = useNavigate();
  const { visitRequestsByCP: requests, isLoading } = useSelector(
    (state) => state.visitRequestsState || {}
  );

  // Get latest 5 requests
  const recentRequests =
    requests && Array.isArray(requests)
      ? [...requests].sort((a, b) => Number(b.VVR_Request_id) - Number(a.VVR_Request_id)).slice(0, 5)
      : [];

  const mapRequestToUI = (req) => {
    const requestId = req?.VVR_Request_id;
    const visitorName = req?.VVR_Visitor_Name || req?.VV_Name || `Visitor #${req?.VVR_Visitor_id}`;
    const date = req?.VVR_Visit_Date ? req.VVR_Visit_Date.split('T')[0] : "N/A";
    const status = (req?.VVR_Status || "").toString().trim().toUpperCase();
    
    let displayStatus = "Sent to Visitor";
    if (status === "SENT" || status === "SENT_TO_ADMIN") displayStatus = "Sent to Admin";
    else if (status === "A" || status === "APPROVED") displayStatus = "Approved";
    else if (status === "R" || status === "REJECTED") displayStatus = "Declined";
    else if (status === "ACCEPTED") displayStatus = "Accepted";

    return {
      id: requestId,
      name: visitorName,
      date: date,
      status: displayStatus,
      timeIn: req?.VVR_Visit_Time || "N/A"
    };
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
      case "accepted":
        return "text-green-500 bg-green-500/10 border-green-500/20";
      case "pending":
        return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
      case "declined":
      case "rejected":
        return "text-primary bg-primary/10 border-primary/20";
      default:
        return "text-[var(--color-text-secondary)] bg-[var(--color-surface-1)] border-[var(--color-border-soft)]";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-[var(--color-surface-1)] border border-[var(--color-border-soft)] rounded-2xl overflow-hidden hover:border-primary/20 transition-all duration-300 h-full flex flex-col"
    >
      <div className="p-4 sm:p-5 border-b border-[var(--color-border-soft)] flex items-center justify-between flex-shrink-0">
        <div>
          <h3 className="text-[var(--color-text-primary)] font-bold tracking-tight text-sm sm:text-base">
            Recent Requests
          </h3>
          <p className="text-[var(--color-text-secondary)] text-[10px] uppercase tracking-widest mt-1 opacity-75">
            Latest authorization activities
          </p>
        </div>
        <button
          onClick={() => navigate("/contact_person/visit-requests")}
          className="flex items-center gap-2 text-[10px] sm:text-[11px] font-bold text-primary hover:text-primary/80 uppercase tracking-widest transition-colors group"
        >
          View All{" "}
          <ArrowUpRight
            size={14}
            className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
          />
        </button>
      </div>

      {recentRequests.length > 0 ? (
        <div className="flex-1 overflow-y-auto">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)] text-[11px] uppercase tracking-[0.2em] font-bold border-b border-[var(--color-border-soft)] sticky top-0">
                  <th className="px-6 py-4">Visitor</th>
                  <th className="px-6 py-4 text-center">Visit Date</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border-soft)]">
                {recentRequests.map((rawReq, index) => {
                  const req = mapRequestToUI(rawReq);
                  return (
                    <motion.tr
                      key={req?.id || index}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                      className="group hover:bg-primary/5 transition-all cursor-pointer"
                      onClick={() => navigate("/contact_person/request-review", { state: { requestId: req?.id } })}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                            <User size={14} />
                          </div>
                          <p className="text-[var(--color-text-primary)] text-[13px] font-bold uppercase tracking-wider">
                            {req?.name || "Unknown"}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex flex-col items-center justify-center gap-1">
                          <span className="text-[var(--color-text-primary)] text-[13px] font-bold flex items-center gap-2">
                            <Calendar size={13} className="opacity-75 text-primary" />
                            {req?.date || "-"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-sm inline-block ${getStatusColor(req?.status)}`}
                        >
                          {req?.status || "Unknown"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <ArrowUpRight size={16} className="text-[var(--color-text-dim)] group-hover:text-primary transition-colors ml-auto" />
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-[var(--color-border-soft)]">
            {recentRequests.map((rawReq, index) => {
              const req = mapRequestToUI(rawReq);
              return (
                <motion.div
                  key={req?.id || index}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => navigate("/contact_person/request-review", { state: { requestId: req?.id } })}
                  className="p-4 active:bg-primary/5 flex items-center justify-between group"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <User size={18} />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-[var(--color-text-primary)] text-[13px] font-black uppercase tracking-tight truncate">
                        {req?.name || "Unknown"}
                      </h4>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-[var(--color-text-dim)] text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                          <Calendar size={11} className="text-primary/70" />
                          {req?.date}
                        </span>
                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider border ${getStatusColor(req?.status)}`}>
                          {req?.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <ArrowUpRight size={16} className="text-[var(--color-text-dim)] group-hover:text-primary shrink-0" />
                </motion.div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-3">
              <ClockIcon size={20} className="text-primary opacity-75" />
            </div>
            <p className="text-[var(--color-text-secondary)] text-sm font-medium opacity-75">
              No recent requests found
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default RecentRequests;
