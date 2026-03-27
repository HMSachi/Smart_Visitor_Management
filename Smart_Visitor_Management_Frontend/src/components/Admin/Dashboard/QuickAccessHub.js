import React from 'react';
import { motion } from 'framer-motion';
import { CheckSquare, ShieldAlert, UserX } from 'lucide-react';

const QuickAccessHub = ({ setActiveTab }) => {
  const links = [
    { id: 'approvals', label: 'Visitor Approvals', desc: 'Process pending requests', icon: CheckSquare, color: 'mas-red' },
    { id: 'security', label: 'Security Center', desc: 'Monitor site activity', icon: ShieldAlert, color: 'white' },
    { id: 'blacklist', label: 'Blacklist', desc: 'Manage restricted nodes', icon: UserX, color: 'white' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {links.map((link) => (
        <div 
          key={link.id}
          onClick={() => setActiveTab(link.id)}
          className="bg-[#0F0F10] border border-white/5 p-8 group cursor-pointer hover:border-mas-red transition-all duration-300 flex flex-col items-center text-center"
        >
          <div className={`w-16 h-16 mb-6 flex items-center justify-center border border-white/10 group-hover:border-mas-red group-hover:bg-mas-red/[0.03] transition-all duration-300`}>
            <link.icon size={28} className={link.id === 'approvals' ? 'text-mas-red' : 'text-white/40 group-hover:text-mas-red'} strokeWidth={1.5} />
          </div>
          <h3 className="text-white uppercase mb-2">{link.label}</h3>
          <p className="text-mas-text-dim uppercase opacity-0 group-hover:opacity-100 transition-all duration-300">
            {link.desc}
          </p>
        </div>
      ))}
    </div>
  );
};

export default QuickAccessHub;
