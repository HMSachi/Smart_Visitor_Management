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
      className="space-y-4 h-full flex flex-col"
    >
      <div className="flex items-center justify-between border-b border-[var(--color-border-soft)] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <Activity size={16} />
          </div>
          <div>
            <h3 className="text-[var(--color-text-primary)] text-xs font-black uppercase tracking-widest leading-none">
              Live Activity
            </h3>
            <p className="text-[var(--color-text-dim)] text-[9px] font-bold uppercase tracking-widest mt-0.5 opacity-75">
              Real-time system feed
            </p>
          </div>
        </div>
        <button 
          onClick={() => navigate("/contact_person/visit-requests")}
          className="text-primary text-[10px] font-black uppercase tracking-[0.2em] hover:opacity-80 transition-opacity"
        >
          View All
        </button>
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto pr-1 custom-scrollbar">
        {activities.map((act, index) => (
          <motion.div
            key={act.id}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center justify-between p-2.5 sm:p-3 bg-[var(--color-bg-paper)] border border-[var(--color-border-soft)] rounded-xl hover:border-primary/30 hover:bg-primary/[0.02] transition-all group cursor-pointer shadow-sm"
          >
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="relative flex-shrink-0">
                <div
                  className={`w-2 h-2 rounded-full ${
                    act.status === "priority" || act.status === "urgent"
                      ? "bg-primary shadow-[0_0_8px_var(--color-primary)]"
                      : "bg-green-500 shadow-[0_0_8px_#22c55e]"
                  }`}
                ></div>
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-[var(--color-text-primary)] text-[11.5px] font-bold tracking-tight truncate mb-0.5">
                  {act.visitor}
                </h4>
                <p className="text-[var(--color-text-dim)] text-[9.5px] font-medium tracking-wide opacity-80 leading-none">
                  {act.action}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0 ml-3">
              <span className="text-[var(--color-text-dim)] text-[9px] font-bold tracking-wider whitespace-nowrap">
                {act.time}
              </span>
              <div className="w-7 h-7 rounded-lg bg-[var(--color-surface-1)] flex items-center justify-center text-[var(--color-text-dim)] group-hover:text-primary group-hover:bg-primary/10 transition-all border border-transparent group-hover:border-primary/20">
                <ArrowUpRight size={13} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ActivityTimeline;
