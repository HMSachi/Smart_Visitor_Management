import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import MetricsGrid from "./MetricsGrid";
import QuickActions from "./QuickActions";
import DashboardCharts from "./DashboardCharts";
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
    <div className="min-h-screen contact-theme-root bg-background-default p-2 sm:p-3 md:p-4 lg:p-6 animate-fade-in-slow relative max-w-[1600px] mx-auto w-full">
      <div className="space-y-5 sm:space-y-6 md:space-y-8">
        {/* Header Section */}
        <div className="h-4" /> {/* Spacer instead of header */}

        {/* Charts Section - Moved to top */}
        <motion.section
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative z-10"
        >
          <DashboardCharts />
        </motion.section>

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

        {/* Recent Requests (Full Width since Timeline is removed) */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="pb-10"
        >
          <RecentRequests />
        </motion.section>
      </div>

    </div>
  );
};

export default DashboardMain;
