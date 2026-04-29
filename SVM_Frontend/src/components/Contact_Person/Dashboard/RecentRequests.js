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
      <div className="p-3 sm:p-4 md:p-5 border-b border-[var(--color-border-soft)] flex items-center justify-between flex-shrink-0">
        <div>
          <h3 className="text-[var(--color-text-primary)] font-bold tracking-tight text-xs sm:text-sm">
            Recent Requests
          </h3>
          <p className="text-[var(--color-text-secondary)] text-[9px] sm:text-[10px] uppercase tracking-widest mt-1 opacity-75">
            Latest authorization activities
          </p>
        </div>
        <button
          onClick={() => navigate("/contact_person/visit-requests")}
          className="flex flex-col md:flex-row items-center gap-1 sm:gap-2 text-[10px] sm:text-[11px] font-bold text-primary hover:text-primary/80 uppercase tracking-widest transition-colors group"
        >
          View All{" "}
          <ArrowUpRight
            size={12}
            className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
          />
        </button>
      </div>

      {recentRequests.length > 0 ? (
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)] text-[10px] sm:text-[11px] md:text-[12px] uppercase tracking-[0.2em] font-bold border-b border-[var(--color-border-soft)] sticky top-0">
                <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3">Visitor</th>
                <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 text-center">Visit Date</th>
                <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 text-center">Status</th>
                <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 text-right">Action</th>
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
                    className="group hover:bg-primary/5 transition-all"
                  >
                    <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-3">
                      <div>
                        <p className="text-[var(--color-text-primary)] text-[11px] sm:text-[13px] font-bold uppercase tracking-wider flex items-center gap-1 sm:gap-2">
                          <User size={12} className="opacity-75" />
                          {req?.name || "Unknown"}
                        </p>
                      </div>
                    </td>
                    <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 text-center">
                      <div className="flex flex-col items-center justify-center gap-0.5 sm:gap-1">
                        <span className="text-[var(--color-text-primary)] text-[11px] sm:text-[13px] font-bold flex items-center gap-1 sm:gap-2">
                          <Calendar size={12} className="opacity-75" />
                          {req?.date || "-"}
                        </span>
                        <span className="text-[var(--color-text-secondary)] text-[9px] sm:text-[11px] uppercase tracking-widest opacity-75">
                          {req?.timeIn || ""}
                        </span>
                      </div>
                    </td>
                    <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 text-center">
                      <span
                        className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg text-[9px] sm:text-[10px] font-bold uppercase tracking-wider border shadow-sm inline-block ${getStatusColor(req?.status)}`}
                      >
                        {req?.status || "Unknown"}
                      </span>
                    </td>
                    <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 text-right">
                      <button
                        onClick={() =>
                          navigate("/contact_person/request-review", {
                            state: { requestId: req?.id },
                          })
                        }
                        className="text-[9px] sm:text-[11px] font-bold text-[var(--color-text-secondary)] hover:text-primary uppercase tracking-widest transition-all py-1 sm:py-1.5 px-2 sm:px-3 rounded-lg border border-[var(--color-border-soft)] hover:border-primary/30 hover:bg-primary/5 opacity-75 hover:opacity-100"
                      >
                        Review
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8">
          <div className="text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <ClockIcon size={18} className="text-primary opacity-75" />
            </div>
            <p className="text-[var(--color-text-secondary)] text-xs sm:text-sm opacity-75">
              No recent requests
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default RecentRequests;
