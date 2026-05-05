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
      <div className="space-y-5 sm:space-y-6 md:space-y-8">
        {/* Header Section */}
        <div className="h-4" /> {/* Spacer instead of header */}

        {/* Metrics Grid */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative z-10"
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 pb-10">
          {/* Activity Timeline */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[var(--color-surface-1)] border border-[var(--color-border-soft)] rounded-2xl p-6 md:p-8 hover:border-primary/20 transition-all duration-300"
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
      </div>

    </div>
  );
};

export default DashboardMain;
