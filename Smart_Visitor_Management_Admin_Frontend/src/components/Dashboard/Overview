import React from 'react';
import { Users, UserCheck, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const Panel = ({ icon: Icon, label, value, trend, colorClass }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    whileHover={{ y: -5 }}
    className="mas-glass p-8 flex flex-col justify-between group cursor-pointer animate-shine transition-all duration-500"
  >
    <div className="flex justify-between items-start">
      <div>
        <p className="text-[10px] uppercase tracking-[0.3em] text-mas-text-dim font-black mb-2">{label}</p>
        <h3 className="text-4xl font-black text-white tracking-tighter leading-none">{value}</h3>
      </div>
      <div className="p-4 bg-white/5 border border-white/10 group-hover:border-mas-red/50 group-hover:bg-mas-red/5 transition-all duration-500">
        <Icon className="text-mas-red" size={24} strokeWidth={2} />
      </div>
    </div>
    
    <div className="mt-8 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className={`text-[10px] font-black uppercase tracking-widest ${trend.includes('+') ? 'text-green-500' : 'text-mas-text-dim'}`}>
          {trend}
        </div>
        <div className="w-8 h-[1px] bg-white/10"></div>
      </div>
      <p className="text-[9px] text-mas-text-dim uppercase tracking-[0.2em] font-bold">Protocol Active</p>
    </div>

    {/* Subtle underline indicator */}
    <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-mas-red group-hover:w-full transition-all duration-700"></div>
  </motion.div>
);

const OverviewPanels = () => {
  const stats = [
    { label: 'Total Visits Today', value: '1,284', icon: Users, trend: '+12%', colorClass: 'mas-red' },
    { label: 'Active Visitors', value: '42', icon: UserCheck, trend: 'Stable', colorClass: 'mas-red' },
    { label: 'Alerts & Violations', value: '03', icon: AlertTriangle, trend: '+2', colorClass: 'mas-red' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Panel key={index} {...stat} />
      ))}
    </div>
  );
};

export default OverviewPanels;
