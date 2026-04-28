import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Shield } from "lucide-react";
import SecurityMetrics from "./SecurityMetrics";
import SecurityQuickActions from "./SecurityQuickActions";
import SecurityAlerts from "./SecurityAlerts";
import AccessControl from "./AccessControl";
import ActiveVisitors from "./ActiveVisitors";
import IncidentMonitoring from "./IncidentMonitoring";
import AccessLogs from "./AccessLogs";
import SecurityStatus from "./SecurityStatus";

const DashboardMain = () => {
  return (
    <div className="flex-1 p-4 sm:p-8 lg:p-4 md:p-10 space-y-6 md:space-y-10 animate-fade-in-slow overflow-y-auto min-h-full bg-[var(--color-bg-default)]">
      <div className="max-w-[1600px] mx-auto space-y-10">
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-4 border-b border-[var(--color-border-soft)] mb-8 pb-8">
          <div>
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-3 mb-1">
              <div className="w-2.5 h-2.5 bg-primary rounded-full shadow-[0_0_15px_var(--color-primary)] animate-pulse"></div>
              <span className="text-[var(--color-text-primary)] text-[13px] md:text-[14px] font-bold uppercase tracking-[0.4em]">
                Security Command Center
              </span>
            </div>
            <p className="text-[var(--color-text-secondary)] text-[10px] md:text-[11px] uppercase font-semibold tracking-[0.25em] opacity-80">
              Real-Time Access Control & Incident Monitoring
            </p>
          </div>
          <div className="flex items-center gap-2 text-[var(--color-text-secondary)] text-xs opacity-75">
            <Shield size={16} className="text-primary" />
            <span>System Status: <span className="text-green-500 font-bold">Active</span></span>
          </div>
        </header>

        <SecurityMetrics />
        <SecurityQuickActions />
        
        {/* Security Alerts & Access Control */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          <motion.section initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="lg:col-span-2">
            <SecurityAlerts />
          </motion.section>
          <motion.section initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <AccessControl />
          </motion.section>
        </div>

        {/* Security Status */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <SecurityStatus />
        </motion.section>

        {/* Active Visitors & Incident Monitoring */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <ActiveVisitors />
          </motion.section>
          <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <IncidentMonitoring />
          </motion.section>
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
