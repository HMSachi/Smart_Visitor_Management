import React from "react";
import { useSelector } from "react-redux";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  BarChart,
  Bar,
} from "recharts";
import { Users, ShieldAlert, CheckCircle, Activity } from "lucide-react";
import { motion } from "framer-motion";
import { useThemeMode } from "../../../theme/ThemeModeContext";

const DashboardCharts = () => {
  const { themeMode } = useThemeMode();
  const isLight = themeMode === "light";

  const { history, totalVisits, activeVisitors } = useSelector((state) => ({
    history: state.admin.metrics.history || [],
    totalVisits: state.admin.metrics.totalVisits || 0,
    activeVisitors: state.admin.metrics.activeVisitors || 0,
  }));

  const administrators = useSelector((state) => state.administrator.administrators || []);
  const contactPersons = useSelector((state) => state.contactPerson.contactPersons || []);
  const visitors = useSelector((state) => state.visitorManagement.visitors || []);
  const visitRequests = useSelector((state) => state.visitRequestsState.visitRequests || []);
  const blacklists = useSelector((state) => state.blacklistState.blacklists || []);

  const normalizedRole = (value) => (value || "").toString().trim().toLowerCase();
  const normalizedStatus = (value) => (value || "").toString().trim().toUpperCase();
  const normalizedApproval = (value) => (value || "").toString().trim().toLowerCase();

  const adminCount = administrators.filter((person) => normalizedRole(person.VA_Role).includes("admin")).length;
  const securityCount = administrators.filter((person) => normalizedRole(person.VA_Role).includes("security")).length;
  const contactPersonCount = contactPersons.length;
  const visitorCount = visitors.length;

  const approvedRequests = visitRequests.filter((request) => {
    const status = normalizedStatus(request.VVR_Status);
    return status === "A" || status === "APPROVED" || status === "ADMIN APPROVED" || status === "ADMIN_APPROVED";
  }).length;

  const pendingRequests = visitRequests.filter((request) => {
    const status = normalizedStatus(request.VVR_Status);
    return !(status === "A" || status === "APPROVED" || status === "ADMIN APPROVED" || status === "ADMIN_APPROVED" || status === "R" || status === "REJECTED");
  }).length;

  const rejectedRequests = visitRequests.filter((request) => {
    const status = normalizedStatus(request.VVR_Status);
    return status === "R" || status === "REJECTED";
  }).length;

  const restrictedApproved = blacklists.filter((item) => normalizedApproval(item.VB_Approval_Status) === "approved").length;
  const restrictedPending = blacklists.filter((item) => normalizedApproval(item.VB_Approval_Status) === "pending").length;
  const restrictedRejected = blacklists.filter((item) => normalizedApproval(item.VB_Approval_Status) === "rejected").length;

  const restrictedChartData = [
    { name: "Approved", value: restrictedApproved, color: "#10B981" },
    { name: "Pending", value: restrictedPending, color: "#F59E0B" },
    { name: "Rejected", value: restrictedRejected, color: "#EF4444" },
  ].filter((d) => d.value > 0);

  const restrictedTotal = restrictedApproved + restrictedPending + restrictedRejected || blacklists.length;

  // Adjust naming slightly for presentation
  const userChartData = [
    { name: "Admins", value: adminCount || 0, color: "var(--color-primary)" },
    { name: "Security", value: securityCount || 0, color: "#3B82F6" },
    { name: "Contacts", value: contactPersonCount || 0, color: "#10B981" },
    { name: "Visitors", value: visitorCount || 0, color: "#F59E0B" },
  ].filter((d) => d.value > 0);

  // 2. Request status data
  const requestChartData = [
    { name: "Approved", value: approvedRequests || 0, color: "#10B981" },
    { name: "Pending", value: pendingRequests || 0, color: "#F59E0B" },
    { name: "Rejected", value: rejectedRequests || 0, color: "#EF4444" },
  ].filter((d) => d.value > 0);

  const totalRequests = approvedRequests + pendingRequests + rejectedRequests;

  const trendData = history.length > 0 ? history : [];
  const sharedChartRadius = { innerRadius: 40, outerRadius: 54, paddingAngle: 3 };

  const quickStats = [
    { label: "Active Visitors", value: activeVisitors, hint: "Currently on premise", icon: Users, color: "#2563EB" },
    { label: "Restricted", value: blacklists.length, hint: "Blocked profiles", icon: ShieldAlert, color: "#EF4444" },
    { label: "Approval Rate", value: totalRequests ? Math.round((approvedRequests / totalRequests) * 100) : 0, hint: "Approved requests", icon: CheckCircle, color: "#10B981", suffix: "%" },
  ];

  // Custom tooltips for Recharts
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div
          className="p-3 rounded-xl border shadow-xl text-[12px] font-semibold"
          style={{
            backgroundColor: "var(--color-bg-elevated)",
            borderColor: "var(--color-border-soft)",
            color: "var(--color-text-primary)",
          }}
        >
          <span style={{ color: data.color }}>●</span> {data.name}: {data.value}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-5 mt-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {quickStats.map((item) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="group relative overflow-hidden"
              style={{
                background: "var(--color-bg-paper)",
                border: "1px solid var(--color-border-soft)",
                borderRadius: "24px",
                padding: "1.25rem",
                boxShadow: "var(--shadow-card)",
              }}
            >
              <div className="flex items-start justify-between gap-4 relative z-10">
                <div>
                  <p className="text-[12px] sm:text-[13px] tracking-wide text-[var(--color-text-dim)] font-bold mb-1">
                    {item.label}
                  </p>
                  <p className="text-[18px] sm:text-[20px] font-extrabold leading-none text-[var(--color-text-primary)] m-0">
                    {item.value}{item.suffix || ""}
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-[var(--color-text-secondary)] mt-1.5 leading-relaxed max-w-[13rem]">
                    {item.hint}
                  </p>
                </div>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${item.color}14`, border: `1px solid ${item.color}22`, color: item.color }}
                >
                  <Icon size={16} />
                </div>
              </div>
              <div
                className="absolute bottom-0 left-0 h-[3px] w-full opacity-70"
                style={{ background: `linear-gradient(90deg, ${item.color}, transparent)` }}
              />
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* User Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="group relative overflow-hidden"
          style={{
            background: "var(--color-bg-paper)",
            border: "1px solid var(--color-border-soft)",
            borderRadius: "20px",
            padding: "1.25rem",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <div className="flex items-center justify-between mb-6 relative z-10">
            <div>
              <h3 className="text-[14px] font-bold text-[var(--color-text-primary)] m-0">User Distribution</h3>
              <p className="text-[var(--color-text-dim)] text-[11px] font-medium mt-0.5">System users by role</p>
            </div>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[var(--color-text-secondary)]" style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border-soft)" }}>
              <Users size={15} />
            </div>
          </div>

          <div className="h-44 w-full relative z-10 flex items-center justify-center pb-2">
            {userChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={userChartData} cx="50%" cy="50%" innerRadius={sharedChartRadius.innerRadius} outerRadius={sharedChartRadius.outerRadius} paddingAngle={sharedChartRadius.paddingAngle} dataKey="value">
                    {userChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} style={{ outline: 'none' }} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-[var(--color-text-dim)] text-xs">No user data available</div>
            )}
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] font-semibold text-[var(--color-text-secondary)]">
            {userChartData.map((entry) => (
              <div key={entry.name} className="flex items-center gap-2 whitespace-nowrap">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: entry.color }} />
                <span>{entry.name}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Restricted Visitors */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="group relative overflow-hidden"
          style={{ background: "var(--color-bg-paper)", border: "1px solid var(--color-border-soft)", borderRadius: "20px", padding: "1.25rem", boxShadow: "var(--shadow-card)" }}
        >
          <div className="flex items-center justify-between mb-6 relative z-10">
            <div>
              <h3 className="text-[14px] font-bold text-[var(--color-text-primary)] m-0">Restricted Visitors</h3>
              <p className="text-[var(--color-text-dim)] text-[11px] font-medium mt-0.5">Blacklist status</p>
            </div>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-red-500" style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
              <ShieldAlert size={15} />
            </div>
          </div>

          <div className="h-44 w-full relative z-10 flex items-center justify-center pb-2">
            {restrictedChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={restrictedChartData} cx="50%" cy="50%" innerRadius={sharedChartRadius.innerRadius} outerRadius={sharedChartRadius.outerRadius} paddingAngle={sharedChartRadius.paddingAngle} dataKey="value">
                    {restrictedChartData.map((entry, index) => (
                      <Cell key={`restricted-${index}`} fill={entry.color} style={{ outline: 'none' }} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <span className="text-5xl font-extrabold text-red-500 tracking-tight leading-none">0</span>
                <span className="text-[12px] font-bold uppercase tracking-[0.22em] text-[var(--color-text-secondary)] mt-3">Restricted</span>
              </div>
            )}
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] font-semibold text-[var(--color-text-secondary)]">
            {restrictedChartData.map((entry) => (
              <div key={entry.name} className="flex items-center gap-2 whitespace-nowrap">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: entry.color }} />
                <span>{entry.name} {entry.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Approval Analytics */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="group relative overflow-hidden"
          style={{ background: "var(--color-bg-paper)", border: "1px solid var(--color-border-soft)", borderRadius: "20px", padding: "1.25rem", boxShadow: "var(--shadow-card)" }}
        >
          <div className="flex items-center justify-between mb-6 relative z-10">
            <div>
              <h3 className="text-[14px] font-bold text-[var(--color-text-primary)] m-0">Approval Analytics</h3>
              <p className="text-[var(--color-text-dim)] text-[11px] font-medium mt-0.5">Visit request statuses</p>
            </div>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-green-500" style={{ background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
              <CheckCircle size={15} />
            </div>
          </div>

          <div className="h-44 w-full relative z-10 flex items-center justify-center pb-2">
            {requestChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={requestChartData} cx="50%" cy="50%" innerRadius={sharedChartRadius.innerRadius} outerRadius={sharedChartRadius.outerRadius} paddingAngle={sharedChartRadius.paddingAngle} dataKey="value">
                    {requestChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} style={{ outline: 'none' }} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-[var(--color-text-dim)] text-xs">No visit request data available</div>
            )}
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] font-semibold text-[var(--color-text-secondary)]">
            {requestChartData.map((entry) => (
              <div key={entry.name} className="flex items-center gap-2 whitespace-nowrap">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: entry.color }} />
                <span>{entry.name} {entry.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardCharts;
