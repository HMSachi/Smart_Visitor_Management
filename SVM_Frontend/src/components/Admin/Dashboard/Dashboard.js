import React from 'react';
import { motion } from 'framer-motion';
import QuickAccessHub from './QuickAccessHub';
import SystemStatusNode from './SystemStatusNode';
import { useNavigate } from 'react-router-dom';

const DashboardMain = () => {
  const navigate = useNavigate();

  const handleNavigate = (tab) => {
    switch (tab) {
      case 'approvals':
        navigate('/admin/approval-management');
        break;
      case 'security':
        navigate('/admin/security-monitoring');
        break;
      case 'blacklist':
        navigate('/admin/blacklist-management');
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <div className="max-w-[1600px] mx-auto">
        <header className="mb-6 flex justify-between items-end border-b border-white/[0.03] pb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-[2px] bg-mas-red"></div>
              <span className="text-mas-red uppercase tracking-wider text-xs font-semibold">Command Center</span>
            </div>
            <h1 className="text-white uppercase px-1 text-2xl font-bold tracking-tight">
              System Overview
            </h1>
          </div>
          <div className="hidden lg:flex items-center gap-8 text-mas-text-dim">
            <div className="text-right">
              <p className="uppercase mb-1 text-[10px] tracking-[0.2em] font-medium">Node Status</p>
              <p className="text-green-500 flex items-center justify-end gap-2 text-xs font-bold tracking-widest">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_5px_#22c55e]"></span>
                OPERATIONAL
              </p>
            </div>
            <div className="w-[1px] h-8 bg-white/10"></div>
            <div className="text-right">
              <p className="uppercase mb-1 text-[10px] tracking-[0.2em] font-medium">Global Time</p>
              <p className="text-white uppercase text-xs font-bold tracking-widest">14:18:22 GMT+5:30</p>
            </div>
          </div>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="space-y-12"
        >
          <QuickAccessHub setActiveTab={handleNavigate} />
          <SystemStatusNode />
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardMain;
