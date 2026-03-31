import React from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, AlertTriangle, Info, ChevronRight, Bell } from 'lucide-react';

const AlertsSection = () => {
  const { alerts } = useSelector(state => state.admin.metrics);

  const getAlertIcon = (type) => {
    switch (type) {
      case 'critical': return <AlertCircle className="text-mas-red" size={20} />;
      case 'warning': return <AlertTriangle className="text-yellow-500" size={20} />;
      default: return <Info className="text-gray-300" size={20} />;
    }
  };

  const getAlertStyles = (type) => {
    switch (type) {
      case 'critical': return 'border-l-mas-red bg-mas-red/5';
      case 'warning': return 'border-l-yellow-500 bg-yellow-500/5';
      default: return 'border-l-mas-text-dim bg-white/5';
    }
  };

  return (
    <div className="mas-glass p-8 flex flex-col border-white/5 h-full min-h-[500px]">
      <div className="flex items-center justify-between mb-10 border-b border-white/5 pb-6">
        <div className="flex items-center space-x-3">
          <Bell className="text-mas-red" size={20} strokeWidth={2.5} />
          <h2 className="text-white uppercase">Signal Log</h2>
        </div>
        <span className="bg-mas-red/10 text-mas-red px-3 py-1 uppercase border border-mas-red/20 shadow-[0_0_10px_rgba(200,16,46,0.1)]">
          LIVE
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
              className={`p-5 border-l-4 ${getAlertStyles(alert.type)} border border-white/5 group cursor-pointer hover:bg-white/[0.04] transition-all duration-300`}
            >
              <div className="flex items-start justify-between">
                <div className="flex space-x-4">
                  <div className="mt-0.5">{getAlertIcon(alert.type)}</div>
                  <div>
                    <p className="text-white uppercase group-hover:text-mas-red transition-colors">{alert.message}</p>
                    <p className="text-gray-300 mt-2 uppercase">{alert.time}</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-gray-300 group-hover:text-white transition-colors" />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <button className="mt-10 w-full py-4 uppercase text-gray-300 hover:text-white hover:bg-mas-red/10 border border-white/10 hover:border-mas-red transition-all duration-500">
        Access Signal Archives
      </button>
    </div>
  );
};

export default AlertsSection;
