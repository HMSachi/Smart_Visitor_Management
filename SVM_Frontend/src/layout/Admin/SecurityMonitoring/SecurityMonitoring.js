import React from 'react';

import Header from '../../../components/Admin/Layout/Header';
import SecurityMonitoring from '../../../components/Admin/SecurityMonitoring/SecurityMonitoring';

const SecurityMonitoringPage = () => {
  return (
    <div className="flex flex-col min-w-0 bg-[var(--color-bg-default)] min-h-screen">
        <Header />
        <SecurityMonitoring />
    </div>
  );
};

export default SecurityMonitoringPage;
