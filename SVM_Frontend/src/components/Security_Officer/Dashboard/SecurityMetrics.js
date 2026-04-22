import React from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  QrCode,
  ShieldCheck,
  Users,
  AlertTriangle,
  Activity,
  Zap,
  Target,
} from "lucide-react";

const iconMap = {
  QrCode,
  ShieldCheck,
  Users,
  AlertTriangle,
  Activity,
  Zap,
  Target,
};

const Panel = ({ iconName, label, value, trend }) => {
  const Icon = iconMap[iconName] || Users;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-[var(--color-bg-paper)] border border-white/5 p-5 md:p-6 rounded-[24px] flex flex-col justify-between group cursor-pointer hover:border-white/10 transition-all duration-500 relative overflow-hidden shadow-2xl h-full"
    >
      <div className="absolute -top-10 -right-10 w-20 h-20 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all"></div>

      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className="text-gray-300 text-[11px] md:text-[12px] font-medium uppercase tracking-[0.18em] mb-2.5 opacity-80 group-hover:opacity-100 transition-opacity">
            {label}
          </p>
          <h3 className="text-white text-2xl md:text-[28px] font-bold tracking-tighter group-hover:text-primary transition-colors">
            {value}
          </h3>
        </div>
        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 group-hover:border-primary/40 group-hover:bg-primary/10 transition-all duration-500 shadow-lg">
          <Icon
            className="text-primary group-hover:scale-110 transition-transform"
            size={18}
            strokeWidth={2.5}
          />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-primary group-hover:w-full transition-all duration-700 shadow-[0_0_10px_var(--color-primary)]"></div>
    </motion.div>
  );
};

const SecurityMetrics = () => {
  const { metrics } = useSelector((state) => state.security);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-6">
      {metrics.map((stat, index) => (
        <Panel key={index} {...stat} />
      ))}
    </div>
  );
};

export default SecurityMetrics;
