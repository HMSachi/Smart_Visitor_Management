import React from "react";
import Header from "../../../components/Admin/Layout/Header";
import SecurityMonitoring from "../../../components/Admin/SecurityMonitoring/SecurityMonitoring";

const SecurityMonitoringPage = () => {
  return (
    <div className="flex flex-col min-w-0 bg-[var(--color-bg-default)] min-h-screen">
      <Header title="Security Monitoring" subtitle="Real-time surveillance and access point monitoring" />
      <div className="flex-1 p-4 md:p-8 !pt-2 space-y-3 md:space-y-6 animate-fade-in-slow overflow-y-auto bg-[var(--color-bg-default)] relative">
        {/* Dynamic Operational Aura */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>

        <div className="max-w-[1700px] mx-auto relative z-10">

          <div className="space-y-3 md:space-y-6">
            <SecurityMonitoring />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityMonitoringPage;
