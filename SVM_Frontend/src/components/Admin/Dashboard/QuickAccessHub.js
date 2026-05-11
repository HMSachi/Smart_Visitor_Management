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
        <div
          key={link.id}
          onClick={() => setActiveTab(link.id)}
          role="button"
          tabIndex="0"
          className="group relative overflow-hidden flex flex-col items-center justify-center text-center p-6 cursor-pointer transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] text-left"
          style={{
            background: 'var(--color-bg-paper)',
            border: '1px solid var(--color-border-soft)',
            boxShadow: 'var(--shadow-card)',
            borderRadius: '24px',
          }}
        >
          {/* Hover background */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ 
              background: 'linear-gradient(135deg, rgba(200,16,46,0.06), transparent)',
              borderRadius: '24px'
            }}
          />

          <div
            className="w-10 h-10 mb-4 flex items-center justify-center rounded-2xl transition-all duration-300 group-hover:bg-primary group-hover:text-white relative z-10"
            style={{
              background: 'var(--color-surface-2)',
              border: '1px solid var(--color-border-soft)',
              color: 'var(--color-text-secondary)',
            }}
          >
            <link.icon size={16} strokeWidth={2.5} />
          </div>

          <h3
            className="text-[var(--color-text-primary)] text-[12.5px] font-semibold mb-0.5 relative z-10 group-hover:text-primary transition-colors"
          >
            {link.label}
          </h3>
          <p className="text-[var(--color-text-secondary)] text-[11.5px] leading-relaxed relative z-10">
            {link.desc}
          </p>

          <div className="flex items-center gap-1 mt-2 text-primary text-[11px] font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 relative z-10">
            Open <ArrowRight size={12} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuickAccessHub;
