import React from 'react';
import { useSelector } from 'react-redux';
import { Users, UserCheck, AlertTriangle, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const iconMap = { Users, UserCheck, AlertTriangle };

const colorMap = {
  blue: {
    bg: 'rgba(59,130,246,0.1)',
    border: 'rgba(59,130,246,0.2)',
    text: '#3B82F6',
    glow: 'rgba(59,130,246,0.15)',
  },
  green: {
    bg: 'rgba(34,197,94,0.1)',
    border: 'rgba(34,197,94,0.2)',
    text: '#22C55E',
    glow: 'rgba(34,197,94,0.15)',
  },
  red: {
    bg: 'rgba(200,16,46,0.1)',
    border: 'rgba(200,16,46,0.2)',
    text: '#C8102E',
    glow: 'rgba(200,16,46,0.15)',
  },
  yellow: {
    bg: 'rgba(245,158,11,0.1)',
    border: 'rgba(245,158,11,0.2)',
    text: '#F59E0B',
    glow: 'rgba(245,158,11,0.15)',
  },
};

const Panel = ({ iconName, label, value, trend, colorClass }, index) => {
  const Icon = iconMap[iconName] || Users;
  const color = colorMap[colorClass] || colorMap.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      className="relative overflow-hidden cursor-pointer group"
      style={{
        background: 'var(--color-bg-paper)',
        border: '1px solid var(--color-border-soft)',
        borderRadius: '16px',
        padding: '1.5rem',
        boxShadow: 'var(--shadow-card)',
        transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
      }}
      whileHover={{ y: -3, boxShadow: `0 8px 32px ${color.glow}, var(--shadow-card)` }}
    >
      {/* Background decoration */}
      <div
        className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-40 blur-2xl transition-all duration-500 group-hover:opacity-70"
        style={{ background: color.bg }}
      />

      {/* Top row */}
      <div className="flex items-start justify-between relative z-10 mb-4">
        <div>
          <p className="text-[var(--color-text-secondary)] text-[12.5px] font-medium tracking-wide mb-1">
            {label}
          </p>
          <p
            className="text-3xl font-bold tracking-tight transition-colors duration-300"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {value}
          </p>
        </div>

        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300"
          style={{ background: color.bg, border: `1px solid ${color.border}`, color: color.text }}
        >
          <Icon size={20} strokeWidth={2} />
        </div>
      </div>

      {/* Trend row */}
      {trend && (
        <div className="flex items-center gap-1.5 relative z-10">
          <TrendingUp size={13} style={{ color: color.text }} />
          <span className="text-[12px] font-medium" style={{ color: color.text }}>
            {trend}
          </span>
          <span className="text-[var(--color-text-dim)] text-[12px]">vs last week</span>
        </div>
      )}

      {/* Bottom accent line */}
      <div
        className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-700"
        style={{ background: `linear-gradient(90deg, ${color.text}, transparent)` }}
      />
    </motion.div>
  );
};

const OverviewPanels = () => {
  const { todayStats } = useSelector(state => state.admin.metrics);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {todayStats.map((stat, index) => Panel(stat, index))}
    </div>
  );
};

export default OverviewPanels;
