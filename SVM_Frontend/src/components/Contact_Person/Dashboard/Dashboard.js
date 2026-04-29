import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Activity } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import MetricsGrid from "./MetricsGrid";
import QuickActions from "./QuickActions";
import SystemStatus from "./SystemStatus";
import RequestDistribution from "./RequestDistribution";
import ActivityTimeline from "./ActivityTimeline";
import RecentRequests from "./RecentRequests";
import { GetVisitRequestsByCP } from "../../../actions/VisitRequestAction";
import ContactPersonService from "../../../services/ContactPersonService";

const DashboardMain = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.login.user);
  const userEmail = user?.ResultSet?.[0]?.VA_Email;
  const [cpId, setCpId] = useState(null);

  // 1. Identify Contact Person ID
  useEffect(() => {
    const loadContactPersonId = async () => {
      try {
        const response = await ContactPersonService.GetAllContactPersons();
        const contactPersons = response?.data?.ResultSet || [];
        const match = contactPersons.find(
          (cp) => cp?.VCP_Email?.trim().toLowerCase() === userEmail?.trim().toLowerCase()
        );
        
        const id = match?.VCP_Contact_person_id || user?.ResultSet?.[0]?.VCP_Contact_person_id || null;
        setCpId(id);
      } catch (err) {
        console.error("Error identifying CP:", err);
        setCpId(user?.ResultSet?.[0]?.VCP_Contact_person_id || null);
      }
    };

    if (userEmail) loadContactPersonId();
  }, [userEmail, user]);

  // 2. Data Fetching & Polling Mechanism
  useEffect(() => {
    if (!cpId) return;

    // Initial fetch
    dispatch(GetVisitRequestsByCP(cpId));

    // Real-time heartbeat (30s interval)
    const interval = setInterval(() => {
      dispatch(GetVisitRequestsByCP(cpId));
    }, 30000);

    return () => clearInterval(interval);
  }, [dispatch, cpId]);
  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] p-2 sm:p-3 md:p-4 lg:p-6 animate-fade-in-slow relative max-w-[1600px] mx-auto w-full">
      <div className="space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-8">
        {/* Header Section */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 sm:mb-5 md:mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-[var(--color-border-soft)] pb-3 sm:pb-4 md:pb-5 gap-3 sm:gap-4 relative z-10"
        >
          <div className="bg-[var(--color-surface-1)] border-l-4 border-primary p-3 sm:p-4 md:p-5 rounded-r-2xl backdrop-blur-sm w-full sm:w-auto hover:border-l-primary/80 transition-all duration-300">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mb-2">
              <div className="w-2 h-2 bg-primary rounded-full shadow-[0_0_12px_var(--color-primary)] animate-pulse flex-shrink-0"></div>
              <span className="text-[var(--color-text-primary)] text-[11px] sm:text-[12px] md:text-[13px] font-bold uppercase tracking-[0.3em] leading-tight">
                Contact Person Hub
              </span>
            </div>
            <p className="text-[var(--color-text-secondary)] text-[9px] sm:text-[10px] md:text-[11px] uppercase font-semibold tracking-[0.2em] opacity-80 leading-tight">
              Manage Visitor Access & Authorization Requests
            </p>
          </div>
          <div className="flex items-center gap-2 text-[var(--color-text-secondary)] text-[10px] sm:text-xs opacity-75 flex-shrink-0">
            <Activity size={14} className="text-primary flex-shrink-0" />
            <span className="whitespace-nowrap">
              Status: <span className="text-green-500 font-bold">Active</span>
            </span>
          </div>
        </motion.header>

        {/* Metrics Grid */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <MetricsGrid />
        </motion.section>

        {/* Quick Actions */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <QuickActions />
        </motion.section>

        {/* System Status & Request Distribution (2-Column Layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
          {/* System Status - Wider on desktop */}
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <SystemStatus />
          </motion.section>

          {/* Request Distribution */}
          <motion.section
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <RequestDistribution />
          </motion.section>
        </div>

        {/* Activity Timeline & Recent Requests (2-Column Layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
          {/* Activity Timeline */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[var(--color-surface-1)] border border-[var(--color-border-soft)] rounded-2xl p-6 hover:border-primary/20 transition-all duration-300"
          >
            <ActivityTimeline />
          </motion.section>

          {/* Recent Requests */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <RecentRequests />
          </motion.section>
        </div>

        {/* Footer Spacer */}
        <div className="h-4 sm:h-6 md:h-8"></div>
      </div>
    </div>
  );
};

export default DashboardMain;
