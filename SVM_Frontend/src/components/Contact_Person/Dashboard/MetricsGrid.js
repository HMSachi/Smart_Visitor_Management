import React from 'react';
import { Layers, Clock, CheckSquare, Send } from 'lucide-react';
import { motion } from 'framer-motion';

const iconMap = {
    Layers,
    Clock,
    CheckSquare,
    Send
};

const Panel = ({ icon, label, value, trend }) => {
  const Icon = icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-[var(--color-bg-paper)] border border-white/5 p-8 rounded-[32px] flex flex-col justify-between group cursor-pointer hover:border-white/10 transition-all duration-500 relative overflow-hidden shadow-2xl h-full"
    >
      <div className="absolute -top-12 -right-12 w-24 h-24 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all"></div>

      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className="text-white/80 text-[13px] font-medium uppercase tracking-[0.2em] mb-4 group-hover:text-white transition-opacity">{label}</p>
          <h3 className="text-white text-3xl font-bold tracking-tighter group-hover:text-primary transition-colors">{value}</h3>
        </div>
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 group-hover:border-primary/40 group-hover:bg-primary/10 transition-all duration-500 shadow-lg">
          <Icon className="text-primary group-hover:scale-110 transition-transform" size={20} strokeWidth={2.5} />
        </div>
      </div>



      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-primary group-hover:w-full transition-all duration-700 shadow-[0_0_10px_var(--color-primary)]"></div>
    </motion.div>
  );
};

const MetricsGrid = () => {
    const stats = [
        { label: 'Total Syncs', value: '1,284', icon: Layers, trend: '+12.5%' },
        { label: 'Awaiting Action', value: '42', icon: Clock, trend: 'Priority' },
        { label: 'Authorization Success', value: '892', icon: CheckSquare, trend: '+8.2%' },
        { label: 'Admin Escalations', value: '350', icon: Send, trend: 'Finalized' },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, i) => (
                <Panel key={i} {...stat} />
            ))}
        </div>
    );
};

export default MetricsGrid;
