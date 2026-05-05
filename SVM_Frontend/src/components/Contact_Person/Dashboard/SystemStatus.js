import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Activity, Zap, Server, RefreshCw } from "lucide-react";

const SystemStatus = () => {
  const [systemHealth, setSystemHealth] = useState(92);
  const [responseTime, setResponseTime] = useState(145);
  const [activeNodes, setActiveNodes] = useState(12);
  const [lastSync, setLastSync] = useState("2 mins ago");

  useEffect(() => {
    // Simulate periodic updates
    const interval = setInterval(() => {
      setSystemHealth((prev) =>
        Math.max(85, prev - Math.floor(Math.random() * 5) + 1),
      );
      setResponseTime((prev) =>
        Math.max(
          100,
          Math.min(250, prev + Math.floor(Math.random() * 20) - 10),
        ),
      );
      setLastSync(new Date().toLocaleTimeString());
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const healthStatus =
    systemHealth >= 90 ? "Optimal" : systemHealth >= 70 ? "Good" : "Warning";
  const healthColor =
    systemHealth >= 90
      ? "text-green-500"
      : systemHealth >= 70
        ? "text-yellow-500"
        : "text-primary";

  const StatCard = ({ icon: Icon, label, value, unit, color }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="flex-1 bg-[var(--color-surface-1)] border border-[var(--color-border-soft)] rounded-lg sm:rounded-xl p-2.5 sm:p-3 hover:border-primary/20 transition-all duration-300 group"
    >
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <span className="text-[var(--color-text-secondary)] text-[9px] sm:text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em]">
          {label}
        </span>
        <div className="w-7 h-7 sm:w-8 h-8 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-center group-hover:bg-primary/10 transition-all">
          <Icon size={14} className={color} strokeWidth={2} />
        </div>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-[var(--color-text-primary)] text-base sm:text-lg font-bold">
          {value}
        </span>
        {unit && (
          <span className="text-[var(--color-text-secondary)] text-[10px] sm:text-xs opacity-75">
            {unit}
          </span>
        )}
      </div>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="space-y-4"
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-3 sm:mb-4 md:mb-5">
        <div>
          <h2 className="text-[var(--color-text-primary)] text-sm sm:text-base font-bold tracking-tight flex items-center gap-2">
            <Activity size={16} className="text-primary" />
            System Status
          </h2>
          <p className="text-[var(--color-text-secondary)] text-[9px] opacity-75 mt-0.5 uppercase tracking-[0.2em]">
            Real-time infrastructure metrics
          </p>
        </div>
        <div
          className={`px-3 sm:px-4 py-1 sm:py-2 rounded-lg bg-${healthColor === "text-green-500" ? "green" : healthColor === "text-yellow-500" ? "yellow" : "primary"}/10 border border-${healthColor === "text-green-500" ? "green" : healthColor === "text-yellow-500" ? "yellow" : "primary"}/20`}
        >
          <span
            className={`text-xs sm:text-sm font-bold uppercase tracking-wide ${healthColor}`}
          >
            {healthStatus}
          </span>
        </div>
      </div>

      {/* Overall Health Progress */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="bg-[var(--color-surface-1)] border border-[var(--color-border-soft)] rounded-lg sm:rounded-xl md:rounded-2xl p-4 md:p-5"
      >
        <div className="mb-3 sm:mb-4">
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-[var(--color-text-primary)] text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em]">
              Overall Performance
            </span>
            <span className={`text-lg sm:text-xl font-bold ${healthColor}`}>
              {systemHealth}%
            </span>
          </div>
          <div className="h-2 sm:h-3 bg-[var(--color-border-soft)] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${systemHealth}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeInOut" }}
              className={`h-full rounded-full ${
                systemHealth >= 90
                  ? "bg-gradient-to-r from-green-500 to-green-400 shadow-[0_0_10px_#22c55e]"
                  : systemHealth >= 70
                    ? "bg-gradient-to-r from-yellow-500 to-yellow-400 shadow-[0_0_10px_#f59e0b]"
                    : "bg-gradient-to-r from-primary to-primary/70 shadow-[0_0_10px_var(--color-primary)]"
              }`}
            />
          </div>
        </div>
        <p className="text-[var(--color-text-secondary)] text-[10px] sm:text-xs opacity-75 uppercase tracking-widest">
          Last updated: {lastSync}
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <StatCard
          icon={Zap}
          label="Response Time"
          value={responseTime}
          unit="ms"
          color="text-primary"
        />
        <StatCard
          icon={Server}
          label="Active Nodes"
          value={activeNodes}
          color="text-green-500"
        />
        <StatCard
          icon={Activity}
          label="Sync Status"
          value="✓"
          color="text-green-500"
        />
        <StatCard
          icon={RefreshCw}
          label="Last Sync"
          value="OK"
          color="text-green-500"
        />
      </div>
    </motion.div>
  );
};

export default SystemStatus;
