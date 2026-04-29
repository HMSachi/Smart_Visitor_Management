import React from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, AlertTriangle, Info, Bell, ArrowRight, Clock } from 'lucide-react';

const AlertsSection = () => {
  const { alerts } = useSelector(state => state.admin.metrics);

  const getAlertConfig = (type) => {
    switch (type) {
      case 'critical':
        return {
          icon: AlertCircle,
          style: { bg: 'rgba(200,16,46,0.06)', border: 'rgba(200,16,46,0.2)', accent: '#C8102E', label: 'Critical' },
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          style: { bg: 'rgba(245,158,11,0.06)', border: 'rgba(245,158,11,0.2)', accent: '#F59E0B', label: 'Warning' },
        };
      default:
        return {
          icon: Info,
          style: { bg: 'rgba(59,130,246,0.06)', border: 'rgba(59,130,246,0.15)', accent: '#3B82F6', label: 'Info' },
        };
    }
  };

  return (
    <div
      className="flex flex-col h-full"
      style={{
        background: 'var(--color-bg-paper)',
        border: '1px solid var(--color-border-soft)',
        borderRadius: '16px',
        padding: '1.5rem',
        boxShadow: 'var(--shadow-card)',
        minHeight: '420px',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5 pb-4" style={{ borderBottom: '1px solid var(--color-border-soft)' }}>
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-primary"
            style={{ background: 'rgba(200,16,46,0.1)', border: '1px solid rgba(200,16,46,0.2)' }}
          >
            <Bell size={16} />
          </div>
          <div>
            <h2 className="text-[var(--color-text-primary)] text-[15px] font-semibold m-0">
              System Alerts
            </h2>
            <p className="text-[var(--color-text-dim)] text-[11px] font-medium">Live notifications</p>
          </div>
        </div>
        <span
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold"
          style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', color: '#22C55E' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          Live
        </span>
      </div>

      {/* Alerts list */}
      <div className="flex-1 space-y-3 overflow-y-auto no-scrollbar">
        <AnimatePresence>
          {alerts.map((alert, index) => {
            const { icon: Icon, style } = getAlertConfig(alert.type);
            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.08 }}
                className="flex items-start gap-3 p-4 rounded-xl cursor-pointer group transition-all duration-200"
                style={{
                  background: style.bg,
                  border: `1px solid ${style.border}`,
                }}
              >
                <div className="shrink-0 mt-0.5" style={{ color: style.accent }}>
                  <Icon size={17} strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[var(--color-text-primary)] text-[13.5px] font-medium leading-snug mb-1.5 group-hover:text-[var(--color-primary)] transition-colors">
                    {alert.message}
                  </p>
                  <div className="flex items-center gap-1.5 text-[var(--color-text-dim)] text-[11.5px]">
                    <Clock size={11} />
                    <span>{alert.time}</span>
                    <span
                      className="ml-1 px-1.5 py-0.5 rounded text-[10px] font-semibold"
                      style={{ background: style.bg, color: style.accent }}
                    >
                      {style.label}
                    </span>
                  </div>
                </div>
                <ArrowRight
                  size={14}
                  className="shrink-0 mt-0.5 text-[var(--color-text-dim)] group-hover:text-[var(--color-text-primary)] group-hover:translate-x-0.5 transition-all"
                />
              </motion.div>
            );
          })}
        </AnimatePresence>

        {alerts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3" style={{ background: 'var(--color-surface-1)', border: '1px solid var(--color-border-soft)' }}>
              <Bell size={22} className="text-[var(--color-text-dim)]" />
            </div>
            <p className="text-[var(--color-text-secondary)] text-sm font-medium">No alerts right now</p>
            <p className="text-[var(--color-text-dim)] text-xs mt-1">All systems are running smoothly</p>
          </div>
        )}
      </div>

      {/* View all button */}
      <button
        className="mt-4 w-full py-2.5 rounded-xl text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] text-[13px] font-medium transition-all flex items-center justify-center gap-2"
        style={{ background: 'var(--color-surface-1)', border: '1px solid var(--color-border-soft)' }}
      >
        View All Alerts
        <ArrowRight size={14} />
      </button>
    </div>
  );
};

export default AlertsSection;
