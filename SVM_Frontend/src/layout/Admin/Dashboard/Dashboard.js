import React from 'react';
import Header from '../../../components/Admin/Layout/Header';
import OverviewPanels from '../../../components/Admin/Dashboard/OverviewPanels';

const Dashboard = () => {
  return (
    <div className="flex flex-col min-w-0 bg-[var(--color-bg-default)] min-h-screen">
      <Header />
      
      <div className="flex-1 p-4 sm:p-8 lg:p-4 md:p-10 space-y-6 md:space-y-10 animate-fade-in-slow overflow-y-auto">
        <div className="max-w-[1600px] mx-auto space-y-10">
          <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_8px_var(--color-primary)] animate-pulse"></div>
                <span className="text-gray-300 text-[13px] font-medium uppercase tracking-[0.3em]">Dashboard Overview</span>
              </div>
              <p className="text-gray-300 text-xs uppercase tracking-widest opacity-90">Real-time system summary and administrative management</p>
            </div>

          </header>

          <OverviewPanels />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
