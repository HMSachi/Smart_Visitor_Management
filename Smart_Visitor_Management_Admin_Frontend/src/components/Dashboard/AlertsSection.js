import React from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, AlertTriangle, Info, ChevronRight, Bell } from 'lucide-react';

const AlertsSection = () => {
  const { alerts } = useSelector(state => state.dashboard);

  const getAlertIcon = (type) => {
    switch (type) {
      case 'critical': return <AlertCircle className="text-danger" size={20} />;
      case 'warning': return <AlertTriangle className="text-warning" size={20} />;
      default: return <Info className="text-primary" size={20} />;
    }
  };

  const getAlertStyles = (type) => {
    switch (type) {
      case 'critical': return 'border-l-danger bg-danger/5 shadow-[0_0_15px_rgba(239,68,68,0.05)]';
      case 'warning': return 'border-l-warning bg-warning/5 shadow-[0_0_15px_rgba(245,158,11,0.05)]';
      default: return 'border-l-primary bg-primary/5 shadow-[0_0_15px_rgba(99,102,241,0.05)]';
    }
  };

  return (
    <div className="glass rounded-2xl p-6 border border-white/5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Bell className="text-primary" size={20} />
          <h2 className="text-lg font-bold text-white">Live Alerts</h2>
        </div>
        <span className="bg-white/5 text-white/50 text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-widest">
          Last 24h
        </span>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
        <AnimatePresence>
          {alerts.map((alert, index) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-xl border-l-4 ${getAlertStyles(alert.type)} border border-white/5 group cursor-pointer hover:bg-white/10 transition-all duration-300 relative overflow-hidden`}
            >
              <div className="flex items-start justify-between relative z-10">
                <div className="flex space-x-3">
                  <div className="mt-0.5">{getAlertIcon(alert.type)}</div>
                  <div>
                    <p className="text-sm font-semibold text-white group-hover:text-primary transition-colors">{alert.message}</p>
                    <p className="text-xs text-white/30 mt-1 font-medium italic">{alert.time}</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-white/20 group-hover:text-white transition-colors" />
              </div>
              
              {/* Expand details placeholder appearance */}
              <div className="mt-2 h-0 group-hover:h-auto opacity-0 group-hover:opacity-100 transition-all duration-500 overflow-hidden">
                <div className="pt-2 border-t border-white/5 mt-2 flex justify-between items-center">
                   <button className="text-[10px] font-black uppercase tracking-tighter text-primary hover:underline">Mark as resolved</button>
                   <button className="text-[10px] font-black uppercase tracking-tighter text-white/30 hover:text-white">View Details</button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <button className="mt-6 w-full py-3 rounded-xl bg-white/5 text-white/50 text-xs font-bold uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all duration-300 border border-white/5">
        View All Notifications
      </button>
    </div>
  );
};

export default AlertsSection;
