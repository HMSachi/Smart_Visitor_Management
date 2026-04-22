import React from 'react';
import { CheckSquare, ShieldAlert, UserX, ArrowRight } from 'lucide-react';

const QuickAccessHub = ({ setActiveTab }) => {
  const links = [
    {
      id: 'approvals',
      label: 'Pending Approvals',
      desc: 'Review and process visitor requests',
      icon: CheckSquare,
      primary: true,
    },
    {
      id: 'security',
      label: 'Security Monitor',
      desc: 'View site activity and access logs',
      icon: ShieldAlert,
      primary: false,
    },
    {
      id: 'blacklist',
      label: 'Restricted List',
      desc: 'Manage blocked visitors',
      icon: UserX,
      primary: false,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 h-full">
      {links.map((link) => (
        <button
          key={link.id}
          onClick={() => setActiveTab(link.id)}
          className="group relative overflow-hidden flex flex-col items-center justify-center text-center p-6 rounded-2xl cursor-pointer transition-all duration-300 active:scale-[0.97] text-left"
          style={{
            background: 'var(--color-bg-paper)',
            border: '1px solid var(--color-border-soft)',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          {/* Hover background */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
            style={{ background: 'linear-gradient(135deg, rgba(200,16,46,0.06), transparent)' }}
          />

          <div
            className="w-12 h-12 mb-4 flex items-center justify-center rounded-2xl transition-all duration-300 group-hover:bg-primary group-hover:text-white relative z-10"
            style={{
              background: link.primary ? 'rgba(200,16,46,0.1)' : 'var(--color-surface-1)',
              border: link.primary ? '1px solid rgba(200,16,46,0.25)' : '1px solid var(--color-border-soft)',
              color: link.primary ? 'var(--color-primary)' : 'var(--color-text-secondary)',
            }}
          >
            <link.icon size={22} strokeWidth={2} />
          </div>

          <h3
            className="text-[var(--color-text-primary)] text-[14px] font-semibold mb-1 relative z-10 group-hover:text-primary transition-colors"
          >
            {link.label}
          </h3>
          <p className="text-[var(--color-text-secondary)] text-[12px] leading-relaxed relative z-10">
            {link.desc}
          </p>

          <div className="flex items-center gap-1 mt-3 text-primary text-[11.5px] font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 relative z-10">
            Open <ArrowRight size={13} />
          </div>
        </button>
      ))}
    </div>
  );
};

export default QuickAccessHub;
