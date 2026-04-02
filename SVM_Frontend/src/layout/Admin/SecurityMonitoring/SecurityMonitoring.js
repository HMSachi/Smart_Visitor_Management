import React from 'react';
import Header from '../../../components/Admin/Layout/Header';
import SecurityMonitoring from '../../../components/Admin/SecurityMonitoring/SecurityMonitoring';

const SecurityMonitoringPage = () => {
  return (
    <div className="flex flex-col min-w-0 bg-[var(--color-bg-default)] min-h-screen">
      <Header />
      
      <div className="flex-1 p-8 overflow-y-auto w-full">
        <div className="max-w-[1600px] mx-auto">
          <header className="mb-6 flex justify-between items-end border-b border-white/[0.03] pb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-[2px] bg-primary"></div>
                <span className="text-primary uppercase tracking-wider text-xs font-semibold">Command Center</span>
              </div>
              <h1 className="text-white uppercase px-1 text-2xl font-bold tracking-tight">
                Security Monitoring
              </h1>
            </div>
          </header>

          <div className="p-0 h-full">
            <SecurityMonitoring />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityMonitoringPage;
