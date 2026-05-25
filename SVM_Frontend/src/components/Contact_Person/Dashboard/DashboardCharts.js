import React from "react";
import { useSelector } from "react-redux";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";
import { Users, CheckCircle, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const DashboardCharts = () => {
  const { visitRequestsByCP } = useSelector(
    (state) => state.visitRequestsState || {}
  );
  
  const activeVisitors = useSelector((state) => state.visitorManagement.visitors?.length || 0);

  // Parse Date utility
  const formatDateOnly = (value) => {
    if (!value) return "N/A";
    const date = new Date(value);
    return isNaN(date) ? String(value).split("T")[0] : date.toISOString().split("T")[0];
  };

  // 1. Calculate Request Status Distribution
  let sentToVisitor = 0, visitorAccepted = 0, sentToAdmin = 0, adminApproved = 0, rejected = 0;
  
  // 2. Trend Data by Date
  const dateCounts = {};

  if (visitRequestsByCP && Array.isArray(visitRequestsByCP)) {
    visitRequestsByCP.forEach((req) => {
      const s = (req.VVR_Status || "").toString().trim().toUpperCase();
      
        if (s === "P" || s === "PENDING") sentToVisitor++;
        else if (s === "ACCEPTED" || s === "ACCEPTED BY VISITOR") visitorAccepted++;
        else if (s === "SENT" || s === "SENT_TO_ADMIN" || s === "SENT TO ADMIN") sentToAdmin++;
        else if (s === "A" || s === "APPROVED") adminApproved++;
        else if (s === "R" || s === "REJECTED") rejected++;
        else sentToVisitor++; // Default fallback for unknown states, matching StatusBadge logic

        // Date logic
        const dateStr = formatDateOnly(req.VVR_Visit_Date || req.VVR_Created_at);
        if (dateStr !== "N/A") {
          if (!dateCounts[dateStr]) dateCounts[dateStr] = { SentToVisitor: 0, VisitorAccepted: 0, SentToAdmin: 0, AdminApproved: 0, Rejected: 0 };
          
          if (s === "P" || s === "PENDING") dateCounts[dateStr].SentToVisitor++;
          else if (s === "ACCEPTED" || s === "ACCEPTED BY VISITOR") dateCounts[dateStr].VisitorAccepted++;
          else if (s === "SENT" || s === "SENT_TO_ADMIN" || s === "SENT TO ADMIN") dateCounts[dateStr].SentToAdmin++;
          else if (s === "A" || s === "APPROVED") dateCounts[dateStr].AdminApproved++;
          else if (s === "R" || s === "REJECTED") dateCounts[dateStr].Rejected++;
          else dateCounts[dateStr].SentToVisitor++;
        }
      });
    }

  const totalRequests = sentToVisitor + visitorAccepted + sentToAdmin + adminApproved + rejected;

  const requestChartData = [
      { name: "Admin approved", value: adminApproved, color: "#22c55e" },
      { name: "Accepted by visitor", value: visitorAccepted, color: "#eab308" },
      { name: "Contact person accepted", value: sentToAdmin, color: "#f97316" },
      { name: "Sent to visitor", value: sentToVisitor, color: "#3b82f6" },
      { name: "Rejected", value: rejected, color: "#ef4444" }
    ];

    // Build Bar Chart Data
    const trendData = Object.keys(dateCounts).sort().slice(-7).map(date => ({
      name: new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
      "Admin approved": dateCounts[date].AdminApproved,
      "Accepted by visitor": dateCounts[date].VisitorAccepted,
      "Contact person accepted": dateCounts[date].SentToAdmin,
      "Sent to visitor": dateCounts[date].SentToVisitor,
      "Rejected": dateCounts[date].Rejected
  }));

  const sharedChartRadius = { innerRadius: 65, outerRadius: 90, paddingAngle: 4 };

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
          <span style={{ color: payload[0].color || data.color }}>●</span> {data.name || payload[0].name}: {payload[0].value}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4 md:space-y-5" style={{marginTop: "5px"}}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-8">
        {/* Request Status Analytics */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="group relative overflow-hidden flex flex-col"
          style={{ background: "var(--color-bg-paper)", border: "1px solid var(--color-border-soft)", borderRadius: "28px", padding: "1.9rem", boxShadow: "var(--shadow-card)" }}
        >
          <div className="flex items-center justify-between mb-6 relative z-10 flex-shrink-0">
            <div>
              <h3 className="text-[14px] font-bold text-[var(--color-text-primary)] m-0">Approval Analytics</h3>
              <p className="text-[var(--color-text-dim)] text-[11px] font-medium mt-0.5">Visit request distributions</p>
            </div>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-green-500" style={{ background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
              <CheckCircle size={15} />
            </div>
          </div>

          <div className="flex-1 w-full relative z-10 flex items-center justify-center min-h-[220px]">
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

        {/* Visit Volume Over Time */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="group relative overflow-hidden flex flex-col"
          style={{ background: "var(--color-bg-paper)", border: "1px solid var(--color-border-soft)", borderRadius: "28px", padding: "1.9rem", boxShadow: "var(--shadow-card)" }}
        >
          <div className="flex items-center justify-between mb-4 relative z-10 flex-shrink-0">
            <div>
              <h3 className="text-[14px] font-bold text-[var(--color-text-primary)] m-0">Recent Visit Volume</h3>
              <p className="text-[var(--color-text-dim)] text-[11px] font-medium mt-0.5">Visits scheduled over last 7 active days</p>
            </div>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[var(--color-primary)]" style={{ background: "var(--color-primary-light)", border: "1px solid var(--color-primary-light-border)" }}>
              <TrendingUp size={15} />
            </div>
          </div>

          <div className="flex-1 w-full relative z-10 flex items-center justify-center min-h-[220px]">
            {trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border-soft)" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: "var(--color-text-secondary)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "var(--color-text-secondary)" }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{fill: 'var(--color-bg-default)'}} />
                    <Bar dataKey="Admin approved" stackId="a" fill="#22c55e" radius={[0, 0, 0, 0]} barSize={25} />
                    <Bar dataKey="Accepted by visitor" stackId="a" fill="#eab308" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="Contact person accepted" stackId="a" fill="#f97316" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="Sent to visitor" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="Rejected" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-[var(--color-text-dim)] text-xs">No trend data available</div>
            )}
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] font-semibold text-[var(--color-text-secondary)]">
              <div className="flex items-center gap-2 whitespace-nowrap">
                <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e]" />
                <span>Admin approved</span>
              </div>
              <div className="flex items-center gap-2 whitespace-nowrap">
                <span className="w-2.5 h-2.5 rounded-full bg-[#eab308]" />
                <span>Accepted by visitor</span>
              </div>
              <div className="flex items-center gap-2 whitespace-nowrap">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f97316]" />
                <span>Contact person accepted</span>
              </div>
              <div className="flex items-center gap-2 whitespace-nowrap">
                <span className="w-2.5 h-2.5 rounded-full bg-[#3b82f6]" />
                <span>Sent to visitor</span>
              </div>
              <div className="flex items-center gap-2 whitespace-nowrap">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
                <span>Rejected</span>
              </div>
          </div>
        </motion.div>
      </div>

       {/* Optional Stats Overview */}
       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <motion.div
           initial={{ opacity: 0, y: 15 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5, delay: 0.1 }}
           className="bg-background-paper border border-border-soft rounded-2xl p-4 text-center"
        >
          <p className="text-[10px] uppercase font-bold tracking-widest text-text-secondary mb-1">Total Requests</p>
          <p className="text-2xl font-extrabold text-text-primary">{totalRequests}</p>
        </motion.div>
        
        <motion.div
           initial={{ opacity: 0, y: 15 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5, delay: 0.15 }}
           className="bg-background-paper border border-border-soft rounded-2xl p-4 text-center"
        >
          <p className="text-[10px] uppercase font-bold tracking-widest text-[#22c55e] mb-1">Approved</p>
          <p className="text-2xl font-extrabold text-[#22c55e]">{adminApproved}</p>
        </motion.div>

        <motion.div
           initial={{ opacity: 0, y: 15 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5, delay: 0.2 }}
           className="bg-background-paper border border-border-soft rounded-2xl p-4 text-center"
        >
          <p className="text-[10px] uppercase font-bold tracking-widest text-[#3b82f6] mb-1">In Progress</p>
          <p className="text-2xl font-extrabold text-[#3b82f6]">{sentToVisitor + visitorAccepted + sentToAdmin}</p>
        </motion.div>
        
        <motion.div
           initial={{ opacity: 0, y: 15 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5, delay: 0.25 }}
           className="bg-background-paper border border-border-soft rounded-2xl p-4 text-center"
        >
          <p className="text-[10px] uppercase font-bold tracking-widest text-[#EF4444] mb-1">Rejected/Cancelled</p>
          <p className="text-2xl font-extrabold text-[#EF4444]">{rejected}</p>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardCharts;