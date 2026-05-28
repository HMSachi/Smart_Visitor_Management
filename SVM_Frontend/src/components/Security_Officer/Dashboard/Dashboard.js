import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { Shield } from "lucide-react";
import { FetchSecurityDashboardData } from "../../../actions/SecurityAction";
import DashboardCharts from "../../Admin/Dashboard/DashboardCharts";
import SecurityAlerts from "./SecurityAlerts";
import AccessControl from "./AccessControl";
import ActiveVisitors from "./ActiveVisitors";
import IncidentMonitoring from "./IncidentMonitoring";
import AccessLogs from "./AccessLogs";
import SecurityStatus from "./SecurityStatus";

const DashboardMain = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(FetchSecurityDashboardData());
    
    // Optional: Refresh every 30 seconds
    const interval = setInterval(() => {
      dispatch(FetchSecurityDashboardData());
    }, 30000);
    
    return () => clearInterval(interval);
  }, [dispatch]);

  return (
    <div className="flex-1 p-4 sm:p-8 lg:p-4 md:p-10 space-y-6 md:space-y-10 animate-fade-in-slow overflow-y-auto min-h-full bg-[var(--color-bg-default)]">
      <div className="max-w-[1600px] mx-auto space-y-10">
        <div className="flex justify-end mb-6">
          <div className="flex items-center gap-2 text-[var(--color-text-secondary)] text-xs opacity-75 bg-[var(--color-bg-paper)] px-4 py-2 rounded-full border border-[var(--color-border-soft)] shadow-sm">
            <Shield size={14} className="text-primary" />
            <span>System Status: <span className="text-green-500 font-bold">Active</span></span>
          </div>
        </div>

        <DashboardCharts hideUserDistribution={true} />
        {/* Security Alerts & Access Control */}
        {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          <motion.section initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="lg:col-span-2">
            <SecurityAlerts />
          </motion.section>
          <motion.section initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <AccessControl />
          </motion.section>
        </div> */}

        {/* Security Status */}
        {/* <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <SecurityStatus />
        </motion.section> */}

        {/* Active Visitors & Incident Monitoring */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 md:gap-8">
          <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <ActiveVisitors />
          </motion.section>
          {/* <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <IncidentMonitoring />
          </motion.section> */}
        </div>

        {/* Access Logs */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <AccessLogs />
        </motion.section>
      </div>
    </div>
  );
};

export default DashboardMain;
