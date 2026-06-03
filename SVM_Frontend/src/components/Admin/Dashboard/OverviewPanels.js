import React from 'react';
import { useSelector } from 'react-redux';
import {
  Users,
  UserCheck,
  AlertTriangle,
  TrendingUp,
  Shield,
  Phone,
  Building2,
  CheckCircle2,
  Clock3,
  XCircle,
  ShieldAlert,
} from 'lucide-react';
import { motion } from 'framer-motion';

const iconMap = {
  Users,
  UserCheck,
  AlertTriangle,
  Shield,
  Phone,
  Building2,
  CheckCircle2,
  Clock3,
  XCircle,
  ShieldAlert,
};

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
        borderRadius: '24px',
        padding: '1.25rem',
        boxShadow: 'var(--shadow-card)',
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      }}
      whileHover={{ 
        y: -5, 
        scale: 1.02,
        boxShadow: `0 20px 40px ${color.glow}, var(--shadow-card)`,
        borderColor: color.text 
      }}
    >
      {/* Background decoration */}
      <div
        className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-40 blur-2xl transition-all duration-500 group-hover:opacity-70"
        style={{ background: color.bg }}
      />

      {/* Top row */}
      <div className="flex items-start justify-between relative z-10 mb-3">
        <div>
          <p className="text-[var(--color-text-secondary)] text-[11.5px] font-medium tracking-wide mb-1">
            {label}
          </p>
          <p
            className="text-2xl font-bold tracking-tight transition-colors duration-300"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {value}
          </p>
        </div>

        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300"
          style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border-soft)', color: 'var(--color-text-secondary)' }}
        >
          <Icon size={16} strokeWidth={2.5} />
        </div>
      </div>

      {/* Trend row */}
      {trend && (
        <div className="flex items-center gap-1.5 relative z-10 mt-1">
          <TrendingUp size={12} style={{ color: color.text }} />
          <span className="text-[11.5px] font-medium" style={{ color: color.text }}>
            {trend}
          </span>
          <span className="text-[var(--color-text-dim)] text-[11px]">vs last week</span>
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
  const { todayVisits, lastSyncedAt } = useSelector((state) => state.admin.metrics);
  const administrators = useSelector((state) => state.administrator.administrators || []);
  const contactPersons = useSelector((state) => state.contactPerson.contactPersons || []);
  const visitors = useSelector((state) => state.visitorManagement.visitors || []);
  const visitRequests = useSelector((state) => state.visitRequestsState.visitRequests || []);
  const blacklists = useSelector((state) => state.blacklistState.blacklists || []);

  const normalizedRole = (value) => (value || '').toString().trim().toLowerCase();
  const normalizedStatus = (value) => (value || '').toString().trim().toUpperCase();

  const approvedRequests = visitRequests.filter((request) => {
    const status = normalizedStatus(request.VVR_Status);
    return status === 'A' || status === 'APPROVED' || status === 'ADMIN APPROVED' || status === 'ADMIN_APPROVED';
  }).length;

  const rejectedRequests = visitRequests.filter((request) => {
    const status = normalizedStatus(request.VVR_Status);
    return status === 'R' || status === 'REJECTED';
  }).length;

  const pendingRequests = Math.max(visitRequests.length - approvedRequests - rejectedRequests, 0);

  const adminCount = administrators.filter((person) => normalizedRole(person.VA_Role).includes('admin')).length;
  const securityCount = administrators.filter((person) => normalizedRole(person.VA_Role).includes('security')).length;
  const visitorRoleCount = administrators.filter((person) => normalizedRole(person.VA_Role).includes('visitor')).length;

  const liveCards = [
    { label: 'Administrators', value: String(adminCount), iconName: 'Shield', trend: 'Database count', colorClass: 'blue' },
    { label: 'Security Officers', value: String(securityCount), iconName: 'ShieldAlert', trend: 'Database count', colorClass: 'green' },
    { label: 'Contact Persons', value: String(contactPersons.length), iconName: 'Phone', trend: 'Database count', colorClass: 'yellow' },
    { label: 'Registered Visitors', value: String(visitors.length || visitorRoleCount), iconName: 'Building2', trend: 'Database count', colorClass: 'blue' },
    { label: 'Approved Requests', value: String(approvedRequests), iconName: 'CheckCircle2', trend: 'Live approvals', colorClass: 'green' },
    { label: 'Pending Requests', value: String(pendingRequests), iconName: 'Clock3', trend: 'Waiting review', colorClass: 'yellow' },
    { label: 'Rejected Requests', value: String(rejectedRequests), iconName: 'XCircle', trend: 'Live rejections', colorClass: 'red' },
    { label: 'Restricted List', value: String(blacklists.length), iconName: 'Shield', trend: 'Blocked visitors', colorClass: 'red' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 px-1">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.24em] uppercase text-[var(--color-text-dim)] mb-1">
            Live Snapshot
          </p>
          <h3 className="text-[14px] font-bold text-[var(--color-text-primary)] m-0">
            Core dashboard totals
          </h3>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-dim)] m-0">
            Auto refresh
          </p>
          <p className="text-[11px] font-semibold text-[var(--color-text-primary)] m-0">
            {lastSyncedAt ? new Date(lastSyncedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Every 30s'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {liveCards.map((stat, index) => (
        <div key={`stat-${index}`}>
          {Panel(stat, index)}
        </div>
        ))}
      </div>
    </div>
  );
};

export default OverviewPanels;
