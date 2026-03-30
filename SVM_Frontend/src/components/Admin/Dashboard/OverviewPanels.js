import React from 'react';
import { useSelector } from 'react-redux';
import { Users, UserCheck, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const iconMap = {
  Users,
  UserCheck,
  AlertTriangle
};

const Panel = ({ iconName, label, value, trend, colorClass }) => {
  const Icon = iconMap[iconName] || Users;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-[#121214] border border-white/5 p-8 rounded-[32px] flex flex-col justify-between group cursor-pointer hover:border-white/10 transition-all duration-500 relative overflow-hidden shadow-2xl h-full"
    >
      <div className="absolute -top-12 -right-12 w-24 h-24 bg-mas-red/5 rounded-full blur-3xl group-hover:bg-mas-red/10 transition-all"></div>

      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className="text-mas-text-dim text-[10px] font-black uppercase tracking-[0.2em] mb-4 opacity-40 group-hover:opacity-100 transition-opacity">{label}</p>
          <h3 className="text-white text-3xl font-bold tracking-tighter group-hover:text-mas-red transition-colors">{value}</h3>
        </div>
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 group-hover:border-mas-red/40 group-hover:bg-mas-red/10 transition-all duration-500 shadow-lg">
          <Icon className="text-mas-red group-hover:scale-110 transition-transform" size={20} strokeWidth={2.5} />
        </div>
      </div>

      <div className="mt-10 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg border ${trend.includes('+') ? 'text-green-500 border-green-500/10 bg-green-500/5' : 'text-mas-text-dim border-white/5 bg-white/5'}`}>
            {trend}
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest text-mas-text-dim opacity-30 group-hover:opacity-60">vs last cycle</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1 h-1 bg-mas-red rounded-full"></div>
          <p className="text-mas-text-dim text-[9px] font-black uppercase tracking-widest">Protocol Active</p>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-mas-red group-hover:w-full transition-all duration-700 shadow-[0_0_10px_#C8102E]"></div>
    </motion.div>
  );
};

const OverviewPanels = () => {
  const { todayStats } = useSelector(state => state.admin.metrics);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {todayStats.map((stat, index) => (
        <Panel key={index} {...stat} />
      ))}
    </div>
  );
};

export default OverviewPanels;
