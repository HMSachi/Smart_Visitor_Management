import React from 'react';
import { CheckCircle2, Server, Wifi } from 'lucide-react';

const SystemStatusNode = () => {
  const statusItems = [
    { label: 'Database', status: 'Online', ok: true },
    { label: 'API Gateway', status: 'Stable', ok: true },
  ];

  return (
    <div
      className="flex flex-col items-center justify-center h-full relative overflow-hidden group"
      style={{
        background: 'var(--color-bg-paper)',
        border: '1px solid var(--color-border-soft)',
        borderRadius: '16px',
        padding: '2rem 1.5rem',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      {/* Gradient top accent */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      {/* Animated status indicator */}
      <div className="relative mb-6">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{ background: 'var(--color-surface-1)', border: '1px solid var(--color-border-soft)' }}
        >
          <div className="w-4 h-4 rounded-full bg-green-500" style={{ boxShadow: '0 0 16px rgba(34,197,94,0.6)' }} />
        </div>
        <div
          className="absolute -inset-3 rounded-full border border-green-500/10"
          style={{ animation: 'spin 12s linear infinite' }}
        />
        <div
          className="absolute -inset-6 rounded-full border border-primary/5"
          style={{ animation: 'spin 20s linear infinite reverse' }}
        />
      </div>

      {/* Status text */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <CheckCircle2 size={16} className="text-green-500" />
          <h3 className="text-[var(--color-text-primary)] text-[14px] font-semibold m-0">
            All Systems Operational
          </h3>
        </div>
        <p className="text-[var(--color-text-secondary)] text-[12.5px] leading-relaxed max-w-xs">
          All security checks are active. The system is running smoothly with no issues detected.
        </p>
      </div>

      {/* Status chips */}
      <div
        className="w-full grid grid-cols-2 gap-3 pt-5"
        style={{ borderTop: '1px solid var(--color-border-soft)' }}
      >
        {statusItems.map((item) => (
          <div
            key={item.label}
            className="flex flex-col items-center p-3 rounded-xl"
            style={{ background: 'var(--color-surface-1)', border: '1px solid var(--color-border-soft)' }}
          >
            <p className="text-[var(--color-text-dim)] text-[11px] font-medium mb-1.5">{item.label}</p>
            <span
              className="text-[11.5px] font-semibold"
              style={{ color: item.ok ? '#22C55E' : '#F59E0B' }}
            >
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SystemStatusNode;
