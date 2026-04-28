import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { useSelector } from "react-redux";

const RequestDistribution = () => {
  const { visitRequestsByCP } = useSelector(
    (state) => state.visitRequestsState || {},
  );
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0,
  });

  useEffect(() => {
    if (visitRequestsByCP && Array.isArray(visitRequestsByCP)) {
      const pending = visitRequestsByCP.filter((req) => {
        const s = (req.VVR_Status || "").toString().trim().toUpperCase();
        return s === "P" || s === "PENDING";
      }).length;

      const approved = visitRequestsByCP.filter((req) => {
        const s = (req.VVR_Status || "").toString().trim().toUpperCase();
        return (
          s === "A" || s === "APPROVED" || s === "ACCEPTED" || s === "SUCCESS"
        );
      }).length;

      const rejected = visitRequestsByCP.filter((req) => {
        const s = (req.VVR_Status || "").toString().trim().toUpperCase();
        return s === "R" || s === "REJECTED";
      }).length;

      const total = visitRequestsByCP.length;

      setStats({ pending, approved, rejected, total });
    }
  }, [visitRequestsByCP]);

  const getPercentage = (value) => {
    return stats.total > 0 ? Math.round((value / stats.total) * 100) : 0;
  };

  const DistributionBar = ({
    label,
    value,
    percentage,
    icon: Icon,
    color,
    bgColor,
  }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="space-y-1 sm:space-y-2"
    >
      <div className="flex items-center justify-between mb-1 sm:mb-2">
        <div className="flex items-center gap-2">
          <div
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg ${bgColor} flex items-center justify-center`}
          >
            <Icon size={14} className={color} strokeWidth={2} />
          </div>
          <span className="text-[var(--color-text-primary)] text-xs sm:text-sm font-bold uppercase tracking-wide">
            {label}
          </span>
        </div>
        <span className="text-[var(--color-text-primary)] text-base sm:text-lg font-bold">
          {value}
        </span>
      </div>
      <div className="relative h-1.5 sm:h-2 sm:h-2.5 bg-[var(--color-border-soft)] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${percentage}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`h-full rounded-full ${color.replace("text-", "bg-")}`}
        >
          {percentage > 15 && (
            <div
              className={`h-full flex items-center justify-end pr-1 sm:pr-2 text-[8px] sm:text-[10px] font-bold text-white`}
            >
              {percentage}%
            </div>
          )}
        </motion.div>
      </div>
      {percentage <= 15 && (
        <p className="text-[9px] sm:text-[10px] text-[var(--color-text-secondary)] opacity-75">
          {percentage}%
        </p>
      )}
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-[var(--color-surface-1)] border border-[var(--color-border-soft)] rounded-lg sm:rounded-xl md:rounded-2xl p-4 md:p-5 hover:border-primary/20 transition-all duration-300"
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 md:mb-6">
        <div>
          <h2 className="text-[var(--color-text-primary)] text-base sm:text-lg md:text-xl font-bold tracking-tight flex items-center gap-2 sm:gap-3">
            <BarChart3 size={18} className="text-primary" />
            Request Distribution
          </h2>
          <p className="text-[var(--color-text-secondary)] text-[10px] sm:text-xs opacity-75 mt-1 uppercase tracking-[0.2em]">
            Breakdown by status
          </p>
        </div>
        <div className="flex items-center gap-2 mt-3 md:mt-0">
          <TrendingUp size={16} className="text-green-500" />
          <span className="text-xs sm:text-sm font-bold text-[var(--color-text-primary)]">
            Total: {stats.total}
          </span>
        </div>
      </div>

      <div className="space-y-4 md:space-y-5">
        <DistributionBar
          label="Pending Review"
          value={stats.pending}
          percentage={getPercentage(stats.pending)}
          icon={Clock}
          color="text-yellow-500"
          bgColor="bg-yellow-500/10 border border-yellow-500/20"
        />

        <DistributionBar
          label="Approved Requests"
          value={stats.approved}
          percentage={getPercentage(stats.approved)}
          icon={CheckCircle}
          color="text-green-500"
          bgColor="bg-green-500/10 border border-green-500/20"
        />

        <DistributionBar
          label="Rejected Requests"
          value={stats.rejected}
          percentage={getPercentage(stats.rejected)}
          icon={XCircle}
          color="text-primary"
          bgColor="bg-primary/10 border border-primary/20"
        />
      </div>

      {/* Summary Stats */}
      <div className="mt-4 md:mt-6 pt-4 md:pt-5 border-t border-[var(--color-border-soft)]">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
          <div className="text-center">
            <p className="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest mb-1 sm:mb-2 text-[var(--color-text-secondary)]">
              Approval Rate
            </p>
            <p className="text-lg sm:text-2xl font-bold text-green-500">
              {stats.total > 0
                ? Math.round((stats.approved / stats.total) * 100)
                : 0}
              %
            </p>
          </div>
          <div className="text-center">
            <p className="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest mb-1 sm:mb-2 text-[var(--color-text-secondary)]">
              Rejection Rate
            </p>
            <p className="text-lg sm:text-2xl font-bold text-primary">
              {stats.total > 0
                ? Math.round((stats.rejected / stats.total) * 100)
                : 0}
              %
            </p>
          </div>
          <div className="text-center">
            <p className="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest mb-1 sm:mb-2 text-[var(--color-text-secondary)]">
              Pending Rate
            </p>
            <p className="text-lg sm:text-2xl font-bold text-yellow-500">
              {stats.total > 0
                ? Math.round((stats.pending / stats.total) * 100)
                : 0}
              %
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RequestDistribution;
