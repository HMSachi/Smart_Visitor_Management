import React from 'react';
import { useSelector } from 'react-redux';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingUp, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const TotalVisitsCard = () => {
  const { totalVisits, history } = useSelector(state => state.admin.metrics);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="group relative overflow-hidden cursor-pointer h-full"
      style={{
        background: 'var(--color-bg-paper)',
        border: '1px solid var(--color-border-soft)',
        borderRadius: '16px',
        padding: '1.5rem',
        boxShadow: 'var(--shadow-card)',
        transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
      }}
      whileHover={{ y: -2 }}
    >
      {/* Background decoration */}
      <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-25 blur-3xl group-hover:opacity-40 transition-all pointer-events-none" style={{ background: 'rgba(200,16,46,0.2)' }} />

      {/* Header */}
      <div className="flex items-start justify-between mb-3 relative z-10">
        <div>
          <p className="text-[var(--color-text-secondary)] text-[12.5px] font-medium mb-1">Total Visits (All Time)</p>
          <p className="text-3xl font-bold text-[var(--color-text-primary)] tracking-tight">
            {totalVisits?.toLocaleString() || '0'}
          </p>
        </div>
        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center text-primary shrink-0 transition-all duration-300 group-hover:bg-primary group-hover:text-white"
          style={{ background: 'rgba(200,16,46,0.1)', border: '1px solid rgba(200,16,46,0.2)' }}
        >
          <Users size={20} strokeWidth={2} />
        </div>
      </div>

      {/* Trend badge */}
      <div className="flex items-center gap-2 mb-4 relative z-10">
        <span
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11.5px] font-semibold"
          style={{ background: 'rgba(34,197,94,0.1)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.2)' }}
        >
          <TrendingUp size={11} />
          +12.5%
        </span>
        <span className="text-[var(--color-text-dim)] text-[12px]">compared to last month</span>
      </div>

      {/* Area Chart */}
      <div className="h-28 w-full relative z-10 -mx-1">
        <ResponsiveContainer width="105%" height="100%">
          <AreaChart data={history}>
            <defs>
              <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.25} />
                <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-bg-elevated)',
                border: '1px solid var(--color-border-soft)',
                borderRadius: '10px',
                fontSize: '12px',
                color: 'var(--color-text-primary)',
              }}
              itemStyle={{ color: 'var(--color-primary)', fontWeight: 600 }}
              cursor={{ stroke: 'var(--color-primary)', strokeWidth: 1, strokeDasharray: '4 4' }}
            />
            <Area
              type="monotone"
              dataKey="visits"
              stroke="var(--color-primary)"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorVisits)"
              animationDuration={2000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-700 bg-primary" />
    </motion.div>
  );
};

export default TotalVisitsCard;
