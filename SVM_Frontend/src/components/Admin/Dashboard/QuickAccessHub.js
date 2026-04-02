import React from 'react';

import { CheckSquare, ShieldAlert, UserX } from 'lucide-react';

const QuickAccessHub = ({ setActiveTab }) => {
  const links = [
    { id: 'approvals', label: 'AUTHORIZATION NODES', desc: 'PROCESS PENDING REQUESTS', icon: CheckSquare, color: 'mas-red' },
    { id: 'security', label: 'SECURITY MONITORING', desc: 'SITE ACTIVITY & LOGS', icon: ShieldAlert, color: 'white' },
    { id: 'blacklist', label: 'RESTRICTED REGISTRY', desc: 'MANAGE BLOCKED PERSONNEL', icon: UserX, color: 'white' },
    { id: 'reports', label: 'INTELLIGENCE SUMMARY', desc: 'SYSTEM ANALYTICS & REPORTS', icon: CheckSquare, color: 'white' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 h-full">
      {links.map((link) => (
        <div
          key={link.id}
          onClick={() => setActiveTab(link.id)}
          className="bg-[#121214] border border-white/5 p-8 rounded-[28px] group cursor-pointer hover:border-mas-red transition-all duration-500 relative overflow-hidden flex flex-col items-center justify-center text-center shadow-2xl active:scale-[0.98]"
        >
          <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-mas-red/[0.02] rounded-full blur-2xl group-hover:bg-mas-red/5 transition-all"></div>

          <div className={`w-14 h-14 mb-6 flex items-center justify-center rounded-2xl bg-white/[0.02] border border-white/10 group-hover:border-mas-red group-hover:bg-mas-red group-hover:text-white transition-all duration-500 shadow-lg relative z-10`}>
            <link.icon size={24} className={link.id === 'approvals' ? 'text-mas-red group-hover:text-white' : 'text-gray-300 group-hover:text-white'} strokeWidth={2} />
          </div>

          <h3 className="text-white text-[14px] font-bold uppercase tracking-[0.2em] mb-2 relative z-10 group-hover:text-mas-red transition-colors">{link.label}</h3>
          <p className="text-gray-300 text-[12px] font-medium uppercase tracking-widest opacity-0 group-hover:opacity-90 transition-all duration-500 translate-y-2 group-hover:translate-y-0 relative z-10">
            {link.desc}
          </p>
        </div>
      ))}
    </div>
  );
};

export default QuickAccessHub;
