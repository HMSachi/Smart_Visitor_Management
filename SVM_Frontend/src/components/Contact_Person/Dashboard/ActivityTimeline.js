import React from "react";
import { Activity, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ActivityTimeline = () => {
  const navigate = useNavigate();
  const { visitRequestsByCP: requests } = useSelector(
    (state) => state.visitRequestsState || {}
  );

  const calculateRelativeTime = (dateString) => {
    if (!dateString) return "Just now";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHrs = Math.floor(diffMins / 60);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHrs < 24) return `${diffHrs}h ago`;
    return date.toLocaleDateString();
  };

  const activities = (requests || [])
    .slice(0, 10)
    .map((req, idx) => {
      const status = (req.VVR_Status || "").toString().trim().toUpperCase();
      let action = "New Request Received";
      let type = "request";
      let badgeStatus = "new";

      if (status === "A" || status === "APPROVED") {
        action = "Request Approved";
        type = "approval";
        badgeStatus = "complete";
      } else if (status === "R" || status === "REJECTED") {
        action = "Request Declined";
        type = "review";
        badgeStatus = "urgent";
      } else if (status === "SENT" || status === "SENT_TO_ADMIN") {
        action = "Sent to Admin";
        type = "approval";
        badgeStatus = "priority";
      } else if (status === "ACCEPTED") {
        action = "Accepted by Visitor";
        type = "review";
        badgeStatus = "new";
      }

      return {
        id: req.VVR_Request_id || idx,
        type,
        visitor: req.VVR_Visitor_Name || req.VV_Name || `Visitor #${req.VVR_Visitor_id}`,
        time: calculateRelativeTime(req.VVR_Visit_Date),
        action,
        status: badgeStatus
      };
    });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="space-y-3 md:space-y-4 h-full flex flex-col"
    >
      <div className="flex items-center justify-between border-b border-[var(--color-border-soft)] pb-2 sm:pb-3 md:pb-4">
        <h3 className="uppercase flex flex-col md:flex-row items-center gap-2 sm:gap-3 md:gap-4 text-[var(--color-text-primary)] text-[10px] sm:text-xs font-bold tracking-widest">
          <Activity size={14} className="text-primary" />
          Real-Time Activity
        </h3>
        <button 
          onClick={() => navigate("/contact_person/visit-requests")}
          className="text-[var(--color-text-secondary)] text-[9px] sm:text-[10px] font-bold uppercase tracking-widest hover:text-primary transition-colors"
        >
          View All
        </button>
      </div>

      <div className="space-y-2 md:space-y-3 flex-1 overflow-y-auto">
        {activities.map((act, index) => (
          <motion.div
            key={act.id}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center justify-between p-2 sm:p-3 md:p-4 bg-[var(--color-bg-primary)] border border-[var(--color-border-soft)] rounded-lg hover:border-primary/30 transition-all group cursor-pointer"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center gap-2 sm:gap-3 md:gap-4 flex-1">
              <div className="relative flex-shrink-0">
                <div
                  className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full ${
                    act.status === "priority" || act.status === "urgent"
                      ? "bg-primary shadow-[0_0_8px_var(--color-primary)]"
                      : "bg-green-500 shadow-[0_0_8px_#22c55e]"
                  }`}
                ></div>
                <div
                  className={`absolute -inset-1 sm:-inset-1.5 rounded-full animate-ping opacity-50 ${
                    act.status === "priority" || act.status === "urgent"
                      ? "bg-primary"
                      : "bg-green-500"
                  }`}
                ></div>
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-[var(--color-text-primary)] text-[10px] sm:text-[11px] font-bold uppercase tracking-wider mb-0.5 sm:mb-1">
                  {act.visitor}
                </h4>
                <p className="text-[var(--color-text-secondary)] text-[9px] sm:text-[10px] font-bold uppercase tracking-widest opacity-75">
                  {act.action}
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-2 sm:gap-3 md:gap-4 flex-shrink-0 ml-2 sm:ml-4">
              <span className="text-[var(--color-text-secondary)] text-[9px] sm:text-[10px] font-bold uppercase tracking-widest whitespace-nowrap opacity-75">
                {act.time}
              </span>
              <ArrowUpRight
                size={12}
                className="text-[var(--color-text-secondary)] group-hover:text-primary transition-colors flex-shrink-0"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ActivityTimeline;
