import React from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { QrCode, ShieldCheck, Users, AlertTriangle, Activity, Zap, Target } from 'lucide-react';

const iconMap = {
    QrCode,
    ShieldCheck,
    Users,
    AlertTriangle,
    Activity,
    Zap,
    Target
};

const Panel = ({ iconName, label, value, trend }) => {
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
          <p className="text-gray-300 text-[10px] font-medium uppercase tracking-[0.2em] mb-4 opacity-80 group-hover:opacity-100 transition-opacity">{label}</p>
          <h3 className="text-white text-3xl font-bold tracking-tighter group-hover:text-mas-red transition-colors">{value}</h3>
        </div>
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 group-hover:border-mas-red/40 group-hover:bg-mas-red/10 transition-all duration-500 shadow-lg">
          <Icon className="text-mas-red group-hover:scale-110 transition-transform" size={20} strokeWidth={2.5} />
        </div>
      </div>



      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-mas-red group-hover:w-full transition-all duration-700 shadow-[0_0_10px_#C8102E]"></div>
    </motion.div>
  );
};

const SecurityMetrics = () => {
    const { metrics } = useSelector(state => state.security);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metrics.map((stat, index) => (
                <Panel key={index} {...stat} />
            ))}
        </div>
    );
};

export default SecurityMetrics;
