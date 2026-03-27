import React, { useState } from 'react';
import Sidebar from '../../components/Admin/Dashboard/Layout/Sidebar';
import Header from '../../components/Admin/Dashboard/Layout/Header';
import DashboardContent from '../../components/Admin/Dashboard/DashboardContent';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="flex min-h-screen bg-mas-black overflow-x-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 ml-72 flex flex-col min-w-0 bg-[#0A0A0B]">
        <Header />
        
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

            <DashboardContent activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

