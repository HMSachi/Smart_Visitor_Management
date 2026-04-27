import React from 'react';
import { QrCode, Share2, RotateCw, CheckCircle2, Shield, Database } from 'lucide-react';

const QRCodeManagement = () => {
  return (
    <div
      className="flex flex-col h-full"
      style={{
        background: 'var(--color-bg-paper)',
        border: '1px solid var(--color-border-soft)',
        borderRadius: '16px',
        padding: '1.5rem',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="text-[var(--color-text-primary)] text-[15px] font-semibold m-0">
            QR Access Code
          </h2>
          <p className="text-[var(--color-text-secondary)] text-[12px] mt-0.5">
            Secure token for visitor check-in at the gate
          </p>
        </div>
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-primary shrink-0"
          style={{ background: 'rgba(200,16,46,0.1)', border: '1px solid rgba(200,16,46,0.2)' }}
        >
          <Shield size={17} />
        </div>
      </div>

      {/* QR Display */}
      <div
        className="flex-1 flex flex-col items-center justify-center py-8 mb-5 rounded-xl"
        style={{ background: 'var(--color-surface-1)', border: '1px solid var(--color-border-soft)' }}
      >
        <div className="relative group cursor-pointer">
          {/* Corner accents */}
          <div className="absolute -top-2 -left-2 w-5 h-5 border-t-2 border-l-2 border-primary rounded-tl-sm" />
          <div className="absolute -top-2 -right-2 w-5 h-5 border-t-2 border-r-2 border-primary rounded-tr-sm" />
          <div className="absolute -bottom-2 -left-2 w-5 h-5 border-b-2 border-l-2 border-primary rounded-bl-sm" />
          <div className="absolute -bottom-2 -right-2 w-5 h-5 border-b-2 border-r-2 border-primary rounded-br-sm" />

          <div
            className="w-44 h-44 flex items-center justify-center group-hover:scale-105 transition-transform duration-300"
            style={{ background: '#fff', borderRadius: '8px', padding: '12px' }}
          >
            <QrCode size={160} color="#111114" strokeWidth={1.5} />
          </div>
        </div>

        <div className="mt-5 text-center">
          <p className="text-[var(--color-text-primary)] text-[13.5px] font-semibold">MAS-HQ-SEC-01</p>
          <div className="flex items-center justify-center gap-1.5 mt-1.5">
            <CheckCircle2 size={12} className="text-green-500" />
            <p className="text-[var(--color-text-secondary)] text-[12px]">Valid for the next 12 hours</p>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <button
          className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-[13px] font-semibold transition-all hover:opacity-90 active:scale-95"
          style={{ background: 'linear-gradient(135deg, var(--color-primary), #A60D26)', boxShadow: '0 4px 14px rgba(200,16,46,0.3)' }}
        >
          <RotateCw size={14} />
          Regenerate
        </button>
        <button
          className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-[var(--color-text-primary)] text-[13px] font-semibold transition-all hover:bg-[var(--color-surface-2)]"
          style={{ background: 'var(--color-surface-1)', border: '1px solid var(--color-border-medium)' }}
        >
          <Share2 size={14} />
          Print / Share
        </button>
      </div>

      {/* Status footer */}
      <div
        className="flex items-center justify-between pt-3"
        style={{ borderTop: '1px solid var(--color-border-soft)' }}
      >
        <div className="flex items-center gap-2 text-[var(--color-text-secondary)] text-[12px]">
          <Database size={13} />
          <span>Sync in progress...</span>
        </div>
        <span
          className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
          style={{ background: 'rgba(34,197,94,0.1)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.2)' }}
        >
          Secure
        </span>
      </div>
    </div>
  );
};

export default QRCodeManagement;
