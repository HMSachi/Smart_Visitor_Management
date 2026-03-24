import React, { useState } from 'react';
import Sidebar from '../components/Dashboard/Layout/Sidebar';
import Header from '../components/Dashboard/Layout/Header';
import OverviewPanels from '../components/Dashboard/Overview/OverviewPanels';
import VisitorTable from '../components/Dashboard/Visitors/VisitorTable';
import BlacklistTable from '../components/Dashboard/Security/BlacklistTable';
import SecurityMonitoring from '../components/Dashboard/Security/SecurityMonitoring';
import QRCodeManagement from '../components/Dashboard/QR/QRCodeManagement';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            <OverviewPanels />
            
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-2 space-y-8">
                <VisitorTable />
                <SecurityMonitoring />
              </div>
              
              <div className="space-y-8">
                <BlacklistTable />
                <QRCodeManagement />
              </div>
            </div>
          </motion.div>
        );
      case 'approvals':
        return <div className="p-20 text-center"><h2 className="text-3xl font-bold uppercase tracking-widest text-mas-text-dim">Approval Management</h2><p className="mt-4 text-mas-red">Module loading...</p></div>;
      case 'qrcode':
        return <div className="p-8 h-full"><QRCodeManagement /></div>;
      case 'security':
        return <div className="p-8 h-full"><SecurityMonitoring /></div>;
      case 'blacklist':
        return <div className="p-8 h-full"><BlacklistTable /></div>;
      default:
        return (
          <div className="p-20 text-center">
            <h2 className="text-3xl font-bold uppercase tracking-widest text-mas-text-dim">{activeTab.replace('-', ' ')}</h2>
            <p className="mt-4 text-mas-red">This section is currently under development.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-mas-black overflow-x-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 ml-72 flex flex-col min-w-0 bg-[#0A0A0B]">
        <Header />
        
        <div className="flex-1 p-12 overflow-y-auto">
          <div className="max-w-[1600px] mx-auto">
            <header className="mb-12 flex justify-between items-end border-b border-white/[0.03] pb-8">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-[2px] bg-mas-red"></div>
                  <span className="text-[10px] text-mas-red font-black uppercase tracking-[0.5em]">Command Center</span>
                </div>
                <h1 className="text-4xl font-black text-white uppercase tracking-tighter leading-none">
                  System Overview
                </h1>
              </div>
              <div className="hidden lg:flex items-center gap-8 text-mas-text-dim">
                <div className="text-right">
                  <p className="text-[10px] uppercase font-black tracking-[0.2em] mb-1">Node Status</p>
                  <p className="text-xs font-black text-green-500 tracking-widest flex items-center justify-end gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                    OPERATIONAL
                  </p>
                </div>
                <div className="w-[1px] h-8 bg-white/10"></div>
                <div className="text-right">
                  <p className="text-[10px] uppercase font-black tracking-[0.2em] mb-1">Global Time</p>
                  <p className="text-xs font-black text-white tracking-widest leading-none italic">14:02:45 GMT+5:30</p>
                </div>
              </div>
            </header>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
