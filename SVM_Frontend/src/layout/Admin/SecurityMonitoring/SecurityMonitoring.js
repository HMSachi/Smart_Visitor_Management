import React from "react";
import Header from "../../../components/Admin/Layout/Header";
import SecurityMonitoring from "../../../components/Admin/SecurityMonitoring/SecurityMonitoring";

const SecurityMonitoringPage = () => {
  return (
    <div className="flex flex-col min-w-0 bg-[var(--color-bg-default)] min-h-screen">
      <Header />

      <div className="flex-1 p-4 md:p-8 !pt-2 space-y-3 md:space-y-6 animate-fade-in-slow overflow-y-auto bg-[var(--color-bg-default)] relative">
        {/* Dynamic Operational Aura */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>

        <div className="max-w-[1700px] mx-auto relative z-10">
          <header className="mb-4 flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/[0.03] pb-3 gap-4 relative z-10">
            <div className="bg-[var(--color-surface-1)] border-l-4 border-primary p-3 py-2 rounded-r-2xl backdrop-blur-sm w-full md:w-auto shadow-sm">
              <div className="flex flex-col md:flex-row items-center gap-2 md:gap-2 mb-1">
                <div className="w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_8px_var(--color-primary)]"></div>
                <span className="text-[var(--color-text-primary)] text-[12px] font-bold uppercase tracking-[0.3em]">
                  Security Monitoring
                </span>
              </div>
              <p className="text-[var(--color-text-secondary)] text-[10px] uppercase font-bold tracking-[0.2em] opacity-80 leading-tight">
                Real-time surveillance and access point monitoring
              </p>
            </div>
          </header>

          <div className="space-y-3 md:space-y-6">
            <SecurityMonitoring />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityMonitoringPage;
